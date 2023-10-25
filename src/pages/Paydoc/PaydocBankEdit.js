import React, {useContext, useState, useEffect} from "react";
import {Button, Card, Checkbox, Col, DatePicker, Form, Input, InputNumber, message, Row, Select, Space, Radio} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "../../api/axios";
import moment from "moment"
import {LeftOutlined, TableOutlined} from "@ant-design/icons";
import {
    columnsAcc,
    dataSmetaAccFilter,
    dataSmetaAccTab,
} from "../Smeta/SmetaData";
import {
    columnsPaydocExp, dataPaydocExpTab, dataPaydocExpFilter,
    dataContractIdTab, dataContractIdFilter, columnsContractId,
    dataCashAppIdTab, columnsCashAppId, dataCashAppIdFilter
} from "./PaydocData";
import TableModal from "../../components/TableModalBM";
import TableExpModal, {getTabExpSum} from "../../components/TableExpModalBmEdit";
import { useTranslation } from 'react-i18next';
import dayjs from "dayjs";

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

const PaydocBankEdit = () => {

    const navigate = useNavigate();

    const { t } = useTranslation();
    const { id,paydocState } = useParams();

    const auth = useContext(AuthContext)
    const [ dates, setDates] = useState({})
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const [isAvans,setIsAvans] = useState(false)
    const [docSumpay,setDocSumpay] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [paydoc, setPaydoc] = useState({})
    const [loading, setLoading] = useState(true)
    const [bankFlag, setBankFlag] = useState('N')

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

    const changeBankFlag = ({ target: { value } }) => {
        setBankFlag(value);
    };

    const handleCreate = () => {

        form
            .validateFields()
            .then(async (values) => {

                values.docDate = values.docDate.format('DD.MM.YYYY');
                values.bankDate = values.bankDate.format('DD.MM.YYYY');
                //values["id"] = 0
                values["direction"] = -1
                values["paydocPoints"] = getTabExpSum() ? getTabExpSum() : paydoc.paydocPoints
                values["isAvans"] = isAvans===true?'Y':'N'

                //console.log(values,'lolololo')
                //console.log({...paydoc, ...values},'loloasdasdasdlo')
                //return false;

                delete values.accName;


                //navigate("../smetaCreate",{state: { smetaType:values["smeta_type"], finYear: values["finyear"], acc:values['acc']}});

                try {
                    // console.log({...paydoc, ...values});
                    const data = await axios.post(SAVE_URL,

                        JSON.stringify({...paydoc, ...values}),
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
//        setAccCode(res)
    }

    const changeContractId = (res) => {
        console.log(res, 'szssss');
        form.setFieldValue('cashAppId','')
        form.setFieldValue('contractId',res.id)
        form.setFieldValue('contractName',res.id)
        form.setFieldValue('coAcc',res.vendor_bank_acc)
        form.setFieldValue('coName',res.vendor_name)
        form.setFieldValue('coMfo',res.vendor_bank_code)
        form.setFieldValue('coInn',res.vendor_inn)
    }

    const changeCashAppId = (res) => {
        form.setFieldValue('contractId','')
        form.setFieldValue('cashAppId',res.id)
        form.setFieldValue('cashAppName',res.numb_contr)
        form.setFieldValue('coAcc',res.co_acc)
        form.setFieldValue('coName',res.co_name)
        form.setFieldValue('coMfo',res.co_mfo)
        form.setFieldValue('coInn',res.co_inn)
    }

    const getById = async () => {
        const { data } = await axios.get(`/paydoc/loadPaydocById?id=${id}`,
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        setLoading(false);
        setPaydoc(data);
        //console.log(data,'lololo')
        form.setFieldsValue({
            ...data,
            bankDate: dayjs(data.bankDate, "DD.MM.YYYY"),
            docDate: dayjs(data.docDate, "DD.MM.YYYY"),
        })
    };

    useEffect(() => {
        getById();
    }, []);

    /*useEffect(() => {
        if (docSumpay!==0){
            form.setFieldValue('sumPay',docSumpay)
        }
    }, [docSumpay]);*/

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

    return (
        <>
            {contextHolder}
            <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", justifyContent: "left", alignItems:"center", padding:"12px"}}>
                <h3><Button shape="circle" icon={<LeftOutlined />}
                            style={{fontSize:'14px',marginRight:"10px"}}
                            onClick={handleFormExit}/>
                    {t('Банкдан келган тулов хужжатини таҳрирлаш')}
                </h3>
            </div>

            <Form layout="vertical" name="addPaydoc" form={form}
                  scrollToFirstError
                  initialValues={{}}
                  onFinish={onFinish}
                  style={{display:"flex", justifyContent:"center"}}>

                <Row gutter={[48, 24]} style={{marginRight:'0',marginLeft:'0'}}>

                    <Col span={24}>

                        <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"50px", justifyContent: "left", alignItems:"center", paddingLeft:"30px", marginBottom:"20px"}}>
                            <Button type="primary" htmlType="submit" onClick={handleCreate}>
                                {t('Сақлаш')}
                            </Button>

                            {paydoc.paydocPoints && (
                                <TableExpModal
                                    modalDataTab={dataPaydocExpTab}
                                    paydocPoints = {paydoc.paydocPoints}
                                    modalColumnTab={columnsPaydocExp(t)}
                                    modalFilterTab={dataPaydocExpFilter}
                                    modalTitleTab={t('expenses')}
                                    buttonTitleTab={t('expenses')}
                                    setDocSumpay={setDocSumpay}
                                />
                            )}

                            <Button htmlType="reset">
                                {t('clear')}
                            </Button>

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
                                    <Input readOnly={true}/>
                                </Form.Item>

                                <Form.Item name="docDate" label={t('docDate')} rules={[{required: true, message:'Хужжат санаси киритинг!'}]}>
                                    <DatePicker label={t('docDate')} format={dateFormat}
                                                onChange={changeDateFormat}
                                                disabled={true}>

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
                                    <DatePicker label={t('bankDay')} format={dateFormat} onChange={changeDateFormatb}
                                                disabled={true}>

                                    </DatePicker>
                                </Form.Item>

                                <Form.Item name="bankDocId" hidden={true} style={{width:"300px"}} label={t('Банк док.')} rules={[{required: true, message:'Банк документ ИД!'}]}>
                                    <Input readOnly={true}/>
                                </Form.Item>

                            </Space>

                            <Space direction="horizontal">

                                <Form.Item name="acc" hidden={true} style={{width:"300px"}} label={t('acc')} rules={[{required: true, message:'Хисоб ракамни киритинг!'}]}>
                                    <Input readOnly={true}/>
                                </Form.Item>

                                {/*<TableModal modalDataTab={dataSmetaAccTab}
                                            modalColumnTab={columnsAcc(t)}
                                            modalFilterTab={dataSmetaAccFilter}
                                            modalTitleTab={t('accTitle')}
                                            onSubmit={ changeAccCode }
                                />*/}

                                <Form.Item name="accId" label={t('acc')} hidden={true} rules={[{required: true, message:'Хисоб ракамни киритинг!'}]}>
                                    <Input readOnly={true}/>
                                </Form.Item>

                            </Space>

                            <Space direction="horizontal">

                                <Form.Item name="accName" hidden={true} style={{width:"300px"}} label={t('accName')} rules={[{required: false}]}>
                                    <TextArea size="medium" readOnly={true} autoSize={{
                                        minRows: 2,
                                        maxRows: 3,
                                    }}/>
                                </Form.Item>

                            </Space>

                            <Form.Item name="purpose" label={t('payDetail')} rules={[{required: true, message:'Тулов максадини киритинг!'}]}>
                                <TextArea size="medium" readOnly={true} autoSize={{
                                    minRows: 3,
                                    maxRows: 5,
                                }}/>
                            </Form.Item>

                            <Form.Item name="bankSendFlag" label={t('Банкга жунатиш (Ха, Йук)')} rules={[{required: true, message:'Банкга жунатиш!'}]}>
                                <Radio.Group
                                    options={[{label:'Ха',value:1},{label:'Йук',value:0}]}
                                    onChange={changeBankFlag}
                                    value={bankFlag}
                                    disabled={true}
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
                                    <Input readOnly={true}/>
                                </Form.Item>

                                <Form.Item name="clInn" label={t('payerInn')} rules={[{required: true, message:'Туловчи ИНН киритинг!'}]}>
                                    <Input size="10" readOnly={true}/>
                                </Form.Item>

                                <Form.Item name="clMfo" label={t('payerMfo')} rules={[{required: true, message:'Туловчи МФО киритинг!'}]}>
                                    <Input readOnly={true}/>
                                </Form.Item>

                            </Space>

                            <Form.Item name="clName" label={t('payerName')} rules={[{required: true, message:'Туловчи номи киритинг!'}]}>
                                <TextArea size="medium" readOnly={true} autoSize={{
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
                                    <Input readOnly={true}/>
                                </Form.Item>

                                {/*<TableModal modalDataTab={dataSmetaAccTab}
                                            modalColumnTab={columnsAcc(t)}
                                            modalFilterTab={dataSmetaAccFilter}
                                            modalTitleTab={t('accTitle')}
                                            onSubmit={ changeCoAccCode }
                                />
*/}
                                <Form.Item name="coInn" label={t('recipInn')} rules={[{required: true, message:'Олувчи ИНН киритинг!'}]}>
                                    <Input readOnly={true}/>
                                </Form.Item>

                                <Form.Item name="coMfo" label={t('recipMfo')} rules={[{required: true, message:'Олувчи МФО киритинг!'}]}>
                                    <Input readOnly={true}/>
                                </Form.Item>

                            </Space>

                            <Form.Item name="coName" label={t('recipName')} rules={[{required: true, message:'Олувчи номи киритинг!'}]}>
                                <TextArea size="medium" readOnly={true} autoSize={{
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

                                    <Form.Item name="contractName" hidden style={{width:"150px"}} label={t('legal')}>
                                        <Input readOnly="true"/>
                                    </Form.Item>
                                    <Form.Item name="contractId" style={{width:"150px"}} label={t('legal')} rules={[{required: false, message:'Юридик мажбуриятни танланг!'}]}>
                                        <Input readOnly="true"/>
                                    </Form.Item>

                                    <TableModal modalDataTab={dataContractIdTab}
                                                modalColumnTab={columnsContractId(t)}
                                                modalFilterTab={dataContractIdFilter}
                                                modalTitleTab={t('accTitle')}
                                                filterKey="paydocContractRef"
                                                onSubmit={ changeContractId }
                                    />

                                </Space>

                                <Space direction="horizontal">

                                    <Form.Item name="cashAppName" hidden style={{width:"150px"}} label={t('application')}>
                                        <Input readOnly="true"/>
                                    </Form.Item>
                                    <Form.Item name="cashAppId" style={{width:"150px"}} label={t('application')} rules={[{required: false, message:'Суровномани танланг!'}]}>
                                        <Input readOnly="true"/>
                                    </Form.Item>

                                    <TableModal modalDataTab={dataCashAppIdTab}
                                                modalColumnTab={columnsCashAppId(t)}
                                                modalFilterTab={dataCashAppIdFilter}
                                                modalTitleTab={t('accTitle')}
                                                filterKey="paydocCashAppRef"
                                                onSubmit={ changeCashAppId }
                                    />

                                </Space>

                                <Form.Item name="isAvans" initialValue={isAvans}>

                                    <Checkbox
                                        checked={isAvans}
                                        disabled={true}
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

export default PaydocBankEdit;