import {
    Alert,
    Button,
    Descriptions,
    Divider, Drawer,
    Dropdown,
    Form,
    Input,
    Layout,
    message,
    Modal, Pagination,
    Popconfirm, Space,
    Table, Tag
} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import {useNavigate} from "react-router-dom";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import {columns, dataFilter, dataTab} from "./PaydocData";
import FilterModal from "../../components/FilterModalBM";
import {ArrowUpOutlined, DownOutlined, FileAddOutlined, FileExcelOutlined} from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import {fetchDocAction} from "../../api/apiDocAction";
import exportToExcel from "../../components/ExportToExcel";
import {useFilter} from "../../context/FilterContext";
import exportAllToExcel from "../../components/ExportAllToExcel";
import PaydocPrint from "./PaydocPrint";
import PaydocPoints from "./PaydocPoints";
const {Column} = Table;

const QUERY_URL = '/api/public/query';

const PaydocOldTab = ({setTitleNav}) => {

    let navigate = useNavigate();

    const { t } = useTranslation();

    const auth = useContext(AuthContext);

    const { filterValues } = useFilter();
    const filterKey = 'paydocOldTabFilter'; // Set the filterKey for this route
    const filterData = filterValues[filterKey] || '';

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [stateTab, setStateTab] = useState([]);
    const [filterTab, setFilterTab] = useState("");
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);

    const [openPoints, setOpenPoints] = useState(false);
    const [expPoints, setExpPoints] = useState(false);
    const showDrawerPoints = () => {
        setExpPoints(selectedRow.points_json)
        setOpenPoints(true);
    };
    const onClosePoints = () => {
        setOpenPoints(false);
    };

    useEffect(() => {
        setTitleNav(t('paydocOldWork'));
    }, []);

    const headers = {'Content-Type':'application/json;charset=utf-8',
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

        dataTab.query.source = "GET_PAYDOCS_BY_EMP_ID_UI_V("+auth.empId+",'old')"

        const queryParams = new URLSearchParams({
            linesPerPage: pageSize,
            pageNum: currentPage,
        });

        const { data } = await axios.post(`/api/public/query/paging?${queryParams.toString()}`,
            ( dataTab ),
            {
                headers: headers,
                withCredentials: false
            });

        setLoading(false);
        setStateTab(data.data);
        setTotalRows(data.totalRowCount);

        setSelectedRow(null)
        setSelectedRowKeys([])

        setFilterTab( dataFilter );

    };

    useEffect(() => {
        getTabData();
    }, [currentPage, pageSize]);

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };
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

    const expandedRowRender = (record) => {

        const columnsExp = [
            {
                title: 'Модда',
                dataIndex: 'expense',
                key: 'expense',
                width: 100
            },
            {
                title: 'Сумма',
                dataIndex: 'sumpay',
                key: 'sumpay',
                render: (text) => parseFloat(text).toLocaleString("en-EN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            },
        ];

        const dataObj = record


        console.log(dataObj.points_json.value,'dataObj.points_json.value')
        const jsonString = dataObj.points_json.value;
        const jsonArray = JSON.parse(jsonString);
        console.log(jsonArray)

        const dataExp = []

        dataExp.push({
            key: "sender",
            type: (<Tag icon={<ArrowUpOutlined />} color="volcano" style={{width:100}} bordered="false">
                ТУЛОВЧИ
            </Tag>),
            //type: "Туловчи",
            expense: jsonArray.expense,
            sumpay: jsonArray.sumpay,
        });

        return <Table columns={columnsExp} dataSource={jsonArray} pagination={false} />;

    };

    const tableHeader = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>

                <Button type="primary" onClick={showDrawerPoints}>
                    Харажатлар
                </Button>

                <Drawer
                    title="Харажатлар"
                    width={720}
                    onClose={onClosePoints}
                    open={openPoints}
                    styles={{
                        body: {
                            paddingBottom: 80,
                        },
                    }}
                    /*extra={
                        <Space>
                            <Button onClick={onClosePoints}>Cancel</Button>
                            <Button onClick={onClosePoints} type="primary">
                                Submit
                            </Button>
                        </Space>
                    }*/
                >
                    <PaydocPoints dataPoints={expPoints}/>
                </Drawer>

                <PaydocPrint dataPaydoc={selectedRow}></PaydocPrint>

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
                       columns={columns(t)}
                       dataSource={stateTab}
                       className='table-striped-rows'
                       rowKey="id"
                       loading={loading}
                       size='small'
                       scroll={{x: 300, y:'calc(100vh - 500px)'}}
                       tableLayout="auto"
                       title={tableHeader}
                       pagination={false}
                       defaultSelectedRowKeys={defaultSelectedRowKeys}
                       onRow={onRow}
                       expandable={{
                           expandedRowRender,
                           defaultExpandedRowKeys: ['0'],
                           columnWidth: 10,
                           expandRowByClick: true,
                           rowExpandable: (record) => record.points_json !== null,
                           //columnTitle: 'asd'
                       }}
                />


                {selectedRow && (

                    <Descriptions bordered
                                  size='small'
                                  style={{ position: 'absolute', left: 0, bottom: 0, width: '100%' }}
                                  column={{
                                      xxl: 5,
                                      xl: 3,
                                      lg: 3
                                  }}
                    >

                        <Descriptions.Item label={t('payerName')}>{selectedRow.cl_name||''}</Descriptions.Item>
                        <Descriptions.Item label={t('bankId')}>{selectedRow.bank_doc_id||''}</Descriptions.Item>
                        <Descriptions.Item label={t('contract_id')}>{selectedRow.contract_id}</Descriptions.Item>
                        <Descriptions.Item label={t('createdDate')}>{selectedRow.created_date||''}</Descriptions.Item>
                        <Descriptions.Item label={t('createdBy')}>{selectedRow.created_by + ' - '+selectedRow.created_by_name||''}</Descriptions.Item>

                        <Descriptions.Item label={t('recipName')}>{selectedRow.co_name||''}</Descriptions.Item>
                        <Descriptions.Item label={t('bankSendFlag')}>{selectedRow.bank_send_flag_name||''}</Descriptions.Item>

                        <Descriptions.Item label={t('cash_app_id')}>{selectedRow.cash_app_id}</Descriptions.Item>
                        <Descriptions.Item label={t('modifiedDate')}>{selectedRow.modified_date||''}</Descriptions.Item>
                        <Descriptions.Item label={t('modifiedBy')}>{selectedRow.modified_by + ' - '+selectedRow.modified_by_name||''}</Descriptions.Item>

                        <Descriptions.Item span={3} label={t('payDetail')}>{selectedRow.purpose||''}</Descriptions.Item>
                        <Descriptions.Item span={2} label={t('filial')}>{selectedRow.filial + ' - '+selectedRow.filial_name||''}</Descriptions.Item>
                    </Descriptions>

                )}

            </div>
        </Layout>

    );

}

export default PaydocOldTab