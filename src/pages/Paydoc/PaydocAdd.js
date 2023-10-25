import React, {useContext, useState, useEffect} from "react";
import {Button, Card, Checkbox, Col, DatePicker, Form, Input, InputNumber, message, Row, Select, Space, Radio} from "antd";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "../../api/axios";
import {LeftOutlined} from "@ant-design/icons";
import {
    columnsAcc,
    dataSmetaAccFilter,
    dataSmetaAccTab, dataTab,
} from "../Smeta/SmetaData";
import {
    columnsPaydocExp, dataPaydocExpTab, dataPaydocExpFilter,
    dataContractIdTab, dataContractIdFilter, columnsContractId,
    dataCashAppIdTab, columnsCashAppId, dataCashAppIdFilter
} from "./PaydocData";
import TableModal from "../../components/TableModalBM";
import TableExpModal, {getTabExpSum} from "../../components/TableExpModalBm";
import { useTranslation } from 'react-i18next';
import dayjs from "dayjs";
import {DocumentTemplateSave} from "../../components/DocumentTemplateSave";
import {DocumentTemplate} from "../../components/DocumentTemplate";
import {removeUndefinedKeys} from "../../libs/formbm";
import {useFilter} from "../../context/FilterContext";

const {TextArea} = Input;

const SAVE_URL = '/paydoc/save';
const QUERY_URL = '/api/public/query';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const tailLayout = {
    wrapperCol: {
        offset: 1,
        span: 23,
    },
};

const PaydocAdd = () => {

    const navigate = useNavigate();

    const { t } = useTranslation();

    const auth = useContext(AuthContext)
    const [ dates, setDates] = useState({})
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const [isAvans,setIsAvans] = useState(false)
    const [docSumpay,setDocSumpay] = useState(0)
    const [expDefFilter,setExpDefFilter] = useState([])
    const [clAccState,setClAccState] = useState(0)
    const [paydoc, setPaydoc] = useState({})
    const [bankFlag, setBankFlag] = useState('N')

    const dateFormat = 'DD.MM.YYYY';

    const headers = {
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const accDefFilter = [{
        column: 'filial',
        operator: '=',
        value: auth.empFilial,
        dataType: 'text',
    }]

    const onFinish = (values) => {
        console.warn(values ,'values');
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    const changeBankFlag = ({ target: { value } }) => {
        setBankFlag(value);
    };

    const handleCreate = () => {

        //console.log(getExpArr(),'eeed')
        //console.log(getExpenseSum(),'getExpenseSum')
        console.log(getTabExpSum(),'getTabExpSum()')
        console.log(isAvans.toString(),'isAvans')
        console.log(dates.docDate,'dates.docDate')
        console.log(dates.bankDate,'dates.bankDate');
        form
            .validateFields()
            .then(async (values) => {
                values["docDate"] = dates.docDate
                values["bankDate"] = dates.bankDate
                //values["id"] = 0
                values["direction"] = -1
                values["docType"] = 1
                values["finYear"] = dayjs(form.getFieldValue('docDate'),'YYYY')["$y"]
                values["paydocPoints"] = getTabExpSum()
                values["isAvans"] = isAvans===true?'Y':'N'

                delete values.accName;


                console.log(JSON.stringify(values),'ttt')


                //navigate("../smetaCreate",{state: { smetaType:values["smeta_type"], finYear: values["finyear"], acc:values['acc']}});

                try {
                    const data = await axios.post(SAVE_URL,

                        JSON.stringify(values),
                        {
                            headers: headers,
                            crossDomain: true,
                            withCredentials: false
                        }
                        // )
                    )
                    //message.success(data);
                    messageApi.open({
                        type: 'success',
                        content: 'Муввафакият',
                        duration: 2,
                    }).then(()=> handleFormExit());
                } catch (err) {
                    messageApi.open({
                        type: 'error',
                        content: err.response?.data?.message,
                    });
                    //message.error(err.response?.data);
                }

            }).catch((errorInfo) => {
            console.log('errorInfo ...', errorInfo);
        }).then(r => r);

    };

    const handleFormExit = () => {
        navigate(-1)
    }

    /*const changeAccCode = (res) => {
        form.setFieldValue('acc',res.code)
        form.setFieldValue('accName',res.name)
        form.setFieldValue('accId',res.id)
//        setAccCode(res)
    }*/

    const changeCoAccCode = (res) => {
        form.setFieldValue('coAcc',res.code)
        form.setFieldValue('coName',res.name)
        form.setFieldValue('coMfo',res.mfo)
        form.setFieldValue('coInn',res.inn)
//        setAccCode(res)
    }

    const changeClAccCode = (res) => {
        form.setFieldValue('clAcc',res.code)
        form.setFieldValue('clName',res.name)
        form.setFieldValue('clMfo',res.mfo)
        form.setFieldValue('clInn',res.inn)
        form.setFieldValue('accId',res.id)
        form.setFieldValue('acc',res.code)

        form.setFieldValue('cashAppId','')
        form.setFieldValue('contractId','')
        form.setFieldValue('coAcc','')
        form.setFieldValue('coName','')
        form.setFieldValue('coMfo','')
        form.setFieldValue('coInn','')
//        setAccCode(res)
    }

    const getDocExpense = async (iddoc, doctype) => {
        console.log(iddoc)
        console.log(doctype)

        const dataDoc = {
            "query": {
                "id": "get_paydoc_basedoc_expense_list",
                "source": "get_paydoc_basedoc_expense_list("+iddoc+",'"+doctype+"')",
                "fields": [
                    {   "column": "expense", "format": "text", "type": "text" },
                ]
            }
        }

        try {
            const { data } = await axios.post(QUERY_URL,
                ( dataDoc ),
                {
                    headers: headers,
                    withCredentials: false
                });
                console.log(data,'llll')
                const expensesArr = data.map(item => item.expense);
                console.log(expensesArr,'llll')
                setExpDefFilter([{"column":"code", "value":expensesArr, "operator":"in", "dataType":"text"}])
        } catch (err) {
            messageApi.open({
                type: 'error',
                content: err.response?.data?.message,
            }).then((r)=> console.log(r,'r'));
            console.log(err,'err')
            //message.error(err.response?.data);
        }
    }

    const changeContractId = (res) => {
        form.setFieldValue('cashAppId','')
        form.setFieldValue('contractId',res.id)
        form.setFieldValue('coAcc',res.vendor_bank_acc)
        form.setFieldValue('coName',res.vendor_name)
        form.setFieldValue('coMfo',res.vendor_bank_code)
        form.setFieldValue('coInn',res.vendor_inn)

        getDocExpense(res.id, 'CONTRACT')
    }

    const changeCashAppId = (res) => {
        form.setFieldValue('contractId','')
        form.setFieldValue('cashAppId',res.id)
        form.setFieldValue('coAcc',res.co_acc)
        form.setFieldValue('coName',res.co_name)
        form.setFieldValue('coMfo',res.co_mfo)
        form.setFieldValue('coInn',res.co_inn)

        getDocExpense(res.id, 'CASH_APP')
    }

    const handlePayAcc = () => {
        const pay_clAcc = form.getFieldValue('clAcc')
        if (pay_clAcc) { setClAccState(pay_clAcc); return true}
        else {
            messageApi.open({
                type: 'warning',
                content: 'Туловчини танланг',
            }).then((r)=> console.log(r,'r'));
            return false
        }
    }

    const handleExpenses = () => {
        const cn_id = form.getFieldValue('contractId')
        const ca_id = form.getFieldValue('cashAppId')
             if (ca_id) return true
        if (cn_id) return true
        else {
            messageApi.open({
                type: 'warning',
                content: 'Шартнома еки суровномани танланг',
            }).then((r)=> console.log(r,'r'));
            return false
        }
    }

   /* useEffect(() => {

    }, []);*/

    useEffect(() => {
        if (docSumpay!==0){
            form.setFieldValue('sumPay',docSumpay)
        }
    }, [docSumpay]);

    function changeDateFormat(date, dateString){
        let updatedValue = {};
        updatedValue = {"docDate":dateString};
        setDates(dates => ({
            ...dates,
            ...updatedValue
        }));

    }

    function changeDateFormatb(date, dateString){

        let updatedValue = {};
        updatedValue = {"bankDate":dateString};
        setDates(dates => ({
            ...dates,
            ...updatedValue
        }));
    }

    const saveTemplate = () => {
        console.log('saveTemplate')

        let formTemplate = form.getFieldsValue()

        console.log(formTemplate, 'ff')

        formTemplate["docDate"] = dates.docDate
        formTemplate["bankDate"] = dates.bankDate
        //values["id"] = 0
        formTemplate["direction"] = 1
        formTemplate["docType"] = 1
        formTemplate["finYear"] = dayjs(form.getFieldValue('docDate'),'YYYY')["$y"]
        formTemplate["paydocPoints"] = getTabExpSum()
        formTemplate["isAvans"] = isAvans===true?'Y':'N'

        console.log(formTemplate,'ffBegin')
        formTemplate = removeUndefinedKeys(formTemplate);
        console.log(formTemplate,'ffAfter')

        return formTemplate
    }

    const getDataByTemplate = async (data) => {
        if (data.cashAppId && data.cashAppId !== '' )  getDocExpense(data.cashAppId, 'CASH_APP');
        if (data.contractId && data.contractId !== '') getDocExpense(data.contractId, 'CONTRACT');
        let dDate = data.docDate ? data.docDate : null;
        let bDate = data.bankDate ? data.bankDate : null;
        form.setFieldsValue({
            ...data,
            bankDate: data.bankDate ? dayjs(data.bankDate, "DD.MM.YYYY") : null,
            docDate: data.docDate ? dayjs(data.docDate, "DD.MM.YYYY") : null,
        })
        setIsAvans(data.isAvans === 'Y')
        changeDateFormat(dDate, dDate)
        changeDateFormatb(bDate, bDate)
        setPaydocData(data);
    };

    const setPaydocData = (data) => {
        setPaydoc(data);
    }

    return (
        <>
            {contextHolder}
            <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", justifyContent: "left", alignItems:"center", padding:"12px"}}>
                <h3><Button shape="circle" icon={<LeftOutlined />}  style={{fontSize:'14px',marginRight:"10px"}} onClick={handleFormExit}/>{t('paydocTitle')}</h3>
            </div>

            <Form layout="vertical" name="addPaydoc" form={form} scrollToFirstError initialValues={{'bankSendFlag':0}} onFinish={onFinish} style={{display:"flex", justifyContent:"center"}}>

                <Row gutter={[48, 24]} style={{marginRight:'0',marginLeft:'0'}}>

                    <Col span={24}>

                        <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"50px", justifyContent: "space-between", alignItems:"center", paddingLeft:"30px", marginBottom:"20px"}}>

                            <div style={{display:"flex", gap:"10px"}}>

                                <Button type="primary" htmlType="submit" onClick={handleCreate}>
                                    {t('create')}
                                </Button>

                                {paydoc && (

                                    <TableExpModal modalDataTab={dataPaydocExpTab}
                                                   paydocPoints = {paydoc.paydocPoints}
                                                   modalColumnTab={columnsPaydocExp(t)}
                                                   modalFilterTab={dataPaydocExpFilter}
                                                   modalTitleTab={t('expenses')}
                                                   buttonTitleTab={t('expenses')}
                                                   condition={handleExpenses}
                                                   defFilter={expDefFilter}
                                                   setDocSumpay={setDocSumpay}
                                    />

                                )}

                                <Button htmlType="reset">
                                    {t('clear')}
                                </Button>

                            </div>

                            <div style={{display:"flex", gap:"10px"}}>

                                <DocumentTemplateSave documentType="PAYDOC" handleSaveTemplate={saveTemplate}/>

                                <DocumentTemplate documentType="PAYDOC" handleLoadDocument={getDataByTemplate}/>

                            </div>

                        </div>

                    </Col>

                {/*</Row>

                <Row gutter={[8, 8]} style={{marginRight:'0',marginLeft:'0'}}>*/}

                    <Col span={8}>

                        <Card
                            title={t('document')}
                            type="inner"
                            size="small"
                            style={{
                                width: 400,
                            }}
                        >

                            <Space direction="horizontal">

                                <Form.Item name="docNumb" label={t('docNumb')} rules={[{required: true, message:'Хужжат санаси киритинг!'}]}>
                                    <Input/>
                                </Form.Item>

                                <Form.Item name="docDate" label={t('docDate')} rules={[{required: true, message:'Хужжат санаси киритинг!'}]}>
                                    <DatePicker label={t('docDate')} format={dateFormat} onChange={changeDateFormat}>

                                    </DatePicker>
                                </Form.Item>

                            </Space>

                            <Space direction="horizontal">

                                <Form.Item name="sumPay" label={t('sumpay')} rules={[{required: true, message:'Сумма киритинг!'}]}>
                                    <InputNumber
                                        style={{
                                            width: '100%',
                                            textAlign: 'end'

                                        }}
                                        className='bm-input-number-align-right'
                                        defaultValue={0}
                                        step={null}
                                        controls={false}
                                        disabled
                                        readOnly='readOnly'
                                        //prefix="$"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>

                                <Form.Item name="bankDate" label={t('bankDay')} rules={[{required: true, message:'Банк санаси киритинг!'}]}>
                                    <DatePicker label={t('bankDay')} format={dateFormat} onChange={changeDateFormatb}>

                                    </DatePicker>
                                </Form.Item>

                            </Space>

                            <Space direction="horizontal">

                                <Form.Item name="acc" hidden={true} style={{width:"300px"}} label={t('acc')} rules={[{required: true, message:'Хисоб ракамни киритинг!'}]}>
                                    <Input/>
                                </Form.Item>

                                {/*<TableModal modalDataTab={dataSmetaAccTab}
                                            modalColumnTab={columnsAcc(t)}
                                            modalFilterTab={dataSmetaAccFilter}
                                            modalTitleTab={t('accTitle')}
                                            onSubmit={ changeAccCode }
                                />*/}

                                <Form.Item name="accId" label={t('acc')} hidden={true} rules={[{required: true, message:'Хисоб ракамни киритинг!'}]}>
                                    <Input/>
                                </Form.Item>

                            </Space>

                            <Space direction="horizontal">

                                <Form.Item name="accName" hidden={true} style={{width:"300px"}} label={t('accName')} rules={[{required: false}]}>
                                    <TextArea size="medium" readOnly="readOnly" autoSize={{
                                        minRows: 2,
                                        maxRows: 3,
                                    }}/>
                                </Form.Item>

                            </Space>

                            <Form.Item name="purpose" label={t('payDetail')} rules={[{required: true, message:'Тулов максадини киритинг!'}]}>
                                <TextArea size="medium" autoSize={{
                                    minRows: 3,
                                    maxRows: 5,
                                }}/>
                            </Form.Item>

                            <Form.Item name="bankSendFlag" label={t('Банкга жунатиш (Ха, Йук)')} rules={[{required: true, message:'Банкга жунатиш!'}]}>
                                <Radio.Group
                                    options={[{label:'Ха',value:1},{label:'Йук',value:0}]}
                                    onChange={changeBankFlag}
                                    value={bankFlag}
                                    optionType="button"
                                    buttonStyle="solid"
                                />
                            </Form.Item>

                        </Card>

                    </Col>

                    <Col span={10} >

                        <Card
                            title={t('payer')}
                            size="small"
                            type="inner"
                            style={{
                                width: 500,
                            }}
                        >

                            <Space direction="horizontal">

                                <Form.Item name="clAcc" style={{width:"200px"}} label={t('payerAcc')} rules={[{required: true, message:'Туловчи Х.Р. киритинг!'}]}>
                                    <Input/>
                                </Form.Item>

                                <TableModal modalDataTab={dataSmetaAccTab(auth.empId)}
                                            modalColumnTab={columnsAcc(t)}
                                            modalFilterTab={dataSmetaAccFilter}
                                            modalTitleTab={t('accTitle')}
                                            filterKey="paydocAccFilter"
                                            onSubmit={ changeClAccCode }
                                />

                                <Form.Item name="clInn" label={t('payerInn')} rules={[{required: true, message:'Туловчи ИНН киритинг!'}]}>
                                    <Input size="10" />
                                </Form.Item>

                                <Form.Item name="clMfo" label={t('payerMfo')} rules={[{required: true, message:'Туловчи МФО киритинг!'}]}>
                                    <Input />
                                </Form.Item>

                            </Space>

                            <Form.Item name="clName" label={t('payerName')} rules={[{required: true, message:'Туловчи номи киритинг!'}]}>
                                <TextArea size="medium" readOnly="readOnly" autoSize={{
                                    minRows: 2,
                                    maxRows: 3,
                                }}/>
                            </Form.Item>

                        </Card>

                        <Card
                            title={t('recip')}
                            type="inner"
                            size="small"
                            style={{
                                width: 500,
                                marginTop: '10px'
                            }}
                        >

                            <Space direction="horizontal">

                                <Form.Item name="coAcc" style={{width:"200px"}} label={t('recipAcc')} rules={[{required: true, message:'Олувчи Х.Р. киритинг!'}]}>
                                    <Input />
                                </Form.Item>

                                {/*<TableModal modalDataTab={dataSmetaAccTab}
                                            modalColumnTab={columnsAcc(t)}
                                            modalFilterTab={dataSmetaAccFilter}
                                            modalTitleTab={t('accTitle')}
                                            onSubmit={ changeCoAccCode }
                                />
*/}
                                <Form.Item name="coInn" label={t('recipInn')} rules={[{required: true, message:'Олувчи ИНН киритинг!'}]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item name="coMfo" label={t('recipMfo')} rules={[{required: true, message:'Олувчи МФО киритинг!'}]}>
                                    <Input />
                                </Form.Item>

                            </Space>

                            <Form.Item name="coName" label={t('recipName')} rules={[{required: true, message:'Олувчи номи киритинг!'}]}>
                                <TextArea size="medium" readOnly="readOnly" autoSize={{
                                    minRows: 2,
                                    maxRows: 3,
                                }}/>
                            </Form.Item>



                        </Card>

                    </Col>

                    <Col span={6} >

                        <Card
                            title={t('legal')}
                            type="inner"
                            size="small"
                            style={{
                                width: 300,
                            }}
                        >

                            <Space direction="vertical">

                                <Space direction="horizontal">

                                    <Form.Item name="contractId" style={{width:"150px"}} label={t('legal')} rules={[{required: false, message:'Юридик мажбуриятни танланг!'}]}>
                                        <Input readOnly="readOnly"/>
                                    </Form.Item>

                                    <TableModal modalDataTab={dataContractIdTab}
                                                modalColumnTab={columnsContractId(t)}
                                                modalFilterTab={dataContractIdFilter}
                                                modalTitleTab={t('legal')}
                                                condition={handlePayAcc}
                                                filterKey="paydocContractRef"
                                                defFilter={[{"column":"acc","value":clAccState,"operator":"=","dataType":"text"}]}
                                                onSubmit={ changeContractId }
                                    />

                                </Space>

                                <Space direction="horizontal">

                                    <Form.Item name="cashAppId" style={{width:"150px"}} label={t('application')} rules={[{required: false, message:'Суровномани танланг!'}]}>
                                        <Input readOnly="readOnly"/>
                                    </Form.Item>

                                    <TableModal modalDataTab={dataCashAppIdTab}
                                                modalColumnTab={columnsCashAppId(t)}
                                                modalFilterTab={dataCashAppIdFilter}
                                                modalTitleTab={t('application')}
                                                condition={handlePayAcc}
                                                filterKey="paydocCashAppRef"
                                                defFilter={[{"column":"acc","value":clAccState,"operator":"=","dataType":"text"}]}
                                                onSubmit={ changeCashAppId }
                                    />

                                </Space>

                                <Form.Item name="isAvans" initialValue={isAvans}>

                                    <Checkbox
                                        checked={isAvans}
                                        onChange={(e) => setIsAvans(e.target.checked)}
                                    >
                                        {t('avans')}
                                    </Checkbox>

                                </Form.Item>

                            </Space>

                        </Card>

                    </Col>

                </Row>

            </Form>
        </>
    )
}

export default PaydocAdd;