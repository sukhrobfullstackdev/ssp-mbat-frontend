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
import moment from "moment"
import {useNavigate, useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "../../api/axios";
import {LeftOutlined, PlusOutlined, TableOutlined} from "@ant-design/icons";
import {
    columnsAcc,
    columnsExp,
    dataSmetaAccFilter,
    dataSmetaAccTab,
    dataSmetaExpFilter,
    dataSmetaExpTab, getExpArr
} from "../Smeta/SmetaData";

import {
    dataTab as dataVendorSprTab,
    dataFilter as dataVendorSprFilter,
    columnsVendor as columnsVendorSpr,
    columnsVendorBankAcc, dataVendorBankAccTab
} from "../Vendor/VendorData"
import TableModal from "../../components/TableModalBM";
import CNSpecification from "./Specification";
import CNGraphic from "./Graphic";

import { useTranslation } from 'react-i18next';
import {dataSmetaExpOnlyTab} from "./ContractData";
import NumberInputBM from "../../components/NumberInput";
import dayjs from "dayjs";

const {TextArea} = Input;

const QUERY_URL = '/api/public/query';
const SAVE_URL = '/contract/save';

const maketSpec = { goodId: "", ordNum: 1, name: "", unit: "", amount: 1, price: 0, sumPay: 0/*, akciz: 0, sumakciz: 0 */}

const defFilterValue = [
    { "column": "filial", "value": '000', "operator": "=", "dataType": "text" }
];

const ContractEdit = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const auth = useContext(AuthContext)

    const { t } = useTranslation();

    const [ dates, setDates] = useState({})
    const [form] = Form.useForm()
    const [contract, setContract] = useState({})
    const [messageApi, contextHolder] = message.useMessage();
    const [notifyApi, notifyContextHolder] = notification.useNotification();
    const [openSpec, setOpenSpec] = useState(false)
    const [openGraph, setOpenGraph] = useState(false)
    const [specData, setSpecData] = useState([])
    const [graphData, setGraphData] = useState([])
    const [expArr, setExpArr] = useState([])
    const [expGrpSum, setExpGrpSum] = useState([])
    const [currencyLabel, setCurrencyLabel] = useState('Сум')
    const [genSumPay, setGenSumPay] = useState(0)
    const [smetaData, setSmetaData] = useState([])
    const [vendorIddoc, setVendorIddoc] = useState()
    const [needReload, setNeedReload] = useState(true)
    const [accCode, setAccCode] = useState()

    const showSpec = async () => {

        const f_dateContr = form.getFieldValue('dateContr');
        const f_acc = form.getFieldValue('acc');
        if (!f_dateContr || f_dateContr === '') {
            messageApi.open({
                type: 'warning',
                content: 'Шартнома санасини танланг',
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
        dataSmetaExpOnlyTab.query['filters'] = [
            { "column": "finyear", "value": parseInt(f_dateContr.format('YYYY')), "operator": "=", "dataType": "number" },
            { "column": "acc", "value": f_acc, "operator": "=", "dataType": "text" }
        ];

        const { data } = await axios.post(QUERY_URL,
            ( dataSmetaExpOnlyTab ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });

            if (data.length === 0) {
                messageApi.open({
                    type: 'warning',
                    content: 'Бу хисоб ракамга смета киритилмаган',
                    duration: 3,});
                return;
            }

            const expFilter = {
                column: 'code',
                value: data.map(obj => obj.expense),
                operator: 'in',
                dataType: 'text'
            };

            console.log(expFilter,'expFilter')

        setSmetaData([expFilter])

        setOpenSpec(true)
    }
    const closeSpec = () => { setOpenSpec(false) }

    const showGraph = () => {

        if (specData === undefined) {
            messageApi.open({
                type: 'warning',
                content: 'Спецификацияни киритинг',
                duration: 2,});
            return;
        }
        let isExp = specData.find(item => item.expense !== "")
        if (isExp === undefined) {
            notifyApi.warning({
                message: 'Спецификация',
                description: 'Харажат моддаси киритилмаган',
                duration: 2,
                placement: 'top'});
            return;
        }

        let expSpec = specData.filter(item => item.expense !== "").map(item => item.expense)
        setExpArr(expSpec)

        const groupedExpSum = specData.reduce((acc, obj) => {
            const { expense, sumPay } = obj;
            const existingEntry = acc.find(entry => entry.expense === expense);

            if (existingEntry) {
                existingEntry.allSum += sumPay;
            } else {
                acc.push({ expense, allSum: sumPay });
            }

            return acc;
        }, []);

        setExpGrpSum(groupedExpSum)
        //console.log(groupedExpSum,'groupedExpSum')

        setOpenGraph(true)

    }
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

    useEffect(() => {
        form.setFieldValue('sumPay',genSumPay)
        form.setFieldValue('sumNds',genSumPay*12/100)
    }, [genSumPay]);


    const handleCreate = () => {

        const formSpec = specData.map(item => {
            const { name, ...rest } = item;
            return rest;
        });
        console.log(formSpec)

        const formGraph = graphData.flatMap(item => {
            const { expense, dataGraph } = item;
            return dataGraph.map(({ id, sumPay }) => ({ expense, month: parseInt(id), sumPay }));
        });

        let newFormGraph = (formGraph.length === 0) ? contract.graphics : formGraph

        /*const newFormGraph = [...formGraph, ...contract.graphics];
        const uniqueFormGraph = newFormGraph.reduce((acc, item) => {
            if (!acc.find(u => u.expense === item.expense)) {
                acc.push(item)
            }
            return acc
        }, [])*/

        form
            .validateFields()
            .then(async (values) => {
                values.dateContr = values.dateContr.format('DD.MM.YYYY')
                values.dateBegin = values.dateBegin.format('DD.MM.YYYY')
                values.dateEnd = values.dateEnd.format('DD.MM.YYYY')
                values.dateAvans = values.dateAvans.format('DD.MM.YYYY')
                values["specifications"] = formSpec
                values["graphics"] = newFormGraph
                values["docType"] = 0

                values["regDate"] = '12.12.2099'
                values["regNumb"] = 'XXXXXX'

                values["nds"] = values["sumNds"]

                delete values.sumNds
                console.log(JSON.stringify(values),'ttt')
                //navigate("../smetaCreate",{state: { smetaType:values["smeta_type"], finYear: values["finyear"], acc:values['acc']}});

                try {
                    const data = await axios.post(SAVE_URL,

                        JSON.stringify({...contract, ...values}),
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
                        duration: 10,
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

        form.setFieldValue('vendorBankAcc','')
        form.setFieldValue('vendorBankCode','')
        setVendorIddoc(res.id)
        setNeedReload(true)
    }

    const changeClAccCode = (res) => {
        console.log(res);
        // setSpecData([])
        form.setFieldValue('acc',res.code)
        form.setFieldValue('accName',res.name)
        setAccCode(res.code)
    }

    const changeBankAccCode = (res) => {
        form.setFieldValue('vendorBankAcc',res.account)
        form.setFieldValue('vendorBankCode',res.mfo)
//        setAccCode(res)
    }

    const getById = async () => {
        const { data } = await axios.get(`/contract/loadContractById?id=${id}`,
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        // setLoading(false);
        setAccCode(data.acc)
        setContract(data);
        setSpecData(data.specifications)
        form.setFieldsValue({
            ...data,
            dateAvans: data.dateAvans ? dayjs(data.dateAvans, "DD.MM.YYYY") : null,
            dateBegin: data.dateBegin ? dayjs(data.dateBegin, "DD.MM.YYYY") : null,
            dateContr: data.dateContr ? dayjs(data.dateContr, "DD.MM.YYYY") : null,
            dateEnd: data.dateEnd ? dayjs(data.dateEnd, "DD.MM.YYYY") : null,
            regDate: data.regDate ? dayjs(data.regDate, "DD.MM.YYYY") : null,
            finYear: data.finYear ? dayjs(data.finYear, "YYYY") : null,
        })
    };

    useEffect(() => {
        getById();
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

    return (
        <>
            {contextHolder}
            {notifyContextHolder}
            <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", justifyContent: "left", alignItems:"center", padding:"12px"}}>
                <h3><Button shape="circle" icon={<LeftOutlined />}  style={{fontSize:'14px',marginRight:"10px"}} onClick={handleFormExit}/>Шартномани таҳрирлаш</h3>
            </div>

            <Form layout="vertical" name="addPaydoc" form={form} scrollToFirstError initialValues={{}} onFinish={onFinish} style={{display:"flex", justifyContent:"center"}}>

                <Row gutter={[16, 16]} style={{marginRight:'0',marginLeft:'0'}}>

                    <Col span={24}>

                        <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"50px", justifyContent: "left", alignItems:"center", paddingLeft:"30px"}}>
                            <Button type="primary" htmlType="submit" onClick={handleCreate}>
                            Сақлаш
                            </Button>

                            <Button type="primary" onClick={showSpec} icon={<TableOutlined />}>
                                Спецификация
                            </Button>
                            <Drawer
                                title="Шартнома спецификацияси"
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
                                        {/*<Button onClick={saveSpec} type="primary">
                                            Саклаш
                                        </Button>*/}
                                    </Space>
                                }
                            >
                                <CNSpecification specifications={specData} setSpecData={setSpecData} setGraphData={setGraphData} />

                            </Drawer>

                            <Button type="primary" onClick={showGraph} icon={<TableOutlined />}>
                                График
                            </Button>
                            <Drawer
                                title="Шартнома графиги"
                                width={1000}
                                placement='left'
                                onClose={closeGraph}
                                open={openGraph}
                                bodyStyle={{
                                    paddingBottom: 80,
                                }}
                                extra={
                                    <Space>
                                        <Button onClick={closeGraph}>Бекор килиш</Button>
                                        {/*<Button onClick={saveSpec} type="primary">
                                            Саклаш
                                        </Button>*/}
                                    </Space>
                                }
                            >
                                 <CNGraphic graphics={contract.graphics} setGraphData={setGraphData} expArr={expArr} expGrpSum={expGrpSum} accCode={accCode} setGenSumPay={setGenSumPay}/>

                            </Drawer>

                            <Button htmlType="reset">
                                Тозалаш
                            </Button>

                        </div>

                    </Col>

                    {/*</Row>

                <Row gutter={[8, 8]} style={{marginRight:'0',marginLeft:'0'}}>*/}

                    <Col span={24} >

                        <Space size={20} align="start" >

                            <Space size={20} direction="vertical" align="start" >

                                <Card
                                    title="Шартнома"
                                    size="small"
                                    type="inner"
                                    style={{
                                        width: 750,
                                    }}
                                >
                                    <Space direction="horizontal" size="small">

                                        <Space direction="horizontal" size="small">

                                            <Form.Item name="numbContr" style={{width:150}} label="Раками" rules={[{required: true, message:'Шартнома раками киритинг!'}]}>
                                                <Input/>
                                            </Form.Item>

                                            <Form.Item name="dateContr" label="Санаси" rules={[{required: true, message:'Шартнома санаси киритинг!'}]}>
                                                <DatePicker label="Санаси" format={dateFormat}  onChange={(date, dateString) => changeDateFormat(date, dateString, 'dateContr')}>

                                                </DatePicker>
                                            </Form.Item>

                                        </Space>

                                        <Space direction="horizontal" size="small">

                                            <Form.Item name="sumPay" style={{width:200}} label="Умумий суммаси" rules={[{required: true, message:'Умумий суммани киритинг!'}]}>
                                                <InputNumber
                                                    style={{
                                                        width: '100%',
                                                        textAlign: 'end'

                                                    }}
                                                    className='bm-input-number-align-right'
                                                    defaultValue={0}
                                                    step={null}
                                                    onFocus={(e)=>e.target.select()}
                                                    controls={false}
                                                    addonAfter={currencyLabel}
                                                    readOnly='readonly'
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                                    value={genSumPay}
                                                />
                                            </Form.Item>

                                            <Form.Item name="currency" label="Валюта" initialValue="860" rules={[{required: true, message:'Валютани танланг!'}]}>

                                                <Select
                                                    defaultValue="860"
                                                    style={{
                                                        width: 120,
                                                    }}
                                                    onChange={handleChangeCurrency}
                                                    options={[
                                                        {
                                                            value: '860',
                                                            label: 'Сум',
                                                        },
                                                        {
                                                            value: '840',
                                                            label: 'Доллар',
                                                        },
                                                        {
                                                            value: '630',
                                                            label: 'Рубль',
                                                        },
                                                        {
                                                            value: '978',
                                                            label: 'Евро',
                                                        },
                                                    ]}
                                                />

                                            </Form.Item>

                                        </Space>

                                    </Space>

                                    <Space direction="horizontal" size="small">

                                        {/*<Space direction="horizontal" size="small">

                                            <Form.Item name="regNumb" hidden={true} style={{width:150}} label="Регистрация раками" rules={[{required: true, message:'Шартнома регистрация ракамини киритинг!'}]}>
                                                <Input />
                                            </Form.Item>

                                            <Form.Item name="regDate" hidden={true} label="Регистрация санаси" rules={[{required: false, message:'Шартнома регистрация санасини киритинг!'}]}>
                                                <DatePicker label="Шартнома регистрация санаси" format={dateFormat} onChange={(date, dateString) => changeDateFormat(date, dateString, 'regDate')}>

                                                </DatePicker>
                                            </Form.Item>

                                        </Space>*/}

                                        <Space direction="vertical">

                                            <Form.Item name="purpose" style={{width:400}} label="Хужжат максади" rules={[{required: true, message:'Тафсилотларни киритинг!'}]}>
                                                <TextArea size="medium" autoSize={{
                                                    minRows: 5,
                                                    maxRows: 6,
                                                }}/>
                                            </Form.Item>

                                        </Space>

                                        <Space direction="vertical">

                                            <Form.Item name="dateBegin" label="Муддати бошланиши санаси" rules={[{required: true, message:'Шартнома муддати бошланиши санасини киритинг!'}]}>
                                                <DatePicker label="Муддати бошланиши санаси" format={dateFormat} onChange={(date, dateString) => changeDateFormat(date, dateString, 'dateBegin')}>

                                                </DatePicker>
                                            </Form.Item>

                                            <Form.Item name="dateEnd" label="Муддати тугаши санаси" rules={[{required: true, message:'Шартнома муддати тугаши санасини киритинг!'}]}>
                                                <DatePicker label="Муддати тугаши санаси" format={dateFormat} onChange={(date, dateString) => changeDateFormat(date, dateString, 'dateEnd')}>

                                                </DatePicker>
                                            </Form.Item>

                                        </Space>



                                    </Space>

                                </Card>

                                <Card
                                    title="Кушимча маълумотлари"
                                    size="small"
                                    type="inner"
                                    style={{
                                        width: 750,
                                    }}
                                >

                                    <Space direction="horizontal">

                                        <Space direction="horizontal">

                                            <Form.Item name="sumNds" style={{width:200}} label="ККС суммаси" rules={[{required: true, message:'ККС суммасини киритинг!'}]}>
                                                <InputNumber
                                                    style={{
                                                        width: '100%',
                                                        textAlign: 'end'

                                                    }}
                                                    className='bm-input-number-align-right'
                                                    defaultValue={0}
                                                    step={null}
                                                    onFocus={(e)=>e.target.select()}
                                                    controls={false}
                                                    addonBefore="12%"
                                                    readOnly='readonly'
                                                    addonAfter={currencyLabel}
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                                />
                                            </Form.Item>

                                            <Form.Item name="deliveryTime" label="Етказиб бериш куни" initialValue={1} rules={[{required: true, message:'Етказиб бериш кунини киритинг!'}]}>
                                                <InputNumber min={1} max={100} defaultValue={1}/>
                                            </Form.Item>

                                        </Space>

                                        <Space direction="horizontal">

                                            <Form.Item name="sumAvans" style={{width:200}} label="Аванс тулов суммаси" rules={[{required: true, message:'Аванс тулов суммасини киритинг!'}]}>
                                                <InputNumber
                                                    style={{
                                                        width: '100%',
                                                        textAlign: 'end'

                                                    }}
                                                    className='bm-input-number-align-right'
                                                    defaultValue={0}
                                                    step={null}
                                                    controls={false}
                                                    onFocus={(e)=>e.target.select()}
                                                    addonAfter={currencyLabel}
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                                />
                                            </Form.Item>

                                            <Form.Item name="dateAvans" label="Аванс санаси" rules={[{required: true, message:'Аванс санасини киритинг!'}]}>
                                                {/*<InputNumber min={1} max={100} defaultValue={1}/>*/}
                                                <DatePicker label="Аванс санаси" format={dateFormat} onChange={(date, dateString) => changeDateFormat(date, dateString, 'dateAvans')}>

                                                </DatePicker>
                                            </Form.Item>

                                            {/*<Form.Item name="advanceDate" label="Аванс тулов санаси" rules={[{required: true, message:'Аванс тулов санаси киритинг!'}]}>
                                                <DatePicker label="Шартнома санаси" format={dateFormat} onChange={changeDateFormatb}>

                                                </DatePicker>
                                            </Form.Item>*/}

                                        </Space>

                                    </Space>

                                </Card>

                            </Space>

                            <Space size={20} align="start" direction="vertical">

                                <Card
                                    title="Ташкилот"
                                    type="inner"
                                    size="small"
                                    style={{
                                        width: 600,
                                    }}
                                >

                                    <Space direction="horizontal">

                                        <Form.Item name="acc" style={{width:180}} label="Хисоб ракам" rules={[{required: true, message:'Ташкилот хисоб ракамини киритинг!'}]}>
                                            <Input readOnly="true"/>
                                        </Form.Item>

                                        <TableModal modalDataTab={dataSmetaAccTab(auth.empId)}
                                                    modalColumnTab={columnsAcc(t)}
                                                    modalFilterTab={dataSmetaAccFilter}
                                                    modalTitleTab="Хисоб ракамлар"
                                                    filterKey="contractAccRef"
                                                    defFilter={defFilterValue}
                                                    onSubmit={ changeClAccCode }
                                        />



                                        <Form.Item name="accName" label="Х. Р. номи" rules={[{required: true, message:'Ташкилот хисоб ракамини номини киритинг!'}]}>
                                            <TextArea size="medium" readOnly="true" style={{width:300}} autoSize={{
                                                minRows: 2,
                                                maxRows: 3,
                                            }}/>
                                        </Form.Item>

                                    </Space>

                                </Card>

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
                                            <Input />
                                        </Form.Item>

                                        <TableModal modalDataTab={dataVendorSprTab}
                                                    modalColumnTab={columnsVendorSpr}
                                                    modalFilterTab={dataVendorSprFilter}
                                                    modalTitleTab="Таъминотчилар"
                                                    filterKey="contractVendorRef"
                                                    onSubmit={ changeVendorCode }
                                        />

                                        <Form.Item name="vendorInn" style={{width:130}} label="ИНН" rules={[{required: true, message:'Таъминотчи ИНН сини киритинг!'}]}>
                                            <NumberInputBM
                                                style={{ width: '100%' }}
                                                maxLength={9}
                                            />
                                        </Form.Item>

                                        <Form.Item name="vendorPinfl" style={{width:160}} label="ПИНФЛ" rules={[{required: false, message:'Таъминотчи ПИНФЛ ни киритинг!'}]}>
                                            <NumberInputBM
                                                style={{ width: '100%' }}
                                                maxLength={14}
                                            />
                                        </Form.Item>

                                    </Space>

                                    <Form.Item name="vendorName" label="Таъминотчи номи" rules={[{required: true, message:'Таъминотчи номини киритинг!'}]}>
                                        <TextArea size="medium" readOnly="true" autoSize={{
                                            minRows: 3,
                                            maxRows: 5,
                                        }}/>
                                    </Form.Item>

                                    <Divider orientation="left">Банк хисоб раками</Divider>

                                        <Space direction="horizontal" >

                                            <Form.Item name="vendorBankAcc" label="Банк х.р." rules={[{required: true, message:'Банк х.р. ни киритинг!'}]}>
                                                <Input readOnly="true"/>
                                            </Form.Item>

                                            <Form.Item name="vendorBankCode" style={{width:'80px'}} label="МФО" rules={[{required: true, message:'МФОни киритинг!'}]}>
                                                <Input readOnly="true"/>
                                            </Form.Item>

                                            {form.getFieldValue('vendorId') &&

                                                <TableModal modalDataTab={dataVendorBankAccTab}
                                                            modalColumnTab={columnsVendorBankAcc}
                                                            modalFilterTab={[]}
                                                            modalTitleTab="Банк хисоб ракамлари"
                                                            needReload={needReload}
                                                            filterKey="contractVendorBankAccRef"
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

export default ContractEdit;