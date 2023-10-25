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
import {LeftOutlined, PlusOutlined, TableOutlined} from "@ant-design/icons";
import {
    columnsAcc,
    columnsExp,
    dataSmetaAccFilter,
    dataSmetaAccTab,
    dataSmetaExpFilter,
    dataSmetaExpTab, getExpArr
} from "../Smeta/SmetaData";

// import {
//     dataTerritoryRef,
//     columnsTerritoryRef, dataTerritoryFilter
// } from "./VendorData"
import TableModal from "../../components/TableModalBM";

import { useTranslation } from 'react-i18next';
/*import VendorPoints from "./VendorPoints";*/
import AccessDocAction from "../Role/AccessDocAction";
import NumberInputBM from "../../components/NumberInput";

const {TextArea} = Input;

const QUERY_URL = '/api/public/query';
const SAVE_URL = '/good/save';

const dataExpenseRef = {
    "query": {
        "id": "EXPENSE_REF",
        "source": "EXPENSE_REF",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "code", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "parent", "format": "text", "type": "text" },
            {   "column": "isleaf", "format": "text", "type": "text" },
            {   "column": "created_by", "format": "number", "type": "number" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            {   "column": "modified_date", "format": "text", "type": "text" }
        ],
        "filters": [{
            "column": "isleaf",
            "operator": "=",
            "value": "Y",
            "dataType": "text"
        }]
    }
}

const dataUnitRef = {
    "query": {
        "id": "UNITS_REF",
        "source": "UNITS_REF",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "code", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "symbol", "format": "text", "type": "text" },
            {   "column": "type", "format": "text", "type": "text" },
        ]
    }
}

const RefGoodEdit = () => {

    const navigate = useNavigate();

    const auth = useContext(AuthContext)

    const { t } = useTranslation();

    const [ dates, setDates] = useState({})
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const [notifyApi, notifyContextHolder] = notification.useNotification();

    const [specData, setSpecData] = useState([])
    const [loading, setLoading] = useState(true);
    const [expenseOpt, setExpenseOpt] = useState([]);
    const [unitOpt, setUnitOpt] = useState([]);

    const headers = {
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const getTabData = async () => {

        //expense
        const { data } = await axios.post(QUERY_URL,
            ( dataExpenseRef ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });

        console.log(data, 'nndata')

        setExpenseOpt(
            data.map(row => ({
                    label: row.code + ' - ' + row.name,
                    value: row.code
                })
            )
        )

        //units
        const { data: dataUnit } = await axios.post(QUERY_URL,
            ( dataUnitRef ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        setLoading(false);

        setUnitOpt(
            dataUnit.map(row => ({
                    label: row.code + ' - ' + row.name,
                    value: row.code
                })
            )
        )


    };

    useEffect(() => {
        getTabData();
    }, []);

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
                values["isLeaf"] = 'Y'
                values["parentId"] = 0
                values["ordNum"] = 0
                values["goodExpense"] = values.expense.map((elem) => ({'expense': elem}))

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
                        duration: 5,
                    });
                    //message.error(err.response?.data);
                }

            }).catch((errorInfo) => {
            console.log('errorInfo ...', errorInfo);
        }).then(r => r);

    };

    const handleChangeGoodType = () => {

    }

    const handleFormExit = () => {
        navigate(-1)
    }

    const handleChangeExp = (value) => {
        console.log(`selected ${value}`);
    };

    const handleChangeUnit = (value) => {
        console.log(`selected ${value}`);
    };

    return (
        <>
            {contextHolder}
            {notifyContextHolder}
            <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", justifyContent: "left", alignItems:"center", padding:"12px"}}>
                <h3><Button shape="circle" icon={<LeftOutlined />}  style={{fontSize:'14px',marginRight:"10px"}} onClick={handleFormExit}/>Таъминотчини киритиш</h3>
            </div>

            <Form layout="vertical" className='bm-form' name="addVendor" form={form} scrollToFirstError initialValues={{}} onFinish={onFinish} style={{display:"flex", justifyContent:"left"}}>

                <Row gutter={[16, 16]} style={{marginRight:'0',marginLeft:'0'}}>

                    <Col span={24}>

                        <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"50px", justifyContent: "left", alignItems:"center", paddingLeft:"30px"}}>

                            <Button type="primary" htmlType="submit" onClick={handleCreate}>
                                Яратиш
                            </Button>

                            {/*<Button
                                //onClick={handleAccessDocAction}
                                onClick={handleVendorPoints}
                                icon={<TableOutlined />}
                                type="primary"
                            >
                                Банк Х.Р. кушиш
                            </Button>*/}

                            {/*<Drawer
                                title="Банк хисоб ракамларини кушиш"
                                width={700}
                                placement='right'
                                onClose={closeSpec}
                                open={openSpec}
                                bodyStyle={{
                                    paddingBottom: 80,
                                }}
                            >
                                <VendorPoints setSpecData={setSpecData}/>

                            </Drawer>*/}

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

                                <Space size={20} direction="vertical" align="start" >

                                    <Card
                                        title="Товар"
                                        size="small"
                                        type="inner"
                                        style={{
                                            width: 600,
                                        }}
                                    >
                                        <Space direction="vertical" size="small">

                                            <Space direction="horizontal" size="small">

                                                <Form.Item name="code" label="Коди" rules={[{required: true, message:'Номини киритинг!'}]}>
                                                    <NumberInputBM
                                                        style={{ width: 250 }}
                                                        maxLength={30}
                                                    />
                                                </Form.Item>

                                                <Form.Item name="barCode" label="Бар коди" rules={[{required: true, message:'Бар кодини киритинг!'}]}>
                                                    <NumberInputBM
                                                        style={{ width: 250 }}
                                                        maxLength={20}
                                                    />
                                                </Form.Item>

                                            </Space>

                                            <Space direction="horizontal" size="small">

                                                <Form.Item name="ikpuCode" label="ИКПУ коди" rules={[{required: true, message:'ИКПУ кодини киритинг!'}]}>
                                                    <NumberInputBM
                                                        style={{ width: 250 }}
                                                        maxLength={30}
                                                    />
                                                </Form.Item>

                                                <Form.Item name="tnvedCode" label="ТНВЕД коди" rules={[{required: true, message:'ТНВЕД кодини киритинг!'}]}>
                                                    <NumberInputBM
                                                        style={{ width: 250 }}
                                                        maxLength={30}
                                                    />
                                                </Form.Item>

                                            </Space>

                                            <Space direction="horizontal" size="small">

                                                <Form.Item name="unit" label="Улчов бирлиги" rules={[{required: true, message:'Улчов бирлигини танланг!'}]}>

                                                    <Select
                                                        showSearch
                                                        style={{ width: 290 }}
                                                        placeholder="Улчов бирлигини киритинг ва танланг"
                                                        optionFilterProp="children"
                                                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                                        filterSort={(optionA, optionB) =>
                                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                        }
                                                        options={unitOpt}
                                                    />

                                                </Form.Item>

                                                <Form.Item name="type" label="Тури" initialValue='0' rules={[{required: true, message:'Турини танланг!'}]}>

                                                    <Select
                                                        defaultValue='0'
                                                        style={{
                                                            width: 100,
                                                        }}
                                                        onChange={handleChangeGoodType}
                                                        options={[
                                                            {
                                                                value: '0',
                                                                label: 'Ха',
                                                            },
                                                            {
                                                                value: '1',
                                                                label: 'Йуқ',
                                                            },
                                                        ]}
                                                    />

                                                </Form.Item>

                                            </Space>

                                        </Space>

                                        <Space direction="vertical" size='small'>

                                            <Form.Item name="name" label="Номи" rules={[{required: true, message:'Номини киритинг!'}]}>
                                                <TextArea size="medium" autoSize={{
                                                    minRows: 3,
                                                    maxRows: 4,
                                                }}
                                                          style={{
                                                              width: 400,
                                                          }}
                                                />
                                            </Form.Item>

                                            <Form.Item name="shortName" label="Қисқа номи" rules={[{required: true, message:'Қисқа номини киритинг!'}]}>
                                                <Input/>
                                            </Form.Item>

                                        </Space>

                                    </Card>

                                </Space>

                                <Space size={20} align="start" direction="vertical">

                                    <Card
                                        title="Бошқалар"
                                        type="inner"
                                        size="small"
                                        style={{
                                            width: 650,
                                        }}
                                    >

                                        <Space direction="vertical" size='small'>

                                            <Form.Item name="expense" label="Харажат моддаси" rules={[{required: true, message:'Харажат моддасини танланг!'}]}>
                                                <Select
                                                    mode="multiple"
                                                    allowClear
                                                    size='middle'
                                                    style={{
                                                        width: 600,
                                                    }}
                                                    placeholder="Харажат моддасини киритинг ва танланг"
                                                    //defaultValue={['a10', 'c12']}
                                                    onChange={handleChangeExp}
                                                    options={expenseOpt}
                                                    filterOption={(inputValue, option) =>
                                                        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                                                    }
                                                />
                                            </Form.Item>


                                        </Space>

                                    </Card>

                                </Space>

                            </Space>

                        </Space>

                    </Col>

                </Row>

            </Form>
        </>
    )
}

export default RefGoodEdit;