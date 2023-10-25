import React, {useContext, useState, useEffect} from "react";
import {
    Button,
    Card,
    Checkbox,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Row,
    Select,
    Space, Spin, Table, Typography
} from "antd";

import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "../../api/axios";
import {LeftOutlined, MinusCircleOutlined} from "@ant-design/icons";
import TableModal from "../../components/TableModalBM";
import { useTranslation } from 'react-i18next';
import dayjs from "dayjs";
import {DocumentTemplateSave} from "../../components/DocumentTemplateSave";
import {DocumentTemplate} from "../../components/DocumentTemplate";
import {removeUndefinedKeys} from "../../libs/formbm";
import getNdsType from "../../api/refs/ndsType/index";

import NumberInputBM from "../../components/NumberInput";
import {columnsContractId, dataContractIdFilter, dataContractIdTab} from "../Paydoc/PaydocData";


const {TextArea} = Input;
const {Option} = Select;
const { Text } = Typography;

const SAVE_URL = '/invoice/save';
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

const InvoiceAdd = () => {

    const navigate = useNavigate();

    const { t } = useTranslation();

    const auth = useContext(AuthContext)
    const [ dates, setDates] = useState({})
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [invoiceDocType  , setInvoiceDocType] = useState([
        {id: 1, name: 'Стандарт'},
        {id: 2, name: 'Туловсиз'},
        {id: 3, name: 'Харажатларни коплаш'},
        {id: 4, name: 'Кушимча'}
    ]);
    const [invoiceIncomeType  , setInvoiceIncomeType] = useState([]);
    const [ndsType  , setNdsType] = useState([]);

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

    const handleFormExit = () => {
        navigate(-1)
    }

    const dataInvoiceIncomeType = {
        "query": {
            "id": "INVOICE_INCOME_TYPES_REF",
            "source": "INVOICE_INCOME_TYPES_REF",
            "fields": [
                {   "column": "id", "format": "number", "type": "number" },
                {   "column": "name", "format": "text", "type": "text" },
            ],
        }
    }

    const getInvoiceIncomeType = async () => {

        try {
            const headers = {'Content-Type':'application/json;charset=utf-8',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Credentials':'true',
                'withCredentials': true
            }
            const response = await axios.post(QUERY_URL,
                JSON.stringify(dataInvoiceIncomeType),
                {
                    headers: headers,
                    crossDomain: true,
                    withCredentials: false
                });
            //setLoading(false);
            setInvoiceIncomeType(response?.data);

        } catch (err) {
            if (!err?.response) {
                message.error(err.response?.data);
            } else if (err.response?.status === 400) {
                message.error(err.response?.data ||'INTERNAL');
            } else if (err.response?.status === 401) {
                message.error(err.response?.data ||'UNAUTHORIZED');
            } else if (err.response?.status === 404) {
                message.error(err.response?.data ||'NOT FOUND');
            } else {
                message.error(err.response?.data ||'OTHERS');
            }
            // errRef.current.focus();
        }

    }

    useEffect(() => {
        async function fetchData() {
            try {
                const invoiceIncomeTypeData = await getInvoiceIncomeType();
                const dataNDS = await getNdsType();
                setNdsType(dataNDS);
            } catch (error) {

            }
        }

        fetchData()
    }, []);

    const changeContractId = (res) => {
        loadByContractId(res.id)
        /*form.setFieldValue('cashAppId','')
        form.setFieldValue('contractId',res.id)
        form.setFieldValue('coAcc',res.vendor_bank_acc)
        form.setFieldValue('coName',res.vendor_name)
        form.setFieldValue('coMfo',res.vendor_bank_code)
        form.setFieldValue('coInn',res.vendor_inn)

        getDocExpense(res.id, 'CONTRACT')*/
    }

    const loadByContractId = async (cn_id) => {
        //form.getFieldValue('')
        setLoading(true);
        //Get Data Contract
        const { data } = await axios.get(`/contract/loadContractById?id=${cn_id}`,
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        // delete contract docType ;
        delete data.docType
        //initialize maxAmount of goods
        data.specifications.map((elem) => {
                elem["maxAmount"] = elem.amount
            }
        )
        console.log(data,'ttddd')

        //Get Data Vendor from Contract vendor Id
        console.log(data.specifications,'ttddd')
        data.specifications.map(elem => {
            elem['goodInfo'] = "0"
            elem['goodBarcode'] = "0"
            elem['ndsType'] = 0
            elem['ndsSumma'] = 0
            elem['benefit'] = "0"
            elem['stock'] = "0"
            elem['goodOrigin'] = "0"
            elem['unitId'] = 0
        })

        setData(data.specifications)

        const vendorId = data?.vendorId;
        const { data :vendorData } = await axios.get(`/vendor/loadVendorById?id=${vendorId}`,
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });

        console.log(vendorData);

        form.setFieldsValue({
            ...data,
            "accId": data.accid,
            "contractId": data.id,
            "contractNumb": data.numbContr,
            "contractDate": data.dateContr,// ? dayjs(data.dateContr, "DD.MM.YYYY") : null,
            "vendorBookkeeper": vendorData.bookkeeper,
            "vendorChief": vendorData.chief,
            "vendorPhone": vendorData.phones,
            "vendorInfo": vendorData.note,
            "vendorAddress": vendorData.address,
        })
        setLoading(false);
    };

    const handleAmountChange = (event, index, key) => {
        const updData = [...data];
        updData[index][key] = event;
        updData[index]['sumPay'] = data[index][key]*data[index]['price'];

        //Itog s NDS AMOUNT PRICE
        const priceNds = parseInt(updData[index]['ndsSumma'])
        const price = parseInt(updData[index]['price'])
        const amount = parseInt(data[index][key])
        updData[index]['sumPay'] = (price + +priceNds) * amount

        setData(updData)

        sumTotalSumpay()
    };

    const handleSpecChange = (event, index, key) => {
        const updData = [...data];
        updData[index][key] = event.target.value;
        setData(updData)
    };

    const handleNdsChange = (value, index, key) => {
        const updData = [...data];
        updData[index][key] = parseInt(value);
        const price = parseInt(updData[index]['price'])
        const priceNds = parseInt((parseInt(value)*updData[index]['price'])/100)
        const sumNds = parseInt(priceNds)
        //const sumNds = parseInt(price + priceNds)
        console.log(price)
        console.log(priceNds)
        console.log(sumNds)

        updData[index]['ndsSumma'] = sumNds;
        //Itog s NDS AMOUNT PRICE
        const amount = parseInt(updData[index]['amount'])
        updData[index]['sumPay'] = (price + priceNds) * amount

        setData(updData)
        sumTotalSumpay()
    };

    /*const sumGoodTotalSum = (updData, index, key) => {
        updData[index]['sumPay'] =
    }*/

    const sumTotalSumpay = () => {
        console.log(data,';;data')
        const sum = data.reduce((acc, curr) => {
                return acc + curr.sumPay;
        }, 0);
        form.setFieldValue('sumPay', sum)
    }

    const columns = [
        {
            title: "№",
            dataIndex: "ordNum",
            key:"ordNum",
        },
        {
            title: "ИД",
            dataIndex: "goodId",
            key:"goodId",
        },
        {
            title: "Харажат моддаси",
            dataIndex: "expense",
            key:"expense",
            width: 100,
        },
        {
            title: "Товарлар ва хизматларнинг номи",
            dataIndex: "name",
            key:"name",
        },
        {
            title: "Товар ва хизмат тавсифи",
            dataIndex: "goodInfo",
            key:"goodInfo",
            render: (text, record, index) => {
                return (
                    <Input onChange={(event) => {handleSpecChange(event, index, "goodInfo");}} />
                )
            }
        },
        {
            title: "Товар ва хизмат штрих коди",
            dataIndex: "goodBarcode",
            key:"goodBarcode",
            render: (text, record, index) => {
                return (
                    <Input onChange={(event) => {handleSpecChange(event, index, "goodBarcode");}} />
                )
            }
        },
        {
            title: "Улчов бирлиги",
            dataIndex: "unit",
            key:"unit",
        },
        {
            title: "Микдор",
            dataIndex: "amount",
            render: (text, record, index) => {
                //const initialMaxValue = data && data?.specifications[index]?.amount || text
                const initialMaxValue = record.maxAmount
                    return (
                        <InputNumber min={0} max={initialMaxValue} value={text} defaultValue={text}
                                     style={{
                                         width: 80,
                                     }}
                                     onChange={(event) => {
                                         handleAmountChange(event, index, "amount");
                                     }}
                        />
                    )
                }
        },
        {
            title: "Макс",
            dataIndex: "maxAmount",
            key: "maxAmount"
        },
        {
            title: "Нарх",
            dataIndex: "price",
            key: "price",
        },
        {
            title: 'НДС',
            dataIndex: "nds",
            key: "nds",
            children: [
                {
                    title: "Ставка",
                    dataIndex: "ndsType",
                    key: "ndsType",
                    render: (text, record, index) => {
                        return (
                            <Select placeholder="ККС турини танланг" defaultValue={ndsType[0].value} onChange={(value) => { handleNdsChange(value, index, "ndsType"); }}>
                                {ndsType &&
                                    ndsType.map((elem) => {
                                        return (
                                            <Option key={elem.id} value={elem.value}>{elem.description}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )
                    }
                },
                {
                    title: "НДС сумма",
                    dataIndex: "ndsSumma",
                    key: "ndsSumma",
                },
            ]
        },
        {
            title: "Сумма",
            dataIndex: "sumPay",
            key:"sumPay",
        },
        {
            title: "Льгота",
            dataIndex: "benefit",
            key:"benefit",
            render: (text, record, index) => {
                return (
                    <Input onChange={(event) => { handleSpecChange(event, index, "benefit"); }} />
                )
            }
        },
        {
            title: "Омбор",
            dataIndex: "stock",
            key:"stock",
            render: (text, record, index) => {
                return (
                    <Input onChange={(event) => { handleSpecChange(event, index, "stock"); }} />
                )
            }
        },
        {
            title: "Товарнинг келиб чикиши",
            dataIndex: "goodOrigin",
            key:"goodOrigin",
            render: (text, record, index) => {
                return (
                    <Input onChange={(event) => { handleSpecChange(event, index, "goodOrigin"); }} />
                )
            }
        },

        /*{
            title: "",
            dataIndex: "",
            render: (text, record, index) =>
                data.length > 1 ? (
                    <MinusCircleOutlined onClick={() => handleRemoveRow(index)} />
                ) : null
        },*/
    ];

    const getSpecData = () => {
        console.log(data,'ppppp')
        data.map(item => {
            delete item.maxAmount
            /*item['goodInfo'] = 'xxx'
            item['goodBarcode'] = 'xxx'
            item['ndsType'] = 0
            item['ndsSumma'] = 0
            item['benefit'] = 'xxx'
            item['stock'] = 'xxx'
            item['goodOrigin'] = 'xxx'
            item['unitId'] = 0*/
        });
        return data
    }

    const handleCreate = () => {
        const specData = getSpecData();
        console.log(specData,'okokokoko')

        form
            .validateFields()
            .then(async (values) => {
                console.log(values, 'before')
                const procurationData = {
                    inn: values.procInn,
                    pinfl: values.procPinfl,
                    name: values.procName,
                    docNumb: values.procDocNumb,
                    docDate: dayjs(values.procDocDate).format('DD.MM.YYYY'),
                }

                delete values.procInn;
                delete values.procPinfl;
                delete values.procName;
                delete values.procDocNumb;
                delete values.procDocDate;
                delete values.accId;
                delete values.accName;
                delete values.contractDate;
                delete values.contractNumb;

                values["procuration"] = procurationData
                values["points"] = specData
                values["docDate"] = dayjs(values.docDate).format('DD.MM.YYYY')

                console.log(values, 'after')
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

    const saveTemplate = () => {
        console.log('saveTemplate')

        let formTemplate = form.getFieldsValue()

        console.log(formTemplate, 'ff')
        console.log(dayjs(formTemplate["docDate"]).format('DD.MM.YYYY'),'dataTemp')
        formTemplate["docDate"] = dayjs(formTemplate["docDate"]).format('DD.MM.YYYY')
        formTemplate["procDocDate"] = dayjs(formTemplate["procDocDate"]).format('DD.MM.YYYY')
        /*formTemplate["currency"] = dates.docDate
        formTemplate["month"] = dates.month
        formTemplate["points"] = getTabExpSum()
        formTemplate["filial"] = auth.empFilial
        formTemplate["finYear"] = dates.docDate.substring(6)*/
        console.log(formTemplate,'ffbef')
        formTemplate = removeUndefinedKeys(formTemplate);
        console.log(formTemplate,'ffAfter')
        return formTemplate
    }

    const getDataByTemplate = async (data) => {
        console.log(data,'getDataByTemplate')

        form.setFieldsValue({
            ...data,
            docDate: data.docDate ? dayjs(data.docDate,'DD.MM.YYYY') : null,
            //contractDate: data.contractDate ? dayjs(data.docDate,'DD.MM.YYYY') : null,
            procDocDate: data.procDocDate ? dayjs(data.procDocDate,'DD.MM.YYYY') : null,
        })

        if (data?.contractId && data?.contractId !== 0) loadByContractId(data.contractId)
      /*  setCashApp(data);
        form.setFieldsValue({
            ...data,
            docDate: data.docDate ? dayjs(data.docDate,'DD.MM.YYYY') : null,
            month: data.month ? dayjs(data.month, "MM") : null,
            finYear: data.finYear ? dayjs(data.finYear, "YYYY") : null,
        })
        getDocExpense(data.acc)*/
    };

    return (
        <>
            {contextHolder}
            <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", justifyContent: "left", alignItems:"center", padding:"12px"}}>
                <h3><Button shape="circle" icon={<LeftOutlined />}  style={{fontSize:'14px',marginRight:"10px"}} onClick={handleFormExit}/>{t('invoiceTitle')}</h3>
            </div>

            <Spin spinning={loading} size='large'>

                <Form layout="vertical" name="addInvoice" form={form} scrollToFirstError initialValues={{"docType": invoiceDocType?invoiceDocType[0]?.id.toString():"1", "incomType": "1" }} onFinish={onFinish} style={{display:"flex", justifyContent:"center"}}>

                    <Row gutter={[60, 6]} style={{marginRight:'0',marginLeft:'0'}}>

                        <Col span={24}>

                            <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"50px", justifyContent: "space-between", alignItems:"center", paddingLeft:"30px", marginBottom:"20px"}}>

                                <div style={{display:"flex", gap:"10px"}}>

                                    <Button type="primary" htmlType="submit" onClick={handleCreate}>
                                        {t('create')}
                                    </Button>

                                    <Button htmlType="reset">
                                        {t('clear')}
                                    </Button>

                                </div>

                                <div style={{display:"flex", gap:"10px"}}>

                                    <DocumentTemplateSave documentType="INVOICE" handleSaveTemplate={saveTemplate}/>

                                    <DocumentTemplate documentType="INVOICE" handleLoadDocument={getDataByTemplate}/>

                                </div>

                            </div>

                        </Col>

                        {/*</Row>

                    <Row gutter={[8, 8]} style={{marginRight:'0',marginLeft:'0'}}>*/}

                        <Col span={12}>

                            <Card
                                title={t('contract')}
                                type="inner"
                                size="small"
                                style={{
                                    width: 600,
                                    marginBottom: 20,
                                }}
                            >

                                <Space direction="horizontal">

                                    <Form.Item name="contractNumb" label={t('contrNumb')} rules={[{required: true, message:'Шартнома ракамини киритинг!'}]}>
                                        <Input readOnly={true}/>
                                    </Form.Item>

                                    <Form.Item name="contractDate" label={t('contrDate')} rules={[{required: true, message:'Шартнома санасини киритинг!'}]}>
                                        <Input readOnly={true}/>
                                        {/*<DatePicker label={t('docDate')} format={dateFormat}>

                                        </DatePicker>*/}
                                    </Form.Item>

                                    <Form.Item name="contractId" label={t('contract')} rules={[{required: true, message:'Шартномани танланг!'}]}>
                                        <Input readOnly={true}/>
                                    </Form.Item>

                                    <TableModal modalDataTab={dataContractIdTab}
                                                modalColumnTab={columnsContractId(t)}
                                                modalFilterTab={dataContractIdFilter}
                                                modalTitleTab={t('contract')}
                                                filterKey="invoiceContractRef"
                                                onSubmit={ changeContractId }
                                    />

                                </Space>

                            </Card>

                            <Card
                                title={t('document')}
                                type="inner"
                                size="small"
                                style={{
                                    width: 600,
                                    marginBottom: 20
                                }}
                            >

                                <Space direction="horizontal">

                                    <Form.Item name="docNumb" label={t('docNumb')} rules={[{required: true, message:'Хужжат санаси киритинг!'}]}>
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item name="docDate" label={t('docDate')} rules={[{required: true, message:'Хужжат санаси киритинг!'}]}>
                                        <DatePicker onChange={() => false} label={t('docDate')} format={dateFormat}>

                                        </DatePicker>
                                    </Form.Item>

                                    <Form.Item name="docType" label={t('docType')} style={{width: 230}} rules={[{required: true, message:t('docType')+'ни танланг!'}]}>
                                        <Select placeholder="Хисоб фактура турини танланг">
                                            {invoiceDocType &&
                                                invoiceDocType.map((elem) => {
                                                    return (
                                                        <Option key={elem.id}>{elem.name}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </Form.Item>

                                </Space>

                                <Form.Item name="incomType" label={t('incomeType')} rules={[{required: true, message:t('incomeType')+'ни танланг!'}]}>
                                    <Select placeholder="Даромад турини танланг">
                                        {invoiceIncomeType &&
                                            invoiceIncomeType.map((elem) => {
                                                return (
                                                    <Option key={elem.id}>{elem.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>

                                <Space direction="horizontal" >

                                    <Form.Item name="acc" style={{width:"200px"}} label={t('acc')} rules={[{required: true, message:'Хисоб ракамни киритинг!'}]}>
                                        <Input readOnly/>
                                    </Form.Item>

                                    <Form.Item name="accId" hidden={true} label={t('acc')} rules={[{required: true, message:'Хисоб ракамни киритинг!'}]}>
                                        <Input/>
                                    </Form.Item>

                                </Space>

                                <Space direction="horizontal" >

                                    <Form.Item name="accName" style={{width:"350px"}} label={t('accName')} rules={[{required: false}]}>
                                        <TextArea size="medium" readOnly autoSize={{
                                            minRows: 2,
                                            maxRows: 3,
                                        }}/>
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

                                    <Form.Item name="ndsRegNumb" label={t('ndsBenefit')} rules={[{required: true, message:t('ndsBenefit')+'ни киритинг!'}]}>
                                        <Input/>
                                    </Form.Item>

                                </Space>

                                <Form.Item name="goodReleasePerson" label={t('goodReleasePerson')} rules={[{required: true, message:'Факсни киритинг!'}]}>
                                    <Input/>
                                </Form.Item>

                            </Card>

                        </Col>

                        <Col span={12} >

                            <Card
                                title={t('vendor')}
                                type="inner"
                                size="small"
                                style={{
                                    width: 550,
                                }}
                            >

                                <Space direction="horizontal">

                                    <Form.Item name="vendorId" label={t('vendor')} style={{width:180}} rules={[{required: true, message:'Таъминотчи танланг!'}]}>
                                        <Input readOnly/>
                                    </Form.Item>

                                    <Form.Item name="vendorInn" style={{width:130}} label="ИНН"
                                               rules={[
                                                   {required: true, message:'Таъминотчи ИНН ни киритинг!'},
                                                   { min: 9, message: 'ИНН 9 хонали сон булиши керак!' },
                                                   { max: 9, message: 'ИНН 9 хонали сон булиши керак!' }
                                               ]}>
                                        <NumberInputBM
                                            style={{ width: '100%' }}
                                            maxLength={9}
                                            readOnly
                                        />
                                    </Form.Item>

                                    <Form.Item name="vendorPinfl" style={{width:160}} label="ПИНФЛ" rules={[{required: false, message:'Таъминотчи ПИНФЛ ни киритинг!'}]}>
                                        <NumberInputBM
                                            style={{ width: '100%' }}
                                            maxLength={14}
                                            readOnly
                                        />
                                    </Form.Item>

                                </Space>

                                <Form.Item name="vendorName" label={t('vendorName')} style={{width:500}} rules={[{required: true, message:'Таъминотчи номини киритинг!'}]}>
                                    <TextArea size="medium" readOnly autoSize={{
                                        minRows: 3,
                                        maxRows: 5,
                                    }}/>
                                </Form.Item>

                                <Space direction="horizontal">

                                    <Form.Item name="vendorChief" label={t('chief')} style={{width:170}} rules={[{required: true, message:'Юридик манзилни киритинг!'}]}>
                                        <Input readOnly/>
                                    </Form.Item>

                                    <Form.Item name="vendorBookkeeper" label={t('bookkeeper')} style={{width:170}} rules={[{required: true, message:'Эслатмани киритинг!'}]}>
                                        <Input readOnly/>
                                    </Form.Item>

                                    <Form.Item name="vendorPhone" label={t('phone')} style={{width:150}} rules={[{required: true, message:'Тел. ракамни киритинг!'}]}>
                                        <Input readOnly/>
                                    </Form.Item>

                                </Space>

                                <Space direction="horizontal">

                                    <Form.Item name="vendorInfo" label={t('note')} style={{width:250}} rules={[{required: true, message:'Почта индексини киритинг!'}]}>
                                        <TextArea size="medium" readOnly autoSize={{
                                            minRows: 2,
                                            maxRows: 3,
                                        }}/>
                                    </Form.Item>

                                    <Form.Item name="vendorAddress" label={t('Адрес')} style={{width:250}} rules={[{required: true, message:'Манзилни киритинг!'}]}>
                                        <TextArea size="medium" readOnly autoSize={{
                                            minRows: 2,
                                            maxRows: 33,
                                        }}/>
                                    </Form.Item>

                                </Space>

                                {/*<Divider orientation="left">Банк хисоб раками</Divider>*/}

                                <Space direction="vertical" style={{width:'100%'}}>

                                    <Divider orientation="center" style={{margin: 2}}>Банк хисоб раками</Divider>

                                    <Space direction="horizontal" >
                                        <Form.Item name="vendorBankAcc" label={t('bankAcc')} rules={[{required: true, message:'Банк х.р. ни киритинг!'}]}>
                                            <Input readOnly/>
                                        </Form.Item>

                                        <Form.Item name="vendorBankCode" label={t('mfo')} style={{width:'80px'}} rules={[{required: true, message:'МФОни киритинг!'}]}>
                                            <Input readOnly/>
                                        </Form.Item>
                                    </Space>

                                </Space>

                            </Card>

                        </Col>

                        <Col span={24}>

                            <Card
                                title={t('procuration')}
                                type="inner"
                                size="small"
                                style={{
                                    width: "auto",
                                    marginBottom:20
                                }}
                            >

                                <Space direction='horizontal'>

                                    <Form.Item name="procDocNumb" label={t('docNumb')} style={{width:150}} rules={[{required: true, message:'Факсни киритинг!'}]}>
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item name="procDocDate" label={t('docDate')} style={{width:150}} rules={[{required: true, message:'Факсни киритинг!'}]}>
                                        <DatePicker onChange={() => false} label={t('docDate')} format={dateFormat}></DatePicker>
                                    </Form.Item>

                                    <Form.Item name="procName" label={t('name')} style={{width:400}} rules={[{required: true, message:'Факсни киритинг!'}]}>
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item name="procInn" label={t('inn')} style={{width:150}}
                                               rules={[
                                                    {required: true, message:'ИНН ни киритинг!'},
                                                    { min: 9, message: 'ИНН 9 хонали сон булиши керак!' },
                                                    { max: 9, message: 'ИНН 9 хонали сон булиши керак!' }
                                                ]}
                                    >
                                        <NumberInputBM
                                            style={{ width: '100%' }}
                                            maxLength={9}
                                            showCount={true}
                                        />
                                    </Form.Item>

                                    <Form.Item name="procPinfl" label={t('pinfl')} style={{width:150}} rules={[{required: true, message:'ПИНФЛ ни киритинг!'}]}>
                                        <NumberInputBM
                                            style={{ width: '100%' }}
                                            maxLength={14}
                                            showCount={true}
                                        />
                                    </Form.Item>

                                </Space>

                            </Card>
                        </Col>

                        <Col span={24}>

                            <Card
                                title={t('specification')}
                                type="inner"
                                size="small"
                                style={{
                                    width: "auto",
                                    marginBottom:50
                                }}
                            >

                            {/*<div style={{display:"flex", flexDirection:"row", gap:"10px", height:"50px", justifyContent: "space-between", alignItems:"center", paddingLeft:"30px", marginBottom:"20px"}}>*/}

                                {data.length > 0 && (
                                    <Table rowKey='ordNum' columns={columns} dataSource={data} pagination={false} size='small'
                                           bordered
                                           summary={(pageData) => {
                                               let totalNds = 0,
                                                   totalSum = 0,
                                                   totalSumOutNds = 0,
                                                   ndsAmount = 0;
                                               pageData.forEach(({ ndsSumma, sumPay, amount  }) => {
                                                   totalNds += ndsSumma;
                                                   totalSum += sumPay;
                                                   ndsAmount += amount*ndsSumma;
                                               });
                                               totalSumOutNds = totalSum - ndsAmount;
                                               return (
                                                   <>
                                                       <Table.Summary.Row style={{backgroundColor: "#fafafa"}}>
                                                           <Table.Summary.Cell index={0} colSpan={11} align="center">
                                                               <Text strong>Жами</Text>
                                                           </Table.Summary.Cell>
                                                           <Table.Summary.Cell index={1}>
                                                               <Text type="warning" >{totalNds}</Text>
                                                           </Table.Summary.Cell>
                                                           <Table.Summary.Cell index={2}>
                                                               <Text type="success">{totalSum}</Text>
                                                           </Table.Summary.Cell>
                                                           <Table.Summary.Cell index={3} colSpan={3}>
                                                               <Text> </Text>
                                                           </Table.Summary.Cell>
                                                       </Table.Summary.Row>
                                                       <Table.Summary.Row style={{backgroundColor: "#fafafa"}}>
                                                           <Table.Summary.Cell index={0} colSpan={11} align="center">
                                                               <Text strong>Жами ККС сиз</Text>
                                                           </Table.Summary.Cell>
                                                           <Table.Summary.Cell index={3}>
                                                               <Text> </Text>
                                                           </Table.Summary.Cell>
                                                           <Table.Summary.Cell index={2}>
                                                               <Text type="success">{totalSumOutNds}</Text>
                                                           </Table.Summary.Cell>
                                                           <Table.Summary.Cell index={3} colSpan={3}>
                                                               <Text> </Text>
                                                           </Table.Summary.Cell>
                                                       </Table.Summary.Row>
                                                       {/*<Table.Summary.Row>
                                                           <Table.Summary.Cell index={0}>Balance</Table.Summary.Cell>
                                                           <Table.Summary.Cell index={1} colSpan={2}>
                                                               <Text type="danger">{totalBorrow - totalRepayment}</Text>
                                                           </Table.Summary.Cell>
                                                       </Table.Summary.Row>*/}
                                                   </>
                                               );
                                           }}
                                    />
                                )}

    {/*                        </div>*/}

                            </Card>
                        </Col>

                    </Row>

                </Form>

            </Spin>
        </>
    )
}

export default InvoiceAdd;