import {
    Button,
    Form,
    Layout,
    message,
    Table,
} from 'antd';
import React, {useContext, useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import {useTranslation} from 'react-i18next';
import {sortCompareString} from "../../libs/formbm";
import {useColumnSearchProps} from "../../libs/columnFilter";
import {FileExcelOutlined} from "@ant-design/icons";
import exportToExcel from "../../components/ExportToExcel";

const {Column} = Table;

const BankAccSaldoTab = ({setTitleNav}) => {

    let navigate = useNavigate();

    const auth = useContext(AuthContext)

    const { t } = useTranslation()

    let location = useLocation();

    const [stateTab, setStateTab] = useState([])
    const [filterTab, setFilterTab] = useState("")
    const [loading, setLoading] = useState(false)

    const [form] = Form.useForm()

    const [messageApi, contextHolder] = message.useMessage();

    const headers = {'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const getTabData = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get('/api/public/banking/currentAccountBalancesRequest',
                {
                    headers: headers,
                    //crossDomain: true,
                    withCredentials: false
                });

            if (data.error === "0") {
                const mainArray = data?.accounts
                const formattedObject = mainArray.map((item) => ({
                    ...item, // Spread the original object's properties
                    saldo: (parseFloat(item.saldo) / 100).toLocaleString('en-EN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }),
                }));

                setStateTab(formattedObject)
                console.log(formattedObject)
            }
            else { setStateTab([]) }

            setLoading(false);

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
            setLoading(false);
        }

    };

    useEffect(() => {
        setTitleNav('Хисоб рақамлар колдиғи (Банк)');
    }, []);

    const handleFormExit = () => {
        navigate(-1)
    }

    const handleExport = () => {
        exportToExcel(stateTab)
    };

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
                <Button type='primary' loading={loading} onClick={() => getTabData().then(null)} >
                    {t('bankRequest')}
                </Button>
                <Button type="primary" shape="circle" onClick={handleExport}>
                    <FileExcelOutlined/>
                </Button>
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
    };

    const noDataPagination = () => {
        return (
                <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", width: '100%', justifyContent: "space-between"}}>
                    <span>
                        <strong>0</strong> катордан 0-0 гача
                    </span>
                </div>
        )
    }

    return (
        <>
            {contextHolder}

            <Layout style={{height:"100%", overflow:"hidden"}}>

                {/*<div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", justifyContent: "left", alignItems:"center", padding:"12px"}}>
                    <h3><Button shape="circle" icon={<LeftOutlined />}  style={{fontSize:'14px',marginRight:"10px"}} onClick={handleFormExit}/>Хисоб рақамлар қолдиғи (Банк)</h3>
                </div>*/}

                <div style={{position: 'relative', height: '100%'}}>

                    <Table rowSelection={rowSelection}
                           dataSource={stateTab}
                           className='table-striped-rows'
                           rowKey="account"
                           loading={loading}
                           size='small'
                           scroll={{x: 300, y:'calc(100vh - 260px)'}}
                           tableLayout="auto"
                           title={tableHeader}
                           pagination={pagination}
                           onRow={onRow}
                    >

                        <Column title={t('mfo')} dataIndex="bank" key="bank" width={50}
                                sorter={(a, b) => a.bank - b.bank}
                        ></Column>
                        <Column title={t('bankAcc')} dataIndex="account" key="account" width={50} {...useColumnSearchProps('account')}
                                sorter={(a, b) => a.account - b.account}
                        ></Column>
                        <Column title={t('name')} dataIndex="name" key="name" width={200} {...useColumnSearchProps('name')}
                                sorter={(a, b) => sortCompareString(a.name, b.name)}
                        ></Column>
                        <Column title={t('accSaldo')} dataIndex="saldo" key="saldo" width={50} align="right"
                                sorter={(a, b) => parseFloat(a.saldo) - parseFloat(b.saldo)}
                                /*render={(text) => (parseFloat(text) / 100).toLocaleString('en-EN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}*/
                        ></Column>
                        <Column title={t('docDate')} dataIndex="datedoc" key="name" width={50}
                                sorter={(a, b) => new Date(a.datedoc.split('.').reverse().join('-')) - new Date(b.datedoc.split('.').reverse().join('-'))}
                        ></Column>
                        <Column title={t('dateOpen')} dataIndex="dateopen" key="dateopen" width={50} {...useColumnSearchProps('dateopen')}
                                sorter={(a, b) => new Date(a.dateopen.split('.').reverse().join('-')) - new Date(b.dateopen.split('.').reverse().join('-'))}
                        ></Column>
                        <Column title={t('dateWork')} dataIndex="datework" key="datework" width={50} {...useColumnSearchProps('datework')}
                                sorter={(a, b) => new Date(a.datework.split('.').reverse().join('-')) - new Date(b.datework.split('.').reverse().join('-'))}
                        ></Column>

                    </Table>

                </div>


            </Layout>

        </>

    );

}

export default BankAccSaldoTab