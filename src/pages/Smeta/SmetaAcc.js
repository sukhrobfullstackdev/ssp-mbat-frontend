import {
    Button,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    Layout,
    message,
    Row,
    Select,
    Space,
    Table,
    Typography
} from 'antd';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import {NumericInput} from "../../libs/formbm"

import {
    columnsAcc,
    dataSmetaAccFilter,
    dataSmetaAccTab,
    dataSmetaExpFilter,
    dataSmetaExpTab,
    dataSmetaType
} from "./SmetaData";
import FilterModal from "../../components/FilterModalBM";
import {LeftOutlined} from "@ant-design/icons";
import TableModal from "../../components/TableModalBM";
import QuartsByMonth from "../../components/QuartsByMonth";
import TextArea from "antd/es/input/TextArea";

import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const {Option} = Select;

//import {getDataBooks} from "../../services/index"

const SAVE_URL = '/smeta/save';
const QUERY_URL = '/api/public/query';

const SmetaAcc = () => {

    let navigate = useNavigate();

    const auth = useContext(AuthContext)

    const { t } = useTranslation()

    const [stateTab, setStateTab] = useState([])
    const [filterTab, setFilterTab] = useState("")
    const [accCode, setAccCode] = useState("")
    const [loading, setLoading] = useState(true)

    const [expCodeState, setExpCodeState] = useState({})

    const [allExpObj, setAllExpObj] = useState([])
    const [expObj, setExpObj] = useState({ jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 })
    const [quartsData, setQuartsData] = useState({ Q1:0, Q2:0, Q3:0, Q4:0 });
    const [form] = Form.useForm()

    const [messageApi, contextHolder] = message.useMessage();

    const [smetaTypes  , setSmetaTypes] = useState("");
    const [docDate  , setDocDate] = useState("");


    const columnsExpSmeta = [
        {
            title: 'ИД',
            dataIndex: 'id',
            width: 100,
            //sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Харажат моддаси',
            dataIndex: 'code',
            width: 150,
            //sorter: (a, b) => a.code.length - b.code.length,
            //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            ellipsis: true,
            render: (text, record) =>
                /*{
                    console.log(text,'text');
                    console.log(record,'rec');
                }*/
                record.isleaf === 'Y' ? (
                    text
                ) : (
                    <b>{text}</b>
                ),
        },
        {
            title: 'Номи',
            dataIndex: 'name',
            width: 400,
            //sorter: (a, b) => a.name.length - b.name.length,
            //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            ellipsis: true,
            render: (text, record) =>
                /*{
                    console.log(text,'text');
                    console.log(record,'rec');
                }*/
                record.isleaf === 'Y' ? (
                    /*<Tooltip placement="bottomRight" title={text}>*/
                    text
                    /*</Tooltip>*/

                ) : (
                    /*<Tooltip placement="bottomRight" title={text}>*/
                    <b>{text}</b>
                    /*</Tooltip>*/
                ),
        },
        {
            title: 'Юкори модда',
            dataIndex: 'parent',
            width: 150,
            //sorter: (a, b) => a.parent.length - b.parent.length,
            //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            ellipsis: true,
            render: (text, record) =>
                record.isleaf === 'Y' ? (
                    text
                ) : (
                    <b>{text}</b>
                ),
        },
        {
            title: 'Сумма',
            dataIndex: 'sumpayexp',
            width: 200,
            align: "right",
            render: (text, record) =>
                record.isleaf === 'Y' ? (
                    text
                ) : (
                    <b>{text}</b>
                ),
        },

    ];

    const headers = {'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const getTabData = async (filter = '') => {

        let filters = [];
        if (filter!=='' && filter!== '{}') filters = filter

        const { data } = await axios.post(QUERY_URL,
            ( dataSmetaExpTab ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        setLoading(false);
        setStateTab(data);

        setFilterTab( dataSmetaExpFilter );

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

                values["smetapoints"] = getExpData()
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
                        content: 'Муввафакият',
                        duration: 1,
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

    const getExpData = () => {
        const monthId = {jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12}
        const newObjSave = allExpObj.map(({expCode, formSum }) => {
            let notZero = formSum.filter( item => item.sumpay !== 0 ); // not zero Months
            return notZero.map(({month, sumpay}) => ({
                expense: expCode,
                month: monthId[month],
                sumPay: parseInt(sumpay)
            }))

        });

        return newObjSave.concat.apply([], newObjSave).flatMap(x => x);
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
    const [selectedRow, setSelectedRow] = useState(-1);

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
            setExpCodeState(record.code)
        },
    };

    const onRow = (record, rowIndex) => {
        return {
            onClick: () =>{ if (record.isleaf === 'N') return false; handleRowSelection2(record, rowIndex) }
        }
    };

    const handleRowSelection2 = (record, rowIndex) => {
//        console.log(rowIndex, 'rowIndex')

        setExpCodeState(record.code)
        setSelectedRowKeys([record.id]);
        setSelectedRow(rowIndex);

        let setObj = allExpObj.find(item => item.expCode === record.code)
        if (setObj !== undefined) {
            setExpObj(setObj.newObjMonth)
            setQuartsData(setObj.quartSum)
        }
        else {
            setExpObj({ jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 })
            setQuartsData({ Q1:0, Q2:0, Q3:0, Q4:0 })
        }
        //console.log(setObj,'onrowsetobj')
        //console.log(expObj,'expObjasdasd')

    };


    const updateParentsSum = (obj, code, sumpay) => {
        for (let i = 0; i < obj.length; i++) {
            if (obj[i].code === code) {
                obj[i].sumpayexp += sumpay;
                if (obj[i].parent) {
                    updateParentsSum(obj, obj[i].parent, sumpay);
                }
                break;
            }
        }
    }

    const handleCellUpdate = (rowIndex, dataIndex, value) => {
        //console.log(quartsData,'handleCellUpdate')
        /*console.log(rowIndex,'rowIndex')
        console.log(allExpObj,'tempAllExpObj')*/
        const updatedData = [...stateTab];
        updatedData[rowIndex][dataIndex] = value;
        //ITOG PARENT BEG


        for (let i = 0; i < updatedData.length; i++) {
            let parRow = updatedData.findIndex(item => item.isleaf === 'N' && item.sumpayexp !== 0)

            if (parRow !== -1) updatedData[parRow]['sumpayexp'] = 0;
        }

        let expPar = null;
        let expSum = 0;

        for (let i = 0; i <allExpObj.length; i++) {

            let curExp = updatedData.find(item => item.code === allExpObj[i].expCode);
            expSum = curExp.sumpayexp;
            expPar = curExp.parent;

            updateParentsSum(updatedData , expPar, expSum)

        }
        //ITOG PARENT END
        //setData(updatedData);

        setStateTab(updatedData);
    };

    const handleChangeQuart = ({allQuartSum, ...obj} ) => {
        let tempAllExpObj = allExpObj
        //console.log(obj, 'console.log(quartsData)')
        //console.log(obj.newObjMonth, 'console.log(newObjMonth)')

        let allExp_ = tempAllExpObj.find(item => item.expCode === obj.expCode)
        if (allExp_ === undefined) tempAllExpObj.push(obj)
        else allExp_.newObjMonth = obj.newObjMonth

        setExpObj(obj.newObjMonth);
        setQuartsData(obj.quartsData)
        setAllExpObj(tempAllExpObj)
        handleCellUpdate(selectedRow, 'sumpayexp', allQuartSum)

    }

    function changeDateFormat(date, dateString){
        setDocDate(dateString)
    }

    return (
        <>
            {contextHolder}

            <Layout style={{height:"100%", overflow:"hidden"}}>

                <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", justifyContent: "left", alignItems:"center", padding:"12px"}}>
                    <h3><Button shape="circle" icon={<LeftOutlined />}  style={{fontSize:'14px',marginRight:"10px"}} onClick={handleFormExit}/>Смета харажатларини киритиш</h3>
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

                                    <Form.Item name="idSmeta" label="idSmeta" hidden={true} initialValue="0" rules={[{required: true, message:'id киритинг!'}]}>
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

                                    <Form.Item name="accName" rules={[{ required: true, message:'Хисоб ракамни номи буш!'}]} style={{ width:"400px"}}>
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
                <div>

                    {/*<Title level={5} style={{textAlign:"center"}}>Харажатлар моддаси</Title>*/}

                    {/*<Divider />*/}

                    <Table columns={columnsExpSmeta}
                           dataSource={stateTab}
                           rowKey="id"
                           rowSelection={rowSelection}
                           size="small"
                           loading={loading}
                           scroll={{x: 300, y:300}}
                           pagination={false}
                           footer={() => { return <QuartsByMonth expCode={expCodeState}
                                                                 quartsData={quartsData}
                                                                 expObj={expObj}
                                                                 handleChangeQuart={handleChangeQuart}
                                                                 selectedRowKeys={selectedRowKeys} />
                                                } }
                           onRow={onRow}


                        //scroll={{x: 300, y:'calc(100vh - 345px)'}}d
                           //scroll={{x: 300, y:'calc(100vh - 300px)'}}
                        //tableLayout="auto"

                        //style={{width: '100%', height: '100vh'}}
                    />


                </div>


        </Layout>

        </>

    );

}

export default SmetaAcc