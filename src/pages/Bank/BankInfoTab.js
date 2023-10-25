import {Button, DatePicker, Form, Input, Layout, message, Space, Table, Tag,} from 'antd';
import React, {useContext, useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import {NumericInput} from "../../libs/formbm"

import {columnsAcc, dataSmetaAccFilter, dataSmetaAccTab,} from "../Smeta/SmetaData";
import {ArrowDownOutlined, ArrowUpOutlined, FileExcelOutlined,} from "@ant-design/icons";
import TableModal from "../../components/TableModalBM";

import {useTranslation} from 'react-i18next';
import {useColumnSearchProps} from "../../libs/columnFilter";

import dayjs from "dayjs";
import exportToExcel from "../../components/ExportToExcel";

const {Column} = Table;
const { RangePicker } = DatePicker;

const BankInfoTab = ({setTitleNav}) => {

    let navigate = useNavigate();

    const auth = useContext(AuthContext)

    const { t } = useTranslation()

    let location = useLocation();

    const [stateTab, setStateTab] = useState([])
    const [filterTab, setFilterTab] = useState("")
    const [accCode, setAccCode] = useState("")
    const [loading, setLoading] = useState(false)

    const [form] = Form.useForm()

    const [messageApi, contextHolder] = message.useMessage();

    const defaultStartDate = dayjs().startOf('day'); // Today's start date in 'DD.MM.YYYY' format
    const defaultEndDate = dayjs().endOf('day');     // Today's end date in 'DD.MM.YYYY' format

    const headers = {'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const getTabData = async () => {
        try {
            const accCode = form.getFieldValue('acc')
            const bankCode = form.getFieldValue('bank')
            const dateInfo = form.getFieldValue('dateInfo')
            const dateFrom = dateInfo[0].format('DD.MM.YYYY')
            const dateTo = dateInfo[1].format('DD.MM.YYYY')

            setLoading(true);
            const {data} = await axios.post('/api/public/banking/getFullReport',
                ({
                    "mfo": bankCode,
                    "account": accCode,
                    "dateFrom": dateFrom,
                    "dateTo": dateTo
                }),
                {
                    headers: headers,
                    //crossDomain: true,
                    withCredentials: false
                });

            if (data.error === "0") {
                setStateTab(data?.docs)
            } else {
                message.warning(data?.message);
                setStateTab([])
            }
            setLoading(false);

        } catch (err) {
            console.log(err)
            if (!err?.response) {
                message.error(err.response?.data);
            } else if (err.response?.status === 400) {
                message.error(err.response?.data ||'INTERNAL');
            } else if (err.response?.status === 401) {
                message.error(err.response?.data ||'UNAUTHORIZED');
            } else if (err.response?.status === 404) {
                message.error(err.response?.data ||'NOT FOUND');
            } else {
                messageApi.open({
                    type: 'warning',
                    content: err.response?.data?.message ||'OTHERS',
                    duration: 3
                })
            }
            setLoading(false);
        }

    };

    useEffect(() => {
        setTitleNav('Хисоб рақамлар банк кўчирмаси');
    }, []);

    const expandedRowRender = (record) => {

        const columns = [
            {
                title: '',
                dataIndex: 'type',
                key: 'type',
                width: 60
            },
            {
                title: 'ИНН',
                dataIndex: 'tax',
                key: 'tax',
            },
            {
                title: 'Банк коди',
                dataIndex: 'bank',
                key: 'bank',
            },
            {
                title: 'Хисоб ракам',
                dataIndex: 'account',
                key: 'account',
            },
            /*{
                title: 'state',
                key: 'state',
                render: () => <Badge status="success" text="Finished" />,
            },*/
            {
                title: 'Тафсилот',
                dataIndex: 'name',
                key: 'name',
            },
        ];

        const dataObj = record

        const data = []

        data.push({
            key: "sender",
            type: (<Tag icon={<ArrowUpOutlined />} color="volcano" style={{width:100}} bordered="false">
                ТУЛОВЧИ
            </Tag>),
            //type: "Туловчи",
            tax: dataObj.sender.tax,
            bank: dataObj.sender.bank,
            account: dataObj.sender.account,
            name: dataObj.sender.name,
        });

        data.push({
            key: "recipient",
            type: (<Tag icon={<ArrowDownOutlined />} color="blue" style={{width:100}} bordered="false" >
                ОЛУВЧИ
                </Tag>),
            //type: "Олувчи",
            tax: dataObj.recipient.tax,
            bank: dataObj.recipient.bank,
            account: dataObj.recipient.account,
            name: dataObj.recipient.name,
        });

        return <Table columns={columns} dataSource={data} pagination={false} />;

    };

    const handleFormExit = () => {
        navigate(-1)
    }

    const handleExport = () => {
        //Extract props that has objects
        const newJsonArray = [];

        stateTab.forEach((jsonObject) => {
            const newJsonObject = { ...jsonObject };

            newJsonObject["recipient_tax"] = jsonObject.recipient.tax;
            newJsonObject["recipient_bank"] = jsonObject.recipient.bank;
            newJsonObject["recipient_account"] = jsonObject.recipient.account;
            newJsonObject["recipient_name"] = jsonObject.recipient.name;

            newJsonObject["sender_tax"] = jsonObject.sender.tax;
            newJsonObject["sender_bank"] = jsonObject.sender.bank;
            newJsonObject["sender_account"] = jsonObject.sender.account;
            newJsonObject["sender_name"] = jsonObject.sender.name;

            newJsonArray.push(newJsonObject);
        });

        newJsonArray.map(elem => {
            delete elem.recipient
            delete elem.sender
        })

        exportToExcel(newJsonArray)
    };

    const changeAccCode = (res) => {
        form.setFieldValue('acc',res.code)
        form.setFieldValue('accId',res.id)
        form.setFieldValue('accName',res.name)
        form.setFieldValue('bank',res.mfo)
    }

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
        setSelectedRowKeys([record.expense]);
    };

    const onRow = (record, rowIndex) => {
        return {
            onClick: () =>{ onSelect(record, rowIndex) }
        }
    };

    const tableHeader = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>
                <Form form={form} initialValues={{dateInfo: [dayjs(defaultStartDate), dayjs(defaultEndDate)]}}>
                    <Space direction='horizontal'>

                        <Space.Compact block>

                            <Form.Item name="acc" label="Хисоб ракам" rules={[{ required: true, message:'Хисоб ракамни танланг!'}]} >
                                {/*<InputNumber maxLength="20" width="200px"/>*/}
                                <NumericInput style={{ width: 180, }} value={accCode} onChange={setAccCode} readOnly/>
                            </Form.Item>

                            <Form.Item name="accId" hidden={true} label="accId">
                                <Input type="text" />
                            </Form.Item>

                            <Form.Item name="bank" hidden={true} label="bankCode">
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

                        <Form.Item name="dateInfo" label="Даврини танланг" initialValue={{}} rules={[{ required: true, message:'Даврини танланг!'}]} style={{ width:"400px"}}>
                            <RangePicker size="medium"
                                         format="DD.MM.YYYY"
                            />
                        </Form.Item>

                        <Form.Item name="request">
                            <Button type='primary' loading={loading} onClick={() => getTabData().then(null)} >
                                Шакллантириш
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" shape="circle" onClick={handleExport}>
                                <FileExcelOutlined/>
                            </Button>
                        </Form.Item>

                    </Space>

                </Form>

            </div>
        );
    }

    const onShowSizeChange = (current, pageSize) => {

    };

    const pagination = {
        total: stateTab.length,
        showTotal: (total, range) => (
            <>
                <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", width: '100%', justifyContent: "space-between"}}>
                    <span>
                        <strong>{total}</strong> катордан {range[0]}-{range[1]} гача
                    </span>
                </div>
            </>
        ),
        defaultPageSize: '50',
        onShowSizeChange:onShowSizeChange,
        size: 'small',
        defaultCurrent: 1,
        position: ['topRight'],
        showTitle: true
    };

    return (
        <>
            {contextHolder}

            <Layout style={{height:"100%", overflow:"hidden"}}>

                <div style={{position: 'relative', height: '100%'}}>

                    <Table rowSelection={rowSelection}
                           dataSource={stateTab}
                           className='table-striped-rows'
                           rowKey={(record, index) => record.id +''+ index}
                           loading={loading}
                           size='small'
                           scroll={{x: 300, y:'calc(100vh - 280px)'}}
                           tableLayout="auto"
                           title={tableHeader}
                           pagination={pagination}
                           expandable={{
                               expandedRowRender,
                               defaultExpandedRowKeys: ['0'],
                               columnWidth: 10,
                               expandRowByClick: true,
                               //columnTitle: 'asd'
                           }}
                           onRow={onRow}
                    >

                        <Column title="ИД" dataIndex="id" key="id" width={50}
                                sorter={(a, b) => a.id - b.id}
                        ></Column>
                        <Column title="Хужжат раками" dataIndex="numdoc" key="numdoc" width={50} {...useColumnSearchProps('numdoc')}
                                sorter={(a, b) => a.numdoc - b.numdoc}
                        ></Column>
                        <Column title="Хужжат санаси" dataIndex="datedoc" key="datedoc" width={100} {...useColumnSearchProps('datedoc')}
                                sorter={(a, b) => new Date(a.datedoc.split('.').reverse().join('-')) - new Date(b.datedoc.split('.').reverse().join('-'))}
                        ></Column>
                        <Column title="Валюта" dataIndex="currency" key="currency" width={50}
                                sorter={(a, b) => a.currency - b.currency}
                        ></Column>
                        <Column title="Тафсилот" dataIndex="purpose" key="purpose" width={250} {...useColumnSearchProps('purpose')}></Column>
                        <Column title="Утказилган сана" dataIndex="dateprov" key="dateprov" width={50} align="right" {...useColumnSearchProps('dateprov')}
                                sorter={(a, b) => new Date(a.dateprov.split('.').reverse().join('-')) - new Date(b.dateprov.split('.').reverse().join('-'))}
                        ></Column>
                        <Column title="Холат" dataIndex="status" key="status" width={60}></Column>
                        <Column title="Сумма" dataIndex="amount" key="amount" width={60} align="right"
                                sorter={(a, b) => parseFloat(a.amount) - parseFloat(b.amount)}
                                render={(text) => (parseFloat(text) / 100).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                        ></Column>

                    </Table>

                </div>


            </Layout>

        </>

    );

}

export default BankInfoTab