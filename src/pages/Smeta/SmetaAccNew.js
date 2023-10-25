import {
    Button,
    Col,
    DatePicker,
    Descriptions,
    Form,
    Input, InputNumber,
    Layout,
    message,
    Row,
    Select,
    Space,
    Table,
    Typography
} from 'antd';
import React, {useContext, useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import {NumericInput} from "../../libs/formbm"

import {
    columnsAcc,
    dataSmetaAccFilter,
    dataSmetaAccTab,
    dataSmetaExpFilter,
    dataSmetaExpNewTab,
    dataSmetaType
} from "./SmetaData";
import {LeftOutlined} from "@ant-design/icons";
import TableModal from "../../components/TableModalBM";

import {useTranslation} from 'react-i18next';
import dayjs from "dayjs";
const {Column} = Table;

const { Title } = Typography;
const {Option} = Select;

//import {getDataBooks} from "../../services/index"

const SAVE_URL = '/smeta/save';
const QUERY_URL = '/api/public/query';
const LOADSMETA_URL = '/smeta/loadSmetaById';

const quarterStruct = [
    {'q_1':['m_1','m_2','m_3']},
    {'q_2':['m_4','m_5','m_6']},
    {'q_3':['m_7','m_8','m_9']},
    {'q_4':['m_10','m_11','m_12']}
]

const SmetaAccNew = () => {

    let navigate = useNavigate();

    const auth = useContext(AuthContext)

    const { t } = useTranslation()

    let location = useLocation();

    const smetaIddoc = location.state.iddoc;

    const [stateTab, setStateTab] = useState([])
    const [filterTab, setFilterTab] = useState("")
    const [accCode, setAccCode] = useState("")
    const [loading, setLoading] = useState(true)

    const [expCodeState, setExpCodeState] = useState({})
    const [isReadOnly, setIsReadOnly] = useState(false)

    const [form] = Form.useForm()

    const [messageApi, contextHolder] = message.useMessage();

    const [smetaTypes  , setSmetaTypes] = useState("");
    const [docDate  , setDocDate] = useState("");


    const headers = {'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const getTabData = async (filter = '') => {

        let filters = [];
        if (filter!=='' && filter!== '{}') filters = filter

        dataSmetaExpNewTab.query.source = `get_smeta_by_id_expense_horizontal_month_hierarchical(${smetaIddoc})`;

        const { data } = await axios.post(QUERY_URL,
            ( dataSmetaExpNewTab ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });

        const { data: dataSmeta } = await axios.get(LOADSMETA_URL,
            {
                params: {"id": smetaIddoc},
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        setLoading(false);
        setStateTab(data);


        form.setFieldValue("idSmeta", smetaIddoc)
        form.setFieldValue("accId", dataSmeta.accid)
        form.setFieldValue("acc", dataSmeta.acc)
        form.setFieldValue("accName", dataSmeta.accName)
        form.setFieldValue("purpose", dataSmeta.purpose)
        form.setFieldValue("docDate", dayjs(dataSmeta.docDate,'DD.MM.YYYY'))
        form.setFieldValue("finyear",dayjs(Date(dataSmeta.finYear),'YYYY'))
        form.setFieldValue("smeta_type", dataSmeta.smetaType.toString())

        changeDateFormat(dayjs(dataSmeta.docDate,'DD.MM.YYYY'),dataSmeta.docDate)

    };

    const getSmetaType = async () => {

        try {

            const headers = {'Content-Type':'application/json;charset=utf-8',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Credentials':'true',
                'withCredentials': true
            }

            const response = await axios.post(QUERY_URL,
                JSON.stringify(dataSmetaType),
                {
                    headers: headers,
                    crossDomain: true,
                    withCredentials: false
                });
            //setLoading(false);
            setSmetaTypes(response?.data);

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
        getTabData();
        getSmetaType();
    }, []);

    const handleCreate = () => {
        form
            .validateFields()
            .then(async (values) => {
                values["finYear"] = values.finyear.format("YYYY")
                values["smetaType"] = values.smeta_type
                values["id"] = values.idSmeta
                values["filial"] = '000'
                values["docDate"] = docDate
                values["sumpay"] = 0

                if (Number.parseInt(values["idSmeta"]) === 0) delete values.id;

                delete values.finyear
                delete values.smeta_type
                delete values.idSmeta
                delete values.accName

                values["smetapoints"] = getExpenseData()
                console.log(JSON.stringify(values),'eeed')

                try {
                    const {data} = await axios.post(SAVE_URL,

                        JSON.stringify(values),
                        {
                            headers: headers,
                            crossDomain: true,
                            withCredentials: false
                        }
                        // )
                    )

                    messageApi.open({
                        type: 'success',
                        content: 'Муввафакиятли тахрирланди',
                        duration: 3,
                    }).then(()=> {
                        form.setFieldValue('idSmeta',data.id)
                        }
                    );
                    //}).then();
                } catch (err) {
                    messageApi.open({
                        type: 'error',
                        content: err.response?.data?.message,
                    });
                    //message.error(err.response?.data);
                }
                //navigate("../smetaCreate",{state: { smetaType:values["smeta_type"], finYear: values["finyear"], acc:values['acc']}});
            })



    };

    const getExpenseData = () => {
        const updatedData = [...stateTab];
        const expWithValue = updatedData.filter(elem =>  elem.expense_isleaf === 'Y' && elem.year !== 0)
        let submitData = [];
        expWithValue.forEach(elem => {

            let expCurr = elem.expense;
            for ( const prop in elem ) {
                const result = {};
                if (prop.startsWith("m_") && elem[prop] !== 0) {
                    let num = parseInt(prop.substring(2));
                    result.expense = expCurr
                    result.month = num
                    result.sumPay = elem[prop]
                    submitData.push(result)
                }
            }
        })

        return submitData;
    }

    const handleFormExit = () => {
        navigate(-1)
    }

    const changeAccCode = (res) => {
        form.setFieldValue('acc',res.code)
        form.setFieldValue('accId',res.id)
        form.setFieldValue('accName',res.name)
    }

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

    const rowSelection = {
        type: 'radio',
        selectedRowKeys,
        getCheckboxProps: (record) => ({
            style: {
                visibility: 'hidden',
                position: 'absolute',
            },
        }),
        onChange: (record, selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const onSelect = (record, rowIndex) => {
        if (record.expense_isleaf === 'N') setIsReadOnly(true)
        if (record.expense_isleaf === 'Y') setIsReadOnly(false)
        setSelectedRowKeys([record.expense]);
        setSelectedRow(record);
        setSelectedRowIndex(rowIndex);
    };

    const onRow = (record, rowIndex) => {
        return {
            //onClick: () =>{ if (record.expense_isleaf !== 'N') onSelect(record, rowIndex) }
            onClick: () =>{ onSelect(record, rowIndex) }
        }
    };

    const handleSum = (value, record, month, quart ) => {

        if (!selectedRowIndex || selectedRowIndex === -1) {
            messageApi.open({
                type: 'warning',
                content: 'Харажат моддасини танланг',
                duration: 2,
            }).then((r)=> r )
            return
        }
        const updatedData = [...stateTab];
        const rowIndex = selectedRowIndex
        console.log(updatedData[rowIndex],'before')

//update month
        updatedData[rowIndex][month] = parseInt(value, 10) || 0;
        console.log(updatedData[rowIndex],'after')

//update quart
        let quartObj;

        for (let i = 0; i < quarterStruct.length; i++) {
            const obj = quarterStruct[i];
            if (obj.hasOwnProperty(quart)) {
                quartObj = obj;
                break;
            }
        }

        let sumQuart = 0;
        quartObj[quart].forEach(elem => {
            sumQuart += updatedData[rowIndex][elem]
        })
        updatedData[rowIndex][quart] = parseInt(sumQuart, 10) || 0;

//update year by quarts
        let sumYear = 0;
        ['q_1','q_2','q_3','q_4'].forEach(elem => {
            sumYear += updatedData[rowIndex][elem]
        })
        console.log(sumYear)
        updatedData[rowIndex]['year'] = parseInt(sumYear, 10) || 0;

//update parents

        //update parent set year value to zero
        const expParentWithValue = updatedData.filter(elem =>  elem.expense_isleaf === 'N' && elem.year !== 0)

        expParentWithValue.forEach(elem => {
            const index = updatedData.findIndex(item => item.expense === elem.expense )

            updatedData[index]['year'] = 0;
            updatedData[index]['q_1'] = 0;
            updatedData[index]['q_2'] = 0;
            updatedData[index]['q_3'] = 0;
            updatedData[index]['q_4'] = 0;
            updatedData[index]['m_1'] = 0;
            updatedData[index]['m_2'] = 0;
            updatedData[index]['m_3'] = 0;
            updatedData[index]['m_4'] = 0;
            updatedData[index]['m_5'] = 0;
            updatedData[index]['m_6'] = 0;
            updatedData[index]['m_7'] = 0;
            updatedData[index]['m_8'] = 0;
            updatedData[index]['m_9'] = 0;
            updatedData[index]['m_10'] = 0;
            updatedData[index]['m_11'] = 0;
            updatedData[index]['m_12'] = 0;

        })

        //update Parent year
        const expWithValue = updatedData.filter(elem =>  elem.expense_isleaf === 'Y' && elem.year !== 0)


        expWithValue.forEach(elem => {
            const expSum = elem.year;
            const expPar = elem.expense_parent;
            const q_1  = elem.q_1;
            const q_2  = elem.q_2;
            const q_3  = elem.q_3;
            const q_4  = elem.q_4;
            const m_1  = elem.m_1;
            const m_2  = elem.m_2;
            const m_3  = elem.m_3;
            const m_4  = elem.m_4;
            const m_5  = elem.m_5;
            const m_6  = elem.m_6;
            const m_7  = elem.m_7;
            const m_8  = elem.m_8;
            const m_9  = elem.m_9;
            const m_10 = elem.m_10;
            const m_11 = elem.m_11;
            const m_12 = elem.m_12;

            updateParentsSum(updatedData , expPar, expSum, q_1, q_2, q_3, q_4, m_1, m_2, m_3, m_4, m_5, m_6, m_7, m_8, m_9, m_10, m_11, m_12)

        })

        setStateTab(updatedData);

    }

    const updateParentsSum = (obj, code, sumpay, q_1, q_2, q_3, q_4, m_1, m_2, m_3, m_4, m_5, m_6, m_7, m_8, m_9, m_10, m_11, m_12) => {

        let isFirst = true
        for (let i = 0; i < obj.length; i++) {
            if (obj[i].expense === code) {
                //if (isFirst) obj[i].year = 0;
                obj[i].year += sumpay;
                obj[i].q_1  += q_1;
                obj[i].q_2  += q_2;
                obj[i].q_3  += q_3;
                obj[i].q_4  += q_4;
                obj[i].m_1  += m_1;
                obj[i].m_2  += m_2;
                obj[i].m_3  += m_3;
                obj[i].m_4  += m_4;
                obj[i].m_5  += m_5;
                obj[i].m_6  += m_6;
                obj[i].m_7  += m_7;
                obj[i].m_8  += m_8;
                obj[i].m_9  += m_9;
                obj[i].m_10 += m_10;
                obj[i].m_11 += m_11;
                obj[i].m_12 += m_12;

                if (obj[i].expense_parent) {
                    isFirst = false;
                    updateParentsSum(obj, obj[i].expense_parent, sumpay, q_1, q_2, q_3, q_4, m_1, m_2, m_3, m_4, m_5, m_6, m_7, m_8, m_9, m_10, m_11, m_12);
                }
                break;
            }
        }
    }


    function changeDateFormat(date, dateString){
        setDocDate(dateString)
    }

    return (
        <>
            {contextHolder}

            <Layout style={{height:"100%", overflow:"hidden"}}>

                <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", justifyContent: "left", alignItems:"center", padding:"12px"}}>
                    <h3><Button shape="circle" icon={<LeftOutlined />}  style={{fontSize:'14px',marginRight:"10px"}} onClick={handleFormExit}/>Смета харажатларини тахрирлаш</h3>
                </div>

                <Form form={form} initialValues={{}}>
                    {/*<div style={{display:"flex", flexDirection:"row", justifyContent:"left",alignItems:"center"}}>*/}
                    <Space.Compact block direction="vertical">

                        <Row gutter={[8, 8]} style={{marginRight:'0',marginLeft:'0'}}>

                            <Col span={2}>
                                <Button
                                    onClick={handleCreate}
                                    type="primary"
                                >
                                    Сақлаш
                                </Button>
                            </Col>

                            <Col span={22}>

                                <Space>

                                    <Form.Item name="idSmeta" label="idSmeta" initialValue="0" hidden={true} rules={[{required: true, message:'id киритинг!'}]}>
                                        <Input style={{width:'50px'}}/>
                                    </Form.Item>

                                    <Form.Item name="smeta_type" label="Смета тури" initialValue="1" rules={[{ required: true, message:'Смета турини танланг!'}]} style={{width:'280px'}}>
                                        <Select placeholder="Смета турини танланг" defaultValue="1">
                                            {smetaTypes &&
                                                smetaTypes.map((elem) => {
                                                    return (
                                                        <Option key={elem.id}>{elem.name}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </Form.Item>

                                    <Form.Item name="finyear" label="Молиявий йил" rules={[{ required: true, message:'Молиявий йилни танланг!'}]} >
                                        <DatePicker picker="year" format="YYYY"/>
                                    </Form.Item>

                                    <Form.Item name="docDate" label="Хужжат санаси" rules={[{ required: true, message:'Хужжат санасини танланг!'}]} >
                                        <DatePicker label="Хужжат санаси" format='DD.MM.YYYY' onChange={changeDateFormat}/>
                                    </Form.Item>

                                    <Form.Item name="purpose" label="Тафсилотлар" rules={[{required: true, message:'Тафсилотларни киритинг!'}]}>
                                        <Input style={{width:'300px'}}/>
                                    </Form.Item>

                                </Space>

                            </Col>

                        </Row>

                        <Row gutter={[8, 8]} style={{marginRight:'0',marginLeft:'0'}}>

                            <Col span={2}>
                            </Col>

                            <Col span={22}>

                                <Space.Compact block>

                                    <Form.Item name="acc" label="Хисоб ракам" rules={[{ required: true, message:'Хисоб ракамни танланг!'}]} >
                                        {/*<InputNumber maxLength="20" width="200px"/>*/}
                                        <NumericInput style={{ width: 180, }} value={accCode} onChange={setAccCode}/>
                                    </Form.Item>

                                    <Form.Item name="accId" label="accId" style={{ display: 'none' }}>
                                        <Input type="text" />
                                    </Form.Item>

                                    <Form.Item name="accName" rules={[{ required: false, message:'Хисоб ракамни номи буш!'}]} style={{ width:"400px"}}>
                                        <Input readOnly="true"/>
                                    </Form.Item>

                                    <TableModal modalDataTab={dataSmetaAccTab(auth.empId)}
                                                modalColumnTab={columnsAcc(t)}
                                                modalFilterTab={dataSmetaAccFilter}
                                                modalTitleTab="Хисоб ракамлар"
                                                onSubmit={ changeAccCode }
                                    />

                                </Space.Compact>


                            </Col>

                        </Row>

                    </Space.Compact>

                </Form>

                {/*<div style={{display:"flex", flexDirection:"row"}}>*/}
                <div style={{position: 'relative', height: '100%'}}>

                    <Table rowSelection={rowSelection}
                           dataSource={stateTab}
                           className='table-striped-rows'
                           rowKey="expense"
                           loading={loading}
                           size='small'
                           scroll={{x: 300, y:'calc(100vh - 450px)'}}
                           tableLayout="auto"
                           pagination={false}
                        //defaultSelectedRowKeys={defaultSelectedRowKeys}
                           onRow={onRow}
                    >

                        <Column title="Харажат моддаси" dataIndex="expense" key="code" width={100}
                                render={(text, record) =>
                                            record.expense_isleaf === 'Y' ? (
                                            text
                                            ) : (
                                            <b>{text}</b>
                                            )
                                        }
                        >
                        </Column>
                        <Column title="Номи" dataIndex="expense_name" key="name" width={200}
                                render={(text, record) =>
                                    record.expense_isleaf === 'Y' ? (
                                        text
                                    ) : (
                                        <b>{text}</b>
                                    )
                                }
                        >
                        </Column>
                        <Column title="Юкори модда" dataIndex="expense_parent" key="parent" width={100}
                                render={(text, record) =>
                                    record.expense_isleaf === 'Y' ? (
                                        text
                                    ) : (
                                        <b>{text}</b>
                                    )
                                }
                        >
                        </Column>
                        <Column title="Сумма" dataIndex="year" key="year" width={100} align="right"
                                render={(text, record) =>
                                    record.expense_isleaf === 'Y' ? (
                                        parseFloat(text).toLocaleString("en-EN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })

                                    ) : (
                                        <b>
                                            {
                                                parseFloat(text).toLocaleString("en-EN", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })
                                            }
                                        </b>
                                    )
                                }
                        >
                        </Column>

                    </Table>

                    {selectedRow &&  (

                        <Descriptions bordered
                                      size='small'
                                      disabled
                                      style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', padding: 0 }}
                                      column={{
                                          xxl: 4,
                                          xl: 4,
                                          //lg: 3
                                      }}
                        >

                            <Descriptions.Item label="1 кв" style={{padding:'2px 16px'}}>{
                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'

                                    }}
                                    className='bm-input-number-align-right'
                                    //defaultValue={selectedRow.q_1||0}
                                    value={selectedRow.q_1}
                                    step={null}
                                    controls={false}
                                    readOnly={true}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />

                            }
                            </Descriptions.Item>
                            <Descriptions.Item label="2 кв" style={{padding:'2px 16px'}}>{
                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'
                                    }}
                                    className='bm-input-number-align-right'
                                    //defaultValue={selectedRow.q_2||0}
                                    value={selectedRow.q_2}
                                    step={null}
                                    controls={false}
                                    readOnly={true}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            }
                            </Descriptions.Item>
                            <Descriptions.Item label="3 кв" style={{padding:'2px 16px'}}>{
                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'
                                    }}
                                    className='bm-input-number-align-right'
                                    //defaultValue={selectedRow.q_3||0}
                                    value={selectedRow.q_3}
                                    step={null}
                                    controls={false}
                                    readOnly={true}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            }
                            </Descriptions.Item>
                            <Descriptions.Item label="4 кв" style={{padding:'2px 16px'}}>{
                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'
                                    }}
                                    className='bm-input-number-align-right'
                                    //defaultValue={selectedRow.q_4||0}
                                    value={selectedRow.q_4}
                                    step={null}
                                    controls={false}
                                    readOnly={true}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            }</Descriptions.Item>

                            <Descriptions.Item label="Янв" style={{padding:'2px 16px'}}>{
                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'
                                    }}
                                    className='bm-input-number-align-right'
                                    //defaultValue={selectedRow.m_1||0}
                                    value={selectedRow.m_1}
                                    onChange={(value) => handleSum(value,selectedRow, 'm_1', 'q_1')}
                                    step={null}
                                    controls={false}
                                    readOnly={isReadOnly}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            }
                            </Descriptions.Item>
                            <Descriptions.Item label="Апр" style={{padding:'2px 16px'}}>{
                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'
                                    }}
                                    className='bm-input-number-align-right'
                                    //defaultValue={selectedRow.m_2||0}
                                    value={selectedRow.m_4}
                                    onChange={(value) => handleSum(value,selectedRow, 'm_4', 'q_2')}
                                    step={null}
                                    controls={false}
                                    readOnly={isReadOnly}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            }
                            </Descriptions.Item>
                            <Descriptions.Item label="Июл" style={{padding:'2px 16px'}}>{
                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'
                                    }}
                                    className='bm-input-number-align-right'
                                    //defaultValue={selectedRow.m_3||0}
                                    value={selectedRow.m_7}
                                    onChange={(value) => handleSum(value,selectedRow, 'm_7', 'q_3')}
                                    step={null}
                                    controls={false}
                                    readOnly={isReadOnly}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            }
                            </Descriptions.Item>
                            <Descriptions.Item label="Окт" style={{padding:'2px 16px'}}>{
                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'
                                    }}
                                    className='bm-input-number-align-right'
                                    //defaultValue={selectedRow.m_4||0}
                                    value={selectedRow.m_10}
                                    onChange={(value) => handleSum(value,selectedRow, 'm_10', 'q_4')}
                                    step={null}
                                    controls={false}
                                    readOnly={isReadOnly}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            }
                            </Descriptions.Item>

                            <Descriptions.Item label="Фев" style={{padding:'2px 16px'}}>{
                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'
                                    }}
                                    className='bm-input-number-align-right'
                                    //defaultValue={selectedRow.m_5||0}
                                    value={selectedRow.m_2}
                                    onChange={(value) => handleSum(value,selectedRow, 'm_2', 'q_1')}
                                    step={null}
                                    controls={false}
                                    readOnly={isReadOnly}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            }
                            </Descriptions.Item>
                            <Descriptions.Item label="Май" style={{padding:'2px 16px'}}>{
                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'
                                    }}
                                    className='bm-input-number-align-right'
                                    //defaultValue={selectedRow.m_6||0}
                                    value={selectedRow.m_5}
                                    onChange={(value) => handleSum(value,selectedRow, 'm_5', 'q_2')}
                                    step={null}
                                    controls={false}
                                    readOnly={isReadOnly}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            }
                            </Descriptions.Item>
                            <Descriptions.Item label="Авг" style={{padding:'2px 16px'}}>{
                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'
                                    }}
                                    className='bm-input-number-align-right'
                                    //defaultValue={selectedRow.m_7||0}
                                    value={selectedRow.m_8}
                                    onChange={(value) => handleSum(value,selectedRow, 'm_8', 'q_3')}
                                    step={null}
                                    controls={false}
                                    readOnly={isReadOnly}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            }
                            </Descriptions.Item>
                            <Descriptions.Item label="Ноя" style={{padding:'2px 16px'}}>{
                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'
                                    }}
                                    className='bm-input-number-align-right'
                                    //defaultValue={selectedRow.m_8||0}
                                    value={selectedRow.m_11}
                                    onChange={(value) => handleSum(value,selectedRow, 'm_11', 'q_4')}
                                    step={null}
                                    controls={false}
                                    readOnly={isReadOnly}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            }
                            </Descriptions.Item>

                            <Descriptions.Item label="Мар" style={{padding:'2px 16px'}}>{
                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'
                                    }}
                                    className='bm-input-number-align-right'
                                    //defaultValue={selectedRow.m_9||0}
                                    value={selectedRow.m_3}
                                    onChange={(value) => handleSum(value,selectedRow, 'm_3', 'q_1')}
                                    step={null}
                                    controls={false}
                                    readOnly={isReadOnly}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            }
                            </Descriptions.Item>
                            <Descriptions.Item label="Июн" style={{padding:'2px 16px'}}>{
                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'
                                    }}
                                    className='bm-input-number-align-right'
                                    //defaultValue={selectedRow.m_10||0}
                                    value={selectedRow.m_6}
                                    onChange={(value) => handleSum(value,selectedRow, 'm_6', 'q_2')}
                                    step={null}
                                    controls={false}
                                    readOnly={isReadOnly}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            }
                            </Descriptions.Item>
                            <Descriptions.Item label="Сен" style={{padding:'2px 16px'}}>{
                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'
                                    }}
                                    className='bm-input-number-align-right'
                                    //defaultValue={selectedRow.m_11||0}
                                    value={selectedRow.m_9}
                                    onChange={(value) => handleSum(value,selectedRow, 'm_9', 'q_3')}
                                    step={null}
                                    controls={false}
                                    readOnly={isReadOnly}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            }
                            </Descriptions.Item>
                            <Descriptions.Item label="Дек" style={{padding:'2px 16px'}}>{
                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'
                                    }}
                                    className='bm-input-number-align-right'
                                    //defaultValue={selectedRow.m_12||0}
                                    value={selectedRow.m_12}
                                    onChange={(value) => handleSum(value,selectedRow, 'm_12', 'q_4')}
                                    step={null}
                                    controls={false}
                                    readOnly={isReadOnly}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            }
                            </Descriptions.Item>

                        </Descriptions>

                    )}


                </div>


        </Layout>

        </>

    );

}

export default SmetaAccNew