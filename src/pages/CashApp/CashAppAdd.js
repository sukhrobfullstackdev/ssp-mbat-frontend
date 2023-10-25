import React, {useContext, useState, useEffect} from "react";
import {
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Drawer,
    Form,
    Input,
    InputNumber,
    message,
    Row,
    Select,
    Space
} from "antd";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import { useTranslation } from 'react-i18next';
import axios from "../../api/axios";
import {LeftOutlined, PlusOutlined, TableOutlined} from "@ant-design/icons";
import {
    columnsAcc,
    dataSmetaAccFilter,
    dataSmetaAccTab,
} from "../Smeta/SmetaData";


import TableModal from "../../components/TableModalBM";

import {columnsCashAppExp, dataCashAppExpFilter, dataCashAppExpTab} from "../CashApp/CashAppData";
import TableExpModalCashApp, {getTabExpSum} from "./TableExpModalCashApp";
import {
    columnsVendor as columnsVendorSpr, columnsVendorBankAcc,
    dataFilter as dataVendorSprFilter,
    dataTab as dataVendorSprTab, dataVendorBankAccTab
} from "../Vendor/VendorData";
import NumberInputBM from "../../components/NumberInput";
import {DocumentTemplateSave} from "../../components/DocumentTemplateSave";
import {DocumentTemplate} from "../../components/DocumentTemplate";
import moment from "moment";
import dayjs from "dayjs";
import {dataSmetaExpOnlyTab} from "../Contract/ContractData";
const {TextArea} = Input;

const SAVE_URL = '/cash_app/save';
const QUERY_URL = '/api/public/query';

const CashAppAdd = () => {

    const navigate = useNavigate();

    const auth = useContext(AuthContext)

    const { t } = useTranslation();

    const [ dates, setDates] = useState({})
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const [openSpec, setOpenSpec] = useState(false)
    const [openGraph, setOpenGraph] = useState(false)
    const [specData, setSpecData] = useState()
    const [vendorIddoc, setVendorIddoc] = useState()
    const [needReload, setNeedReload] = useState(true)
    const [cashApp, setCashApp] = useState({})
    const [accCode, setAccCode] = useState()
    const [smetaData, setSmetaData] = useState({})

    const showSpec = () => { setOpenSpec(true) }
    const closeSpec = () => { setOpenSpec(false) }

    const showGraph = () => { setOpenGraph(true) }
    const closeGraph = () => { setOpenGraph(false) }

    const dateFormat = 'DD.MM.YYYY';

    const headers = {
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const onFinish = (values) => {
        console.warn(values ,'values');
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    const handleCreate = () => {


        form
            .validateFields()
            .then(async (values) => {
                console.log(JSON.stringify(values),'ttt')
                values["currency"] = '860'
                values["docDate"] = dates.docDate
                values["month"] = dates.month
                values["points"] = getTabExpSum()
                values["filial"] = auth.empFilial
                values["finYear"] = dates.docDate.substring(6)
                //values["sumTransit"] = (!values["sumTransit"])?0:values["sumTransit"]
                delete values.accName

                console.log(JSON.stringify(values),'ttt')
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

    const getDocExpense = async (iddoc) => {
        console.log(iddoc)

        const f_docDate = form.getFieldValue('docDate');
        const f_acc = form.getFieldValue('acc');
        if (!f_docDate || f_docDate === '') {
            messageApi.open({
                type: 'warning',
                content: 'Суровнома санасини танланг',
                duration: 2,});
            return;
        }
        if (!f_acc || f_acc === '') {
            messageApi.open({
                type: 'warning',
                content: 'Хисоб ракамни танланг',
                duration: 3,});
            return;
        }

        const tt = {"query": {
                "id": "get_smeta_by_acc_date_submitted_v",
                "source": "get_smeta_by_acc_date_submitted_v('"+f_acc+"',"+parseInt(f_docDate.format('YYYY'))+","+parseInt(f_docDate.format('MM'))+")",
                    "fields": [
                    {   "column": "acc", "format": "text", "type": "text" },
                    {   "column": "expense", "format": "text", "type": "text" },
                    {   "column": "smeta", "format": "number", "type": "number" },
                ]
            }
        }

        const { data } = await axios.post(QUERY_URL,
            ( tt ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });

        /*dataSmetaExpOnlyTab.query['filters'] = [
            { "column": "finyear", "value": parseInt(f_docDate.format('YYYY')), "operator": "=", "dataType": "number" },
            { "column": "acc", "value": f_acc, "operator": "=", "dataType": "text" }
        ];

        const { data } = await axios.post(QUERY_URL,
            ( dataSmetaExpOnlyTab ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });*/

        if (data.length === 0) {
            messageApi.open({
                type: 'warning',
                content: 'Бу хисоб ракамга смета киритилмаган',
                duration: 3,});
            return;
        }

        console.log(data,'11')

        const expFilter = {
            column: 'code',
            value: data.map(obj => obj.expense),
            operator: 'in',
            dataType: 'text'
        };

            console.log(expFilter,'expFilter')
        setSmetaData({"expFilter": [expFilter], "smetaSum": data})

    }

    const changeVendorCode = (res) => {
        form.setFieldValue('vendorId',res.id)
        form.setFieldValue('coInn',res.inn)
        form.setFieldValue('coPinfl',res.pinfl)
        form.setFieldValue('coName',res.name)

        form.setFieldValue('coAcc','')
        form.setFieldValue('coMfo','')
        setVendorIddoc(res.id)
        setNeedReload(true)
    }

    const changeClAccCode = (res) => {
        form.setFieldValue('acc',res.code)
        form.setFieldValue('accName',res.name)
        form.setFieldValue('accid',res.id)
        setAccCode(res)
        getDocExpense(res.code)
    }

    const changeCoAccCode = (res) => {
        form.setFieldValue('coAcc',res.code)
        form.setFieldValue('coName',res.name)
        form.setFieldValue('coMfo',res.mfo)
//        setAccCode(res)
    }

    const changeBankAccCode = (res) => {
        form.setFieldValue('coAcc',res.account)
        form.setFieldValue('coMfo',res.mfo)
//        setAccCode(res)
    }

    useEffect(() => {

    }, []);

    function changeDateFormat(date, dateString, evDate){
        let updatedValue = {};
        updatedValue[evDate] = dateString;
        setDates(dates => ({
            ...dates,
            ...updatedValue
        }));
    }

    const calculateSumpay = () => {
        const totalSumpay = getTabExpSum().reduce(function (previousVal, currentVal) {
            return previousVal + parseFloat(currentVal.sumPay)
        }, 0)
        console.log(totalSumpay,'totalSumpay')
        form.setFieldValue('sumPay', totalSumpay)
    }

    const handleExpenses = () => {
        const docDate = form.getFieldValue('docDate')
        const acc = form.getFieldValue('acc')
        if (acc && docDate) return true
        else {
            messageApi.open({
                type: 'warning',
                content: 'Суровнома санаси ва хисоб ракамни танланг',
            }).then((r)=> console.log(r,'r'));
            return false
        }
    }

    //BEG TEMPLATE

    const removeUndefinedKeys = (obj) => {
        const filteredObj = {};
        for (const key in obj) {
            if (obj[key] !== undefined) {
                filteredObj[key] = obj[key];
            }
        }
        return filteredObj;
    };

    const saveTemplate = () => {
        console.log('saveTemplate')

        let formTemplate = form.getFieldsValue()

        console.log(formTemplate, 'ff')

        formTemplate["currency"] = '860'
        formTemplate["docDate"] = dates.docDate
        formTemplate["month"] = dates.month
        formTemplate["points"] = getTabExpSum()
        formTemplate["filial"] = auth.empFilial
        formTemplate["finYear"] = dates.docDate.substring(6)
        console.log(formTemplate,'ffbef')
        formTemplate = removeUndefinedKeys(formTemplate);
        console.log(formTemplate,'ffAfter')

        return formTemplate
    }

    const getDataByTemplate = async (data) => {
        console.log(data,'getDataByTemplate')
        setCashApp(data);
        form.setFieldsValue({
            ...data,
            docDate: data.docDate ? dayjs(data.docDate,'DD.MM.YYYY') : null,
            month: data.month ? dayjs(data.month, "MM") : null,
            finYear: data.finYear ? dayjs(data.finYear, "YYYY") : null,
        })
        getDocExpense(data.acc)
    };

    // END TEMPLATE

    return (
        <>
            {contextHolder}
            <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", justifyContent: "left", alignItems:"center", padding:"12px"}}>
                <h3><Button shape="circle" icon={<LeftOutlined />}  style={{fontSize:'14px',marginRight:"10px"}} onClick={handleFormExit}/>Накд пул маблаги олиш учун суровнома яратиш</h3>
            </div>

            <Form layout="vertical" name="addPaydoc" form={form} scrollToFirstError initialValues={{"sumTransit":0, "sumPay":0}} onFinish={onFinish} style={{display:"flex", justifyContent:"center"}}>

                <Row gutter={[16, 16]} style={{marginRight:'0',marginLeft:'0'}}>

                    <Col span={24}>

                        <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"50px", justifyContent: "space-between", alignItems:"center", paddingLeft:"30px"}}>

                            <div style={{display:"flex", gap:"10px"}}>

                                <Button type="primary" htmlType="submit" onClick={handleCreate}>
                                    Яратиш
                                </Button>

                                {/*<Button type="primary" onClick={showSpec} icon={<TableOutlined />}>
                                    Харажатлар
                                </Button>*/}
                                { cashApp && (
                                    <TableExpModalCashApp
                                                    modalDataTab={dataCashAppExpTab}
                                                    points = {cashApp.points}
                                                    modalColumnTab={columnsCashAppExp}
                                                    modalFilterTab={dataCashAppExpFilter}
                                                    calculateSumpay={calculateSumpay}
                                                    condition={handleExpenses}
                                                    smetaData={smetaData}
                                                    modalTitleTab="Харажатлар"
                                                    buttonTitleTab="Харажатлар"
                                    />
                                )}

                                {/*<Drawer
                                    title="Харажатлар"
                                    width={1000}
                                    placement='left'
                                    onClose={closeSpec}
                                    open={openSpec}
                                    bodyStyle={{
                                        paddingBottom: 80,
                                    }}
                                    extra={
                                        <Space>
                                            <Button onClick={closeSpec}>Бекор килиш</Button>
                                            <Button onClick={saveSpec} type="primary">
                                                Саклаш
                                            </Button>
                                        </Space>
                                    }
                                >
                                    <CNSpecification setSpecData={setSpecData} />

                                </Drawer>*/}

                                <Button htmlType="reset">
                                    Тозалаш
                                </Button>

                            </div>

                            <div style={{display:"flex", gap:"10px"}}>

                                <DocumentTemplateSave documentType="CASH_APP" handleSaveTemplate={saveTemplate}/>

                                <DocumentTemplate documentType="CASH_APP" handleLoadDocument={getDataByTemplate}/>

                            </div>

                        </div>

                    </Col>

                    {/*</Row>

                <Row gutter={[8, 8]} style={{marginRight:'0',marginLeft:'0'}}>*/}

                    <Col span={14} >

                        <Space size={20} align="start" >

                            <Space size={20} direction="horizontal" align="start" >

                                <Card
                                    title="Суровнома"
                                    size="small"
                                    type="inner"
                                    style={{
                                        width: 600,
                                    }}
                                >
                                    <Space direction="horizontal" size="small">

                                        <Space direction="horizontal" size="small">

                                            <Form.Item name="docNumb" label="Раками" rules={[{required: true, message:'Суровнома раками киритинг!'}]}>
                                                <Input/>
                                            </Form.Item>

                                            <Form.Item name="docDate" label="Санаси" rules={[{required: true, message:'Суровнома санаси киритинг!'}]}>
                                                <DatePicker label="Санаси" format={dateFormat} onChange={(date, dateString) => changeDateFormat(date, dateString, 'docDate')}>

                                                </DatePicker>
                                            </Form.Item>

                                        </Space>

                                        <Space direction="horizontal" size="small">

                                            <Form.Item name="month" label="Ой" rules={[{required: true, message:'Ойни танланг!'}]}>

                                                <DatePicker picker="month" format="MM" onChange={(date, dateString) => changeDateFormat(date, dateString, 'month')}/>

                                            </Form.Item>

                                        </Space>

                                    </Space>


                                    <Space direction="horizontal" size="small">

                                        <Form.Item name="acc" label={t('acc')} rules={[{required: true, message:'Хисоб ракамини киритинг!'}]}>
                                            <Input size="200" readOnly='readOnly'/>
                                        </Form.Item>

                                        <TableModal modalDataTab={dataSmetaAccTab(auth.empId)}
                                                    modalColumnTab={columnsAcc(t)}
                                                    modalFilterTab={dataSmetaAccFilter}
                                                    modalTitleTab="Хисоб ракамлар"
                                                    filterKey="cashAppAccRef"
                                                    onSubmit={ changeClAccCode }
                                        />

                                        <Form.Item name="accid" label={t('acc')} hidden={true} rules={[{required: true, message:'Хисоб ракамни киритинг!'}]}>
                                            <Input/>
                                        </Form.Item>

                                        <Form.Item name="accName" label={t('accName')} rules={[{required: true, message:'Хисоб ракамини номини киритинг!'}]}>
                                            <TextArea size="medium" readOnly="true" style={{width:300}} autoSize={{
                                                minRows: 1,
                                                maxRows: 2,
                                            }}/>
                                        </Form.Item>



                                    </Space>

                                    <Space direction="horizontal" >

                                        <Form.Item name="sumPay" label="Умумий сумма" rules={[{required: true, message:'Умумий суммани киритинг!'}]}>
                                            <InputNumber
                                                style={{
                                                    width: '100%',
                                                    textAlign: 'end'

                                                }}
                                                className='bm-input-number-align-right'
                                                defaultValue={0}
                                                step={null}
                                                disabled
                                                controls={false}
                                                addonAfter="сум"
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            />
                                        </Form.Item>

                                        <Form.Item name="sumTransit" label="Пластик картага утказиладиган сумма" rules={[{required: false, message:'Пластик картага утказиладиган суммани киритинг!'}]}>
                                            <InputNumber
                                                style={{
                                                    width: '100%',
                                                    textAlign: 'end'

                                                }}
                                                className='bm-input-number-align-right'
                                                defaultValue={0}
                                                step={null}
                                                controls={false}
                                                addonAfter="сум"
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            />
                                        </Form.Item>

                                    </Space>

                                    <Form.Item name="purpose" label={t('purpose')} rules={[{required: true, message:'Тулов максадини киритинг!'}]}>
                                        <TextArea size="medium" autoSize={{
                                            minRows: 3,
                                            maxRows: 5,
                                        }}/>
                                    </Form.Item>

                                </Card>

                                {/*<Card
                                    title={t('recip')}
                                    size="small"
                                    style={{
                                        width: 500,
                                    }}
                                >

                                    <Space direction="horizontal">

                                        <Form.Item name="coAcc" style={{width:"200px"}} label={t('recipAcc')} rules={[{required: true, message:'Олувчи Х.Р. киритинг!'}]}>
                                            <Input />
                                        </Form.Item>

                                        <TableModal modalDataTab={dataSmetaAccTab(auth.empId)}
                                                    modalColumnTab={columnsAcc(t)}
                                                    modalFilterTab={dataSmetaAccFilter}
                                                    modalTitleTab={t('accTitle')}
                                                    onSubmit={ changeCoAccCode }
                                        />

                                        <Form.Item name="coInn" label={t('recipInn')} rules={[{
                                                required: true, message:'Олувчи ИНН киритинг!'
                                            },{
                                                pattern: /^[0-9]*$/, message: 'Факат ракам киритинг',
                                            },{
                                                max: 9, message: '9 та ракам киритинг',
                                            },{
                                                min: 9, message: '9 та ракам киритинг',
                                            },
                                        ]}
                                        >
                                            <Input maxLength={9}/>
                                        </Form.Item>

                                        <Form.Item name="coMfo" label={t('recipMfo')} rules={[{required: true, message:'Олувчи МФО киритинг!'}]}>
                                            <Input />
                                        </Form.Item>

                                    </Space>

                                    <Form.Item name="coName" label={t('recipName')} rules={[{required: true, message:'Олувчи номи киритинг!'}]}>
                                        <TextArea size="medium" readOnly="true" autoSize={{
                                            minRows: 2,
                                            maxRows: 3,
                                        }}/>
                                    </Form.Item>

                                </Card>*/}

                                <Card
                                    title="Таъминотчи"
                                    type="inner"
                                    size="small"
                                    style={{
                                        width: 600,
                                    }}
                                >

                                    <Space direction="horizontal">

                                        <Form.Item name="vendorId" style={{width:180}} label="Таъминотчи" rules={[{required: true, message:'Таъминотчи танланг!'}]}>
                                            <Input readOnly="true"/>
                                        </Form.Item>

                                        <TableModal modalDataTab={dataVendorSprTab}
                                                    modalColumnTab={columnsVendorSpr}
                                                    modalFilterTab={dataVendorSprFilter}
                                                    modalTitleTab="Таъминотчилар"
                                                    filterKey="cashAppVendorRef"
                                                    onSubmit={ changeVendorCode }
                                        />

                                        <Form.Item name="coInn" style={{width:130}} label="ИНН" rules={[{required: true, message:'Таъминотчи ИНН сини киритинг!'}]}>
                                            <NumberInputBM
                                                style={{ width: '100%' }}
                                                maxLength={9}
                                            />
                                        </Form.Item>

                                        <Form.Item name="coPinfl" style={{width:160}} label="ПИНФЛ" rules={[{required: false, message:'Таъминотчи ПИНФЛ ни киритинг!'}]}>
                                            <NumberInputBM
                                                style={{ width: '100%' }}
                                                maxLength={14}
                                            />
                                        </Form.Item>

                                    </Space>

                                    <Form.Item name="coName" label="Таъминотчи номи" rules={[{required: true, message:'Таъминотчи номини киритинг!'}]}>
                                        <TextArea size="medium" readOnly="true" autoSize={{
                                            minRows: 3,
                                            maxRows: 5,
                                        }}/>
                                    </Form.Item>

                                    <Divider orientation="left">Банк хисоб раками</Divider>

                                    <Space direction="horizontal" >

                                        <Form.Item name="coAcc" label="Банк х.р." rules={[{required: true, message:'Банк х.р. ни киритинг!'}]}>
                                            <Input readOnly="true"/>
                                        </Form.Item>

                                        <Form.Item name="coMfo" style={{width:'80px'}} label="МФО" rules={[{required: true, message:'МФОни киритинг!'}]}>
                                            <Input readOnly="true"/>
                                        </Form.Item>

                                        {form.getFieldValue('vendorId') &&

                                            <TableModal modalDataTab={dataVendorBankAccTab}
                                                        modalColumnTab={columnsVendorBankAcc}
                                                        modalFilterTab={[]}
                                                        modalTitleTab="Банк хисоб ракамлари"
                                                        needReload={needReload}
                                                        filterKey="cashAppVendorBankAccRef"
                                                        defFilter={[{"column":"vendor_id","value":vendorIddoc, "operator":"=", "dataType":"number"}]}
                                                        onSubmit={ changeBankAccCode }
                                            />
                                        }

                                    </Space>

                                </Card>

                            </Space>

                        </Space>

                    </Col>

                </Row>

            </Form>
        </>
    )
}

export default CashAppAdd;