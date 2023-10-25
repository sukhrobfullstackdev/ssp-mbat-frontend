import {
    Alert, Badge,
    Button,
    Descriptions,
    Divider, Dropdown,
    Form,
    Input,
    Layout,
    message,
    Modal, notification,
    Pagination,
    Popconfirm,
    Space,
    Table,
    Tooltip
} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import {Link, useNavigate} from "react-router-dom";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import {dataFilter, dataTab} from "./CashAppData";
import FilterModal from "../../components/FilterModalBM";
import {DownOutlined, EditOutlined, EyeOutlined, FileAddOutlined, FileExcelOutlined} from "@ant-design/icons";
import {fetchDocAction} from "../../api/apiDocAction";
import exportToExcel from "../../components/ExportToExcel";
import {useFilter} from "../../context/FilterContext";
import exportAllToExcel from "../../components/ExportAllToExcel";
import {getClone} from "../../api/clone";
const {Column} = Table;


//import {getDataBooks} from "../../services/index"

const QUERY_URL = '/api/public/query';
const EXECUTE_URL = '/cash_app/execute';

const CashAppTab = ({setTitleNav}) => {

    let navigate = useNavigate();

    const auth = useContext(AuthContext);

    const { filterValues } = useFilter();
    const filterKey = 'cashAppTabFilter'; // Set the filterKey for this route
    const filterData = filterValues[filterKey] || '';

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [stateTab, setStateTab] = useState([]);
    const [filterTab, setFilterTab] = useState("");
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotify] = notification.useNotification();

    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        setTitleNav('Суровномалар билан ишлаш');
    }, []);

    const [itemsAction, setItemsAction] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            const tt = await fetchDocAction("CASH_APP", auth)
            console.log(tt,'tttete')
            setItemsAction(tt);
        }

        fetchData();

    }, []);

    const headers = {
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const getTabData = async (filter = '') => {

        //console.log(filter,' FILTERmmm')

        let filters = [];
        if (filter!=='' && filter!== '{}') filters = filter
        //console.log(dataTab.toString(),'dataTab')

        if (filterData && filters.length === 0) {
            filters = [...filters, ...filterData];
        }

        dataTab.query['filters'] = filters;

        dataTab.query.source = "GET_CASH_APP_BY_EMP_ID_UI_V("+auth.empId+")"

        const queryParams = new URLSearchParams({
            linesPerPage: pageSize,
            pageNum: currentPage,
        });

        const { data } = await axios.post(`/api/public/query/paging?${queryParams.toString()}`,
            ( dataTab ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        setLoading(false);
        //setStateTab(data);
        console.log(data, 'nndata')
        setStateTab(data.data);
        setTotalRows(data.totalRowCount);
        setSelectedRow(null)
        setSelectedRowKeys([])

        setFilterTab( dataFilter );

    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    useEffect(() => {
        getTabData();
    }, [currentPage, pageSize]);

    const handleAdd = () => {
        navigate("../cashAppAdd");
    };

    const handleApprove = (iddoc) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        console.log('iddoc changed: ', iddoc);
        if (selectedRowKeys.length === 0) {
            messageApi.open({
                type: 'warning',
                content: 'Каторни танланг',
            });

            return false;
        }
        messageApi.open({
            type: 'success',
            content: 'Муввафакият',
        });
    }

    const handleAction = async (values) => {
        console.log(values)
        if (selectedRowKeys.length === 0) {
            messageApi.open({
                type: 'warning',
                content: 'Каторни танланг',
            });

            return false;
        }
        let data = stateTab.find(row => row.id === selectedRowKeys[0]),
            iddoc = data.id,
            action = values.key;

        try {
            const { data } = await axios.get(EXECUTE_URL,
                {
                    params: {
                        id: iddoc,
                        action: action
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

    const makeClone = async () => {
        if (selectedRowKeys.length === 0) {
            messageApi.open({
                type: 'warning',
                content: 'Каторни танланг',
            });

            return false;
        }

        const docId = selectedRowKeys[0]
        //console.log(docId,'docId')
        const cloneDoc = await getClone( docId, 'CashAppClonning', auth )
        const statusCode = cloneDoc?.response?.status || 500
        //console.log(statusCode,'statusCode')
        //console.log(cloneDoc,'cloneDoc')
        if (statusCode  === 200) {
            messageApi.open({
                type: 'success',
                content: 'Муввафакият',
                duration: 2
            });
            getTabData()
        }
        else
            api.warning({
                message: 'Хатолик мавжуд',
                description: cloneDoc?.response?.data?.message    ,
                placement: 'top',
                duration: 5
            });
    }

    const onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
    };

    const pagination = {
        total: stateTab.length,
        showTotal: (total, range) => (
            <span>
                <strong>{total}</strong> катордан {range[0]}-{range[1]} гача
            </span>
        ),
        defaultPageSize: '20',
        onShowSizeChange:onShowSizeChange,
        size: 'small',
        defaultCurrent: 1,
        position: ['topRight'],
        hideOnSinglePage:false,
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
        setSelectedRowKeys([record.id]);
        setSelectedRow(record);
    };

    const onRow = (record, rowIndex) => {
        return {
            onClick: () =>{ onSelect(record, rowIndex) }
        }
    };

    const defaultSelectedRowKeys = [0]

    const handlePageSizeChange = (current, size) => {
        // Handle page size change
    };

    const tableHeader = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>
                <Button
                    onClick={handleAdd}
                    type="primary"
                    icon={<FileAddOutlined style={{fontSize:'16px'}}/>}
                >
                    Янги хужжат
                </Button>

                <Dropdown
                    menu={{
                        items: itemsAction,
                        onClick: handleAction,
                    }}
                >
                    <Button type='primary'>
                        <Space>
                            Амаллар
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>

                <Button type="primary" onClick={() => makeClone()}>
                    Клонлаштириш
                </Button>

                <Button type="primary" shape="circle" onClick={() => exportAllToExcel(dataTab, auth)}>
                    <FileExcelOutlined/>
                </Button>

                <FilterModal filterKey={filterKey} filterTab={filterTab} onSubmit={getTabData}/>
            </div>
        );
    }

    return (

        <Layout style={{height:"100%", overflow:"hidden"}}>
            {contextHolder}
            {contextHolderNotify}
            <div style={{position: 'relative', height: '100%'}}>

                <Space direction="horizontal" style={{width: '100%', justifyContent: 'right', margin: '16px 0'}}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalRows}
                        onChange={handlePageChange}
                        onShowSizeChange={onShowSizeChange}
                        size='small'
                        defaultCurrent='1'
                        hideOnSinglePage={false}
                        showTotal={(total, range) => (
                            <span>
                                <strong>{total}</strong> катордан {range[0]}-{range[1]} гача
                            </span>
                        )}
                    />
                </Space>

                <Table rowSelection={rowSelection}
                       dataSource={stateTab}
                       className='table-striped-rows'
                       rowKey="id"
                       loading={loading}
                       size='small'
                       scroll={{x: 300, y:'calc(100vh - 400px)'}}
                       tableLayout="auto"
                       title={tableHeader}
                       pagination={false}
                    //defaultSelectedRowKeys={defaultSelectedRowKeys}
                       onRow={onRow}
                >
                    <Column title="ИД" dataIndex="id" key="id" width={50} defaultSortOrder='descend' sorter={(a, b) => a.id - b.id}></Column>
                    <Column title="Молиявий йил" dataIndex="fin_year" key="fin_year" width={100}></Column>
                    <Column title="Филиал" dataIndex="filial" key="filial" width={100}></Column>
                    {/*<Column title="Юкори ИД" dataIndex="parent_id" key="parent_id"></Column>*/}
                    <Column title="Хисоб ракам" dataIndex="acc" key="acc" width={200} defaultSortOrder='descend' sorter={(a, b) => a.acc - b.acc}></Column>
                    {/*<Column title="Хужжат тури" dataIndex="doc_type" key="doc_type"></Column>*/}
                    <Column title="Хужжат раками" dataIndex="doc_numb" key="doc_numb" width={100} defaultSortOrder='descend' sorter={(a, b) => a.doc_numb - b.doc_numb}></Column>
                    <Column title="Хужжат санаси" dataIndex="doc_date" key="doc_date" width={100} defaultSortOrder='descend' sorter={(a, b) => a.doc_date - b.doc_date}></Column>
                    <Column title="Ой" dataIndex="month" key="month" width={50} defaultSortOrder='descend' sorter={(a, b) => a.month - b.month}></Column>
                    <Column title="Умумий сумма" dataIndex="sum_pay" key="sum_pay" width={100} align='right' defaultSortOrder='descend' sorter={(a, b) => a.sum_pay - b.sum_pay}
                            render={(value) => parseFloat(value).toLocaleString("en-EN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                    ></Column>
                    <Column title="Транзит сумма" dataIndex="sum_transit" key="sum_transit" width={100} align='right'
                            render={(value) => parseFloat(value).toLocaleString("en-EN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                    ></Column>
                    <Column title="Холат" dataIndex="state_name" key="state" width={100} defaultSortOrder='descend' sorter={(a, b) => a.state_name - b.state_name}
                            render={(text, record) =>
                                (
                                    <Space size="middle">
                                        {
                                              record.state === 2 ? <Badge status="success" text={text} />
                                            : record.state === 3 ? <Badge status="volcano" text={text} />
                                            : <Badge status="default" text={text} />
                                        }
                                    </Space>
                                )}
                    ></Column>
                    {/*<Column title="Амал" key="action" width={100}
                            render={(_, record) =>
                                stateTab.length >= 1 ? (
                                    <Popconfirm title="Ишончингиз комилми?" onConfirm={() => handleApprove(record.id)}>
                                        <a>Тасдиклаш</a>
                                    </Popconfirm>
                        ) : null}>
                    </Column>*/}
                    <Column title="" key="action" width={100}
                            render={(_, record) => {
                                return (
                                    <Space size="middle">
                                    {record.state === 1 ?
                                        <Tooltip title={"Таҳрирлаш"}>
                                            <Link to={`edit/${record.id}`}>
                                                <Button type="default" shape="circle" icon={<EditOutlined />} />
                                            </Link>
                                        </Tooltip> :
                                        <Tooltip title={"Кўриш"}>
                                            <Link to={`edit/${record.id}`}>
                                                <Button type="default" shape="circle" icon={<EyeOutlined />} />
                                            </Link>
                                        </Tooltip>
                                    }
                                </Space>
                                )
                            }}>
                    </Column>
                </Table>

                {selectedRow && (

                    <Descriptions bordered
                                  size='small'
                                  style={{ position: 'absolute', left: 0, bottom: 0, width: '100%' }}
                                  column={{
                                      xxl: 4,
                                      xl: 3,
                                      lg: 3
                                  }}
                    >

                        <Descriptions.Item label="Олувчи банк коди">{selectedRow.co_mfo||''}</Descriptions.Item>
                        <Descriptions.Item label="Олувчи Х.Р.">{selectedRow.co_acc||''}</Descriptions.Item>
                        <Descriptions.Item label="Яратди">{selectedRow.created_by + ' - '+selectedRow.created_by_name||''}</Descriptions.Item>
                        <Descriptions.Item label="Яратилган сана">{selectedRow.created_date||''}</Descriptions.Item>

                        <Descriptions.Item label="Олувчи ИНН">{selectedRow.co_inn||''}</Descriptions.Item>
                        <Descriptions.Item label="Олувчи номи">{selectedRow.co_name||''}</Descriptions.Item>
                        <Descriptions.Item label="Тахрирлади">{selectedRow.modified_by + ' - '+selectedRow.modified_by_name||''}</Descriptions.Item>
                        <Descriptions.Item label="Тахрирланган сана">{selectedRow.modified_date||''}</Descriptions.Item>

                    </Descriptions>

                )}

            </div>
        </Layout>

    );

}

export default CashAppTab