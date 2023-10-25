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
    message, notification,
    Row,
    Select,
    Space
} from "antd";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "../../api/axios";
import {InfoCircleOutlined, LeftOutlined, PlusOutlined, TableOutlined} from "@ant-design/icons";
import {
    columnsAcc,
    columnsExp,
    dataSmetaAccFilter,
    dataSmetaAccTab,
    dataSmetaExpFilter,
    dataSmetaExpTab, getExpArr
} from "../Smeta/SmetaData";

import {
    dataTerritoryRef,
    columnsTerritoryRef, dataTerritoryFilter
} from "./VendorData"
import TableModal from "../../components/TableModalBM";

import { useTranslation } from 'react-i18next';
import VendorPoints from "./VendorPoints";
import AccessDocAction from "../Role/AccessDocAction";
import TaxRiskAnalyzeInfo from "./TaxRiskAnalyzeInfo";
import SudTotalInfo from "./SudTotalInfo";
import NumberInputBM from "../../components/NumberInput";

const {TextArea} = Input;

const SAVE_URL = '/vendor/save';

const VendorAdd = () => {

    const navigate = useNavigate();

    const auth = useContext(AuthContext)

    const { t } = useTranslation();

    const [dates, setDates] = useState({})
    const [vendor, setVendor] = useState({})
    const [inn, setInn] = useState('')
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const [notifyApi, notifyContextHolder] = notification.useNotification();
    const [openSpec, setOpenSpec] = useState(false)

    const [specData, setSpecData] = useState([])

    //const [expArr, setExpArr] = useState([])
    const [currencyLabel, setCurrencyLabel] = useState('Сум')

    const showSpec = () => { setOpenSpec(true) }
    const closeSpec = () => { setOpenSpec(false) }

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
                values["govRegDate"] = dates.govRegDate
                values["name"] = values["vendorName"]
                values["bankAccounts"] = specData.bankAcc

                delete values.vendorName;
                delete values.territoryName;

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

    const handleChangeCurrency = (value,item) => {
        setCurrencyLabel(item.label);
    }

    const handleFormExit = () => {
        navigate(-1)
    }

    const changeVendorCode = (res) => {
        form.setFieldValue('vendorId',res.id)
        form.setFieldValue('vendorInn',res.inn)
        form.setFieldValue('vendorPinfl',res.pinfl)
        form.setFieldValue('vendorName',res.name)
//        setAccCode(res)
    }

    const changeClAccCode = (res) => {
        form.setFieldValue('acc',res.code)
        form.setFieldValue('accName',res.name)
//        setAccCode(res)
    }

    const changeBankAccCode = (res) => {
        form.setFieldValue('vendorBankAcc',res.code)
        form.setFieldValue('vendorBankCode',res.mfo)
//        setAccCode(res)
    }

    const changeTerritory = (res) => {
        form.setFieldValue('territory',res.code)
        form.setFieldValue('territoryName',res.name)
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
        console.log(dates)
    }

    const handleVendorPoints = () => {
        showSpec()
    }

    const changeInn = (e) => {
        setInn(e.target.value)
    }


    return (
        <>
            {contextHolder}
            {notifyContextHolder}
            <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", justifyContent: "left", alignItems:"center", padding:"12px"}}>
                <h3><Button shape="circle" icon={<LeftOutlined />}  style={{fontSize:'14px',marginRight:"10px"}} onClick={handleFormExit}/>Таъминотчини киритиш</h3>
            </div>

            <Form layout="vertical" className='bm-form' name="addVendor" form={form} scrollToFirstError initialValues={{}} onFinish={onFinish} style={{display:"flex", justifyContent:"center"}}>

                <Row gutter={[16, 16]} style={{marginRight:'0',marginLeft:'0'}}>

                    <Col span={24}>

                        <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"50px", justifyContent: "left", alignItems:"center", paddingLeft:"30px"}}>

                            <Button type="primary" htmlType="submit" onClick={handleCreate}>
                                Яратиш
                            </Button>

                            <Button
                                //onClick={handleAccessDocAction}
                                onClick={handleVendorPoints}
                                icon={<TableOutlined />}
                                type="primary"
                            >
                                Банк Х.Р. кушиш
                            </Button>

                            <Drawer
                                title="Банк хисоб ракамларини кушиш"
                                width={800}
                                placement='right'
                                onClose={closeSpec}
                                open={openSpec}
                                bodyStyle={{
                                    paddingBottom: 80,
                                }}
                            >
                                <VendorPoints setSpecData={setSpecData}/>

                            </Drawer>

                            <Button htmlType="reset">
                                Тозалаш
                            </Button>

                        </div>

                    </Col>

                    {/*</Row>

                <Row gutter={[8, 8]} style={{marginRight:'0',marginLeft:'0'}}>*/}

                    <Col span={24} >

                        <Space size={20} align="start" style={{ paddingLeft:"30px"}}>

                            <Space size={20} direction="horizontal" align="start" >

                                <Card
                                    title="Таъминотчи"
                                    size="small"
                                    type="inner"
                                    style={{
                                        width: 300,
                                    }}
                                >
                                    <Space direction="vertical" size="small">

                                            <Form.Item name="vendorName" label="Номи" rules={[{required: true, message:'Номини киритинг!'}]}>
                                                <Input/>
                                            </Form.Item>

                                            <Form.Item name="inn" onChange={changeInn} label="ИНН"
                                                       rules={[
                                                           {required: true, message:'ИНН ни киритинг!'},
                                                           { min: 9, message: 'ИНН 9 хонали сон булиши керак!' },
                                                           { max: 9, message: 'ИНН 9 хонали сон булиши керак!' }
                                                       ]}>
                                                <NumberInputBM
                                                    style={{ width: '100%' }}
                                                    maxLength={9}
                                                    showCount={true}
                                                />
                                            </Form.Item>

                                            <Form.Item name="pinfl" label="ПИНФЛ" rules={[{required: true, message:'ПИНФЛ ни киритинг!'}]}>
                                                <NumberInputBM
                                                    style={{ width: '100%' }}
                                                    maxLength={14}
                                                />
                                            </Form.Item>

                                            <Form.Item name="isResident" label="Резидент" initialValue='Y' rules={[{required: true, message:'Резидентни танланг!'}]}>

                                                <Select
                                                    defaultValue='Y'
                                                    style={{
                                                        width: 220,
                                                    }}
                                                    onChange={handleChangeCurrency}
                                                    options={[
                                                        {
                                                            value: 'Y',
                                                            label: 'Ха',
                                                        },
                                                        {
                                                            value: 'N',
                                                            label: 'Йуқ',
                                                        },
                                                    ]}
                                                />

                                            </Form.Item>

                                            {inn && inn.length === 9 && (
                                                <TaxRiskAnalyzeInfo inn={inn}/>
                                            )}

                                            {inn && inn.length === 9 && (
                                                <SudTotalInfo inn={inn}/>
                                            )}

                                    </Space>

                                </Card>

                                <Card
                                    title="Жойлашган жой"
                                    size="small"
                                    type="inner"
                                    style={{
                                        width: 500,
                                    }}
                                >

                                    <Space direction="vertical">

                                        <Space direction="horizontal">

                                            <Form.Item name="country" label="Мамлакат" initialValue="860" rules={[{required: true, message:'Мамлакатни танланг!'}]}>

                                                <Select
                                                    defaultValue="860"
                                                    style={{
                                                        width: 150,
                                                    }}
                                                    onChange={handleChangeCurrency}
                                                    options={[
                                                        {
                                                            value: '860',
                                                            label: 'Узбекистон',
                                                        },
                                                        {
                                                            value: '630',
                                                            label: 'Россия',
                                                        },
                                                        {
                                                            value: '840',
                                                            label: 'АҚШ',
                                                        },
                                                    ]}
                                                />

                                            </Form.Item>

                                            <Form.Item name="sizeStatus" label="Кичик бизнес" initialValue='Y' rules={[{required: true, message:'Кичик бизнесни танланг!'}]}>

                                                <Select
                                                    defaultValue='Y'
                                                    style={{
                                                        width: 150,
                                                    }}
                                                    onChange={handleChangeCurrency}
                                                    options={[
                                                        {
                                                            value: 'Y',
                                                            label: 'Ха',
                                                        },
                                                        {
                                                            value: 'N',
                                                            label: 'Йуқ',
                                                        },
                                                    ]}
                                                />

                                            </Form.Item>

                                        </Space>

                                        <Space direction='horizontal'>

                                            <Form.Item name="territory" label="Худуд" rules={[{required: true, message:'Худудни танланг!'}]}>
                                                <Input style={{
                                                            width: 80,
                                                       }}
                                                       readOnly="true"/>
                                            </Form.Item>

                                            <TableModal modalDataTab={dataTerritoryRef}
                                                        modalColumnTab={columnsTerritoryRef}
                                                        modalFilterTab={dataTerritoryFilter}
                                                        modalTitleTab="Худудлар"
                                                        filterKey="vendorTerritoryRef"
                                                        onSubmit={ changeTerritory }
                                                        defFilter={[{"column":"type", "value": ["D","R","T"], "operator":"in", "dataType":"text"}]}
                                            />

                                            <Form.Item name="territoryName" label="Худуд номи" rules={[{required: false, message:'Худудни танланг!'}]}>
                                                <Input readOnly="true"
                                                       style={{
                                                           width: 300,
                                                       }}
                                                />
                                            </Form.Item>

                                        </Space>

                                        <Space direction="horizontal">

                                            <Form.Item name="postIndex" label={t('postIndex')} style={{width:150}} rules={[{required: true, message:'Почта индексини киритинг!'}]}>
                                                <Input/>
                                            </Form.Item>

                                            <Form.Item name="phones" label={t('phone')} style={{width:150}} rules={[{required: true, message:'Тел. ракамни киритинг!'}]}>
                                                <Input/>
                                            </Form.Item>

                                            <Form.Item name="fax" label={t('fax')} style={{width:150}} rules={[{required: true, message:'Факсни киритинг!'}]}>
                                                <Input/>
                                            </Form.Item>

                                        </Space>

                                    </Space>

                                    <Space direction="horizontal">

                                        <Space direction="horizontal">

                                            <Form.Item name="address" style={{width:150}} label="Манзил" rules={[{required: true, message:'Манзилни киритинг!'}]}>
                                                <TextArea size="medium" style={{width:300}} autoSize={{
                                                    minRows: 3,
                                                    maxRows: 5,
                                                }}/>
                                            </Form.Item>

                                            <Form.Item name="addressJur" style={{width:150}} label="Юридик манзил" rules={[{required: true, message:'Юридик манзилни киритинг!'}]}>
                                                <TextArea size="medium" style={{width:300}} autoSize={{
                                                    minRows: 3,
                                                    maxRows: 5,
                                                }}/>
                                            </Form.Item>

                                            <Form.Item name="note" style={{width:150}} label="Эслатма" rules={[{required: true, message:'Эслатмани киритинг!'}]}>
                                                <TextArea size="medium" style={{width:300}} autoSize={{
                                                    minRows: 3,
                                                    maxRows: 5,
                                                }}/>
                                            </Form.Item>

                                        </Space>

                                    </Space>

                                    <Space direction="vertical">

                                        <Form.Item name="okonh" label="ОКОНХ" rules={[{required: true, message:'ОКОНХни киритинг!'}]}>

                                            <Select
                                                style={{
                                                    width: 470,
                                                }}
                                                onChange={handleChangeCurrency}
                                                options={[
                                                    {
                                                        value: '61120',
                                                        label: 'Ихтисослашган ташкилотлар, санитар-техник ишлари',
                                                    },
                                                    {
                                                        value: '61121',
                                                        label: 'Ихтисослашган ташкилотлар, монтаж ишлари',
                                                    },
                                                ]}
                                            />

                                        </Form.Item>

                                        <Form.Item name="vendorType" label="Таъминотчи тури" rules={[{required: true, message:'Таъминотчи турини танланг!'}]}>

                                            <Select
                                                style={{
                                                    width: 470,
                                                }}
                                                onChange={handleChangeCurrency}
                                                options={[
                                                    {
                                                        value: '00',
                                                        label: 'Ихтиёрий мижоз',
                                                    },
                                                    {
                                                        value: '01',
                                                        label: 'Бюджет ташкилотлари',
                                                    },
                                                    {
                                                        value: '02',
                                                        label: 'Бюджетдан ташкари жамгарма',
                                                    },
                                                ]}
                                            />

                                        </Form.Item>

                                    </Space>

                                </Card>

                            </Space>

                            <Space size={20} align="start" direction="vertical">

                                <Card
                                    title="Давлат регистрацияси"
                                    type="inner"
                                    size="small"
                                    style={{
                                        width: 400,
                                    }}
                                >

                                    <Space direction="horizontal">

                                        <Form.Item name="govRegNumb" label="Давлат рег. рақами" rules={[{required: true, message:'Давлат рег. рақамини киритинг!'}]}>
                                            <Input/>
                                        </Form.Item>

                                        <Form.Item name="govRegDate" label="Давлат рег. санаси" rules={[{required: true, message:'Давлат рег. санасини танланг!'}]}>
                                            <DatePicker label="Давлат рег. санаси" format={dateFormat} onChange={(date, dateString) => changeDateFormat(date, dateString, 'govRegDate')}>

                                            </DatePicker>
                                        </Form.Item>

                                    </Space>

                                </Card>

                                <Card
                                    title="Ходимлар"
                                    type="inner"
                                    size="small"
                                    style={{
                                        width: 400,
                                    }}
                                >

                                    <Space direction="vertical">

                                        <Form.Item name="beneficiar" label="Бенефициар" rules={[{required: true, message:'Бенефициарни киритинг!'}]}>
                                            <Input style={{width:370}}/>
                                        </Form.Item>

                                        <Form.Item name="chief" label="Директор" rules={[{required: true, message:'Директорни киритинг!'}]}>
                                            <Input style={{width:370}}/>
                                        </Form.Item>

                                        <Form.Item name="bookkeeper" label="Бухгалтер" rules={[{required: true, message:'Бухгалтерни киритинг!'}]}>
                                            <Input style={{width:370}}/>
                                        </Form.Item>

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

export default VendorAdd;