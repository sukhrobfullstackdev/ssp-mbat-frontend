import {Button, DatePicker, Descriptions, Drawer, Layout, message, Modal, Table, Tag} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import "../../custombm.css";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import {
    columnsAccState,
    dataMonitorAccTab,
    dataMonitorAccFilter, dataAccStateTab
} from "./AccountStateData";
import FilterModal from "../../components/FilterModalBM";
import dayjs from "dayjs";
import 'dayjs/locale/uz';
import {DeleteOutlined, FileAddOutlined, LeftOutlined, MinusCircleOutlined} from "@ant-design/icons";
import UserProfile from "../../components/User/UserProfile";
import AccountSaldoAdd from "./AccountSaldoAdd";
import {dataAccTab} from "../Account/AccountData";
import {useTranslation} from "react-i18next";
import {useFilter} from "../../context/FilterContext";

const {Column, ColumnGroup} = Table;

const QUERY_URL = '/api/public/query';
const DELETE_URL = '/account_saldo/deleteAccountSaldoById';


const AccountSaldoTab = ({selAcc}) => {

    const navigate = useNavigate();

    const { t } = useTranslation();

    const auth = useContext(AuthContext);

    const { filterValues } = useFilter();
    const filterKey = 'accountSaldoTabFilter'; // Set the filterKey for this route
    const filterData = filterValues[filterKey] || '';

    const [stateTab, setStateTab] = useState([]);
    const [filterTab, setFilterTab] = useState("");
    const [loading, setLoading] = useState(true);
    const [openSaldo, setOpenSaldo] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    const headers = {'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const accId = selAcc.accId;
    const accCode = selAcc.acc;
    const accName = selAcc.accName;

    const getTabData = async (filter = '') => {

        setLoading(true)
        let filters = [];
        if (filter!=='' && filter!== '{}') filters = filter
        //console.log(dataTab.toString(),'dataTab')
        if (filterData && filters.length === 0) {
            filters = [...filters, ...filterData];
        }

        dataMonitorAccTab.query['filters'] = filters;

        dataMonitorAccTab.query['filters'].push( { "column": "acc", "value": accCode, "operator": "=", "dataType": "text" }) //Obyazatelnoe pole
        dataMonitorAccTab.query.source = "GET_ACCOUNT_SALDO_BY_EMP_ID_UI_V("+auth.empId+")"

        const { data } = await axios.post(QUERY_URL,
            ( dataMonitorAccTab ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });

        setStateTab(data);
        setLoading(false);

        setFilterTab( dataMonitorAccFilter );

    };

    useEffect(() => {
        getTabData();
    }, [accCode]);

    const handleFormExit = () => {
        navigate(-1)
    }

    const showSaldo = () => { setOpenSaldo(true) }
    const closeSaldo = () => { setOpenSaldo(false) }
    const closeSavedSaldo = () => {
        setOpenSaldo(false)
        getTabData()
    }

    const handleSaldoAdd = (event) => {
        showSaldo()
    }

    const handleSaldoDel = async (values) => {

        if (selectedRowKeys.length === 0) {
            messageApi.open({
                type: 'warning',
                content: 'Каторни танланг',
            });

            return false;
        }

        let data = stateTab.find(row => row.id === selectedRow.id),
            iddoc = data.id;

        try {
            const { data } = await axios.get(DELETE_URL,
                {
                    params: {
                        id: iddoc,
                    },
                    headers: headers,
                    //crossDomain: true,
                    withCredentials: false
                })
            messageApi.open({
                type: 'success',
                content: 'Муввафакият',
                duration: 2
            });
            getTabData()

        } catch (err) {
            messageApi.open({
                type: 'error',
                content: err.response?.data?.message,
                duration: 8
            });
            //message.error(err.response?.data);
        }
    }

    const tableHeader = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>
                <Button
                    onClick={handleSaldoAdd}
                    type="primary"
                    icon={<FileAddOutlined style={{fontSize:'16px'}}/>}
                >
                    Колдик киритиш
                </Button>

                {openSaldo &&
                    <Modal
                        title="Хисоб ракамга колдик киритиш"
                        width={600}
                        onCancel={closeSaldo}
                        open={openSaldo}
                        footer={[]}
                    >
                        <AccountSaldoAdd closeSavedSaldo={closeSavedSaldo} accCode={accCode} accId={accId}/>

                    </Modal>
                }

                <Button
                    onClick={handleSaldoDel}
                    type="primary"
                    icon={<DeleteOutlined style={{fontSize:'16px'}}/>}
                >
                    Учириш
                </Button>

                <FilterModal filterKey={filterKey} filterTab={filterTab} onSubmit={getTabData}/>
            </div>
        );
    }

    const pagination = {
        total: stateTab.length,
        showTotal: (total, range) => (
            <>
                <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", width: '100%', justifyContent: "space-between"}}>

                    {/*<Button type="primary" htmlType="submit" style={{marginRight:'10px'}} onClick={handleFormExit}>*/}
                    {/*<LeftCircleFilled onClick={handleFormExit} style={{ fontSize: '34px', color: '#08c', marginRight:'10px', }}/>*/}
                    {/*</Button>*/}
                    {/*<h3><Button shape="circle" icon={<LeftOutlined />}  style={{fontSize:'14px',marginRight:"10px"}} onClick={handleFormExit}/>Хисоб ракам очиш</h3>*/}
                    <span>
                        <strong>{total}</strong> катордан {range[0]}-{range[1]} гача
                    </span>
                </div>
            </>
        ),
        pageSize: 200,
        size: 'small',
        defaultCurrent: 1,
        position: ['topRight'],
        hideOnSinglePage:false,
    };

    const columnProps = {
        width: 100,
        align: 'right',
        render: (value) => parseFloat(value).toLocaleString("en-EN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    };

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
        setSelectedRowKeys([record.acc+''+rowIndex]);
        setSelectedRow(record);
    };

    const onRow = (record, rowIndex) => {
        return {
            onClick: () =>{ onSelect(record, rowIndex) }
        }
    };

    return (

        <Layout style={{height:"100%", overflow:"hidden"}}>
            {contextHolder}
            <div style={{position: 'relative', height: '100%',  minHeight:'80vh'}}>

                <Table dataSource={stateTab}
                       rowSelection={rowSelection}
                       className="table-striped-rows"
                       size='small'
                       rowKey={(record, index) => record.acc +''+ index}
                       title={tableHeader}
                       loading={loading}
                       scroll={{x: 300, y:'calc(100vh - 345px)' }}
                       tableLayout="auto"
                       pagination={pagination}
                       onRow={onRow}

                >
                    <Column title="ИД" dataIndex="id" key="id" width={80}></Column>
                    <Column title="Филиал" dataIndex="filial" key="filial" width={80}></Column>
                    <Column title="Хисоб ракам" dataIndex="acc" key="acc"></Column>
                    <Column title="Хисоб ракам номи" dataIndex="name" key="name" ellipsis={true}></Column>
                    <Column title="Сана" dataIndex="oper_day" key="oper_day"></Column>
                    <Column title="Кун бошига колдик" dataIndex="saldo_in" key="saldo_in" {...columnProps}></Column>
                    <Column title="Дебет" dataIndex="debet" key="debet" {...columnProps}></Column>
                    <Column title="Кредит" dataIndex="credit" key="credit" {...columnProps}></Column>
                    <Column title="Кун охирига колдик" dataIndex="saldo_out" key="saldo_out" {...columnProps}></Column>
                    {/*<Column title="Холати" dataIndex="state_name" key="state_name"></Column>*/}
                </Table>

                {selectedRow && (

                    <Descriptions bordered
                                  size='small'
                                  style={{ position: 'absolute', left: 0, bottom: 0, width: '100%' }}
                                  column={{
                                      xxl: 2,
                                      xl: 3,
                                      lg: 3
                                  }}
                    >

                        <Descriptions.Item label={t('createdBy')}>{selectedRow.created_by + ' - '+selectedRow.created_by_name||''}</Descriptions.Item>
                        <Descriptions.Item label={t('createdDate')}>{selectedRow.created_date||''}</Descriptions.Item>

                        <Descriptions.Item label={t('modifiedBy')}>{selectedRow.modified_by + ' - '+selectedRow.modified_by_name||''}</Descriptions.Item>
                        <Descriptions.Item label={t('modifiedDate')}>{selectedRow.modified_date||''}</Descriptions.Item>

                    </Descriptions>

                )}

            </div>
        </Layout>

    );

}

export default AccountSaldoTab