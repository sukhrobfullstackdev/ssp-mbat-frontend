import {Button, Descriptions, Layout, message, Pagination, Space, Table} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate} from "react-router-dom";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import FilterModal from "../../components/FilterModalBM";
import {dataSmetaExecuteFilter, dataSmetaExecuteTab} from "./AccountStateData";
import {dataAccTab} from "../Account/AccountData";
import exportToExcel from "../../components/ExportToExcel";
import {FileExcelOutlined} from "@ant-design/icons";
import {useFilter} from "../../context/FilterContext";

const {Column, ColumnGroup} = Table;

const QUERY_URL = '/api/public/query';


const SmetaExecuteTab = ({setTitleNav}) => {

    let navigate = useNavigate();

    const auth = useContext(AuthContext);

    const { filterValues } = useFilter();
    const filterKey = 'smetaExecuteTabFilter'; // Set the filterKey for this route
    const filterData = filterValues[filterKey] || '';

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [stateTab, setStateTab] = useState([]);
    const [filterTab, setFilterTab] = useState("");
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();
    const [grpData, setGrpData] = useState([]);

    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        setTitleNav('Харажатлар буйича маълумот');
    }, []);

    const headers = {
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    let groupedData;

    const getTabData = async (filter = '') => {

        let filters = [];
        if (filter!=='' && filter!== '{}') filters = filter

        if (filterData && filters.length === 0) {
            filters = [...filters, ...filterData];
        }

        dataSmetaExecuteTab.query['filters'] = filters;

        const queryParams = new URLSearchParams({
            linesPerPage: pageSize,
            pageNum: currentPage,
        });

        dataSmetaExecuteTab.query.source = "GET_SMETA_EXECUTE_BY_EXPENSE_MONTH_HORIZONTAL_BY_EMP_ID("+auth.empId+")"
        setLoading(true);
        const { data } = await axios.post(`/api/public/query/paging?${queryParams.toString()}`,
            ( dataSmetaExecuteTab ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        setLoading(false);
        setStateTab(data.data);

        setTotalRows(data.totalRowCount);
/*

        //Group acc to get rowspan
        const groupedRows = new Map();

// Группируйте строки на основе определенного значения столбца
        data.forEach(row => {
            const columnValue = row.acc; // Замените `columnName` на фактическое имя столбца

            if (groupedRows.has(columnValue)) {
                groupedRows.get(columnValue).push(row);
            } else {
                groupedRows.set(columnValue, [row]);
            }
        });

// Преобразуйте карту группированных строк в массив
        groupedData = Array.from(groupedRows.values());
        //setGrpData(groupedData)
        //console.log(groupedData,'gglop')
        //
*/

        setFilterTab( dataSmetaExecuteFilter );

    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    useEffect(() => {
        getTabData();
    }, [currentPage, pageSize]);

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
        setSelectedRowKeys([record.acc+''+rowIndex]);
        setSelectedRow(record);
    };

    const onRow = (record, rowIndex) => {
        return {
            onClick: () =>{ onSelect(record, rowIndex) }
        }
    };

    const tableHeader = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>

                <Button type="primary" shape="circle" onClick={() => exportToExcel(stateTab)}>
                    <FileExcelOutlined/>
                </Button>

                <FilterModal filterKey={filterKey} filterTab={filterTab} onSubmit={getTabData}/>

            </div>

        );
    }

    const columnProps = {
        width: 100,
        align: 'right',
        render: (value) => parseFloat(value).toLocaleString("en-EN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    };

    const columnPropsBold = {
        width: 100,
        align: 'right',
        render: (value) => <b>{parseFloat(value).toLocaleString("en-EN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>,
    };

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
                       dataSource={stateTab}
                       className='table-striped-rows table-th-nobreak-word'
                       rowKey={(record, index) => record.acc +''+ index}
                       loading={loading}
                       size='small'
                       bordered='bordered'
                       scroll={{x: 300, y:'calc(100vh - 350px)'}}
                       tableLayout="auto"
                       title={tableHeader}
                       pagination={false}
                    //defaultSelectedRowKeys={defaultSelectedRowKeys}
                       onRow={onRow}
                >
                    <Column title="Хисоб ракам" dataIndex="acc" key="acc" width={100} fixed="left" sorter={ (a, b) => a.acc.length - b.acc.length} defaultSortOrder='ascend'
                            render={(text) => <b>{text}</b>}
                            /*render={(text,record,index) => ({
                                children: text,
                                props: {
                                    rowSpan: index === 0 ? grpData[index].length : 0,
                                }
                            })
                            }*/
                    ></Column>
{/*                    <Column title="Х/Р номи" dataIndex="acc_name" key="acc_name" width={100}></Column>*/}
                    <Column title="Харажат моддаси" dataIndex="expense" key="expense" width={100} fixed="left" sorter={ (a, b) => a.acc - b.acc}
                            render={(text) => <b>{text}</b>}

                    ></Column>
                    {/*<Column title="Харажат моддаси номи" dataIndex="expense_name" key="expense_name" width={100}></Column>*/}

                    <ColumnGroup title="Йил"  key="1m" >
                        <Column title="Смета" dataIndex="year_smeta" key="year_smeta" {...columnPropsBold}
                        ></Column>

                        <Column title="Тулов хужжат" dataIndex="year_sumpay" key="year_sumpay" {...columnPropsBold}
                        ></Column>

                        <Column title="Шартнома" dataIndex="year_contract" key="year_contract" {...columnPropsBold}
                        ></Column>

                        <Column title="Суровнома" dataIndex="year_cash_app" key="year_cash_app" {...columnPropsBold}
                        ></Column>


                    </ColumnGroup>

                    <ColumnGroup title="1 квартал"  key="1q" className="quart1-color">
                        <Column title="Смета" dataIndex="smeta_q1" key="smeta_q1" {...columnPropsBold}></Column>
                        <Column title="Тулов хужжат" dataIndex="sumpay_q1" key="sumpay_q1" {...columnPropsBold}></Column>
                        <Column title="Шартнома" dataIndex="contract_q1" key="contract_q1" {...columnPropsBold}></Column>
                        <Column title="Суровнома" dataIndex="cash_app_q1" key="cash_app_q1" {...columnPropsBold}></Column>
                    </ColumnGroup>

                    <ColumnGroup title="Янв"  key="1m"  className="quart1-color">
                        <Column title="Смета" dataIndex="smeta_m1" key="smeta_m1" {...columnProps}></Column>
                        <Column title="Тулов хужжат" dataIndex="sumpay_m1" key="sumpay_m1" {...columnProps}></Column>
                        <Column title="Шартнома" dataIndex="contract_m1" key="contract_m1" {...columnProps}></Column>
                        <Column title="Суровнома" dataIndex="cash_app_m1" key="cash_app_m1" {...columnProps}></Column>
                    </ColumnGroup>

                    <ColumnGroup title="Фев"  key="2m"  className="quart1-color">
                        <Column title="Смета" dataIndex="smeta_m2" key="smeta_m2" {...columnProps}></Column>
                        <Column title="Тулов хужжат" dataIndex="sumpay_m2" key="sumpay_m2" {...columnProps}></Column>
                        <Column title="Шартнома" dataIndex="contract_m2" key="contract_m2" {...columnProps}></Column>
                        <Column title="Суровнома" dataIndex="cash_app_m2" key="cash_app_m2" {...columnProps}></Column>
                    </ColumnGroup>

                    <ColumnGroup title="Мар"  key="3m"  className="quart1-color">
                        <Column title="Смета" dataIndex="smeta_m3" key="smeta_m3" {...columnProps}></Column>
                        <Column title="Тулов хужжат" dataIndex="sumpay_m3" key="sumpay_m3" {...columnProps}></Column>
                        <Column title="Шартнома" dataIndex="contract_m3" key="contract_m3" {...columnProps}></Column>
                        <Column title="Суровнома" dataIndex="cash_app_m3" key="cash_app_m3" {...columnProps}></Column>
                    </ColumnGroup>

                    <ColumnGroup title="2 квартал"  key="2q" className="quart2-color">
                        <Column title="Смета" dataIndex="smeta_q2" key="smeta_q2" {...columnPropsBold}></Column>
                        <Column title="Тулов хужжат" dataIndex="sumpay_q2" key="sumpay_q2" {...columnPropsBold}></Column>
                        <Column title="Шартнома" dataIndex="contract_q2" key="contract_q2" {...columnPropsBold}></Column>
                        <Column title="Суровнома" dataIndex="cash_app_q2" key="cash_app_q2" {...columnPropsBold}></Column>
                    </ColumnGroup>

                    <ColumnGroup title="Апр"  key="4m" className="quart2-color">
                        <Column title="Смета" dataIndex="smeta_m4" key="smeta_m4" {...columnProps}></Column>
                        <Column title="Тулов хужжат" dataIndex="sumpay_m4" key="sumpay_m4" {...columnProps}></Column>
                        <Column title="Шартнома" dataIndex="contract_m4" key="contract_m4" {...columnProps}></Column>
                        <Column title="Суровнома" dataIndex="cash_app_m4" key="cash_app_m4" {...columnProps}></Column>
                    </ColumnGroup>

                    <ColumnGroup title="Май"  key="5m" className="quart2-color">
                        <Column title="Смета" dataIndex="smeta_m5" key="smeta_m4" {...columnProps}></Column>
                        <Column title="Тулов хужжат" dataIndex="sumpay_m5" key="sumpay_m5" {...columnProps}></Column>
                        <Column title="Шартнома" dataIndex="contract_m5" key="contract_m5" {...columnProps}></Column>
                        <Column title="Суровнома" dataIndex="cash_app_m5" key="cash_app_m5" {...columnProps}></Column>
                    </ColumnGroup>

                    <ColumnGroup title="Июн"  key="6m" className="quart2-color">
                        <Column title="Смета" dataIndex="smeta_m6" key="smeta_m6" {...columnProps}></Column>
                        <Column title="Тулов хужжат" dataIndex="sumpay_m6" key="sumpay_m6" {...columnProps}></Column>
                        <Column title="Шартнома" dataIndex="contract_m6" key="contract_m6" {...columnProps}></Column>
                        <Column title="Суровнома" dataIndex="cash_app_m6" key="cash_app_m6" {...columnProps}></Column>
                    </ColumnGroup>

                    <ColumnGroup title="3 квартал"  key="3q" className="quart3-color">
                        <Column title="Смета" dataIndex="smeta_q3" key="smeta_q3" {...columnPropsBold}></Column>
                        <Column title="Тулов хужжат" dataIndex="sumpay_q3" key="sumpay_q3" {...columnPropsBold}></Column>
                        <Column title="Шартнома" dataIndex="contract_q3" key="contract_q3" {...columnPropsBold}></Column>
                        <Column title="Суровнома" dataIndex="cash_app_q3" key="cash_app_q3" {...columnPropsBold}></Column>
                    </ColumnGroup>

                    <ColumnGroup title="Июл"  key="7m" className="quart3-color">
                        <Column title="Смета" dataIndex="smeta_m7" key="smeta_m7" {...columnProps}></Column>
                        <Column title="Тулов хужжат" dataIndex="sumpay_m7" key="sumpay_m7" {...columnProps}></Column>
                        <Column title="Шартнома" dataIndex="contract_m7" key="contract_m7" {...columnProps}></Column>
                        <Column title="Суровнома" dataIndex="cash_app_m7" key="cash_app_m7" {...columnProps}></Column>
                    </ColumnGroup>

                    <ColumnGroup title="Авг"  key="8m" className="quart3-color">
                        <Column title="Смета" dataIndex="smeta_m8" key="smeta_m8" {...columnProps}></Column>
                        <Column title="Тулов хужжат" dataIndex="sumpay_m8" key="sumpay_m8" {...columnProps}></Column>
                        <Column title="Шартнома" dataIndex="contract_m8" key="contract_m8" {...columnProps}></Column>
                        <Column title="Суровнома" dataIndex="cash_app_m8" key="cash_app_m8" {...columnProps}></Column>
                    </ColumnGroup>

                    <ColumnGroup title="Сен"  key="9m" className="quart3-color">
                        <Column title="Смета" dataIndex="smeta_m9" key="smeta_m9" {...columnProps}></Column>
                        <Column title="Тулов хужжат" dataIndex="sumpay_m9" key="sumpay_m9" {...columnProps}></Column>
                        <Column title="Шартнома" dataIndex="contract_m9" key="contract_m9" {...columnProps}></Column>
                        <Column title="Суровнома" dataIndex="cash_app_m9" key="cash_app_m9" {...columnProps}></Column>
                    </ColumnGroup>

                    <ColumnGroup title="4 квартал"  key="4q" className="quart4-color">
                        <Column title="Смета" dataIndex="smeta_q4" key="smeta_q4" {...columnPropsBold}></Column>
                        <Column title="Тулов хужжат" dataIndex="sumpay_q4" key="sumpay_q4" {...columnPropsBold}></Column>
                        <Column title="Шартнома" dataIndex="contract_q4" key="contract_q4" {...columnPropsBold}></Column>
                        <Column title="Суровнома" dataIndex="cash_app_q4" key="cash_app_q4" {...columnPropsBold}></Column>
                    </ColumnGroup>

                    <ColumnGroup title="Окт"  key="10m" className="quart4-color">
                        <Column title="Смета" dataIndex="smeta_m10" key="smeta_m10" {...columnProps}></Column>
                        <Column title="Тулов хужжат" dataIndex="sumpay_m10" key="sumpay_m10" {...columnProps}></Column>
                        <Column title="Шартнома" dataIndex="contractm10" key="contractm10" {...columnProps}></Column>
                        <Column title="Суровнома" dataIndex="cash_appm10" key="cash_appm10" {...columnProps}></Column>
                    </ColumnGroup>

                    <ColumnGroup title="Нов"  key="11m" className="quart4-color">
                        <Column title="Смета" dataIndex="smeta_m11" key="smeta_m11" {...columnProps}></Column>
                        <Column title="Тулов хужжат" dataIndex="sumpay_m11" key="sumpay_m11" {...columnProps}></Column>
                        <Column title="Шартнома" dataIndex="contractm11" key="contractm11" {...columnProps}></Column>
                        <Column title="Суровнома" dataIndex="cash_appm11" key="cash_appm11" {...columnProps}></Column>
                    </ColumnGroup>

                    <ColumnGroup title="Дек"  key="12m"  className="quart4-color">
                        <Column title="Смета" dataIndex="smeta_m12" key="smeta_m12" {...columnProps}></Column>
                        <Column title="Тулов хужжат" dataIndex="sumpay_m12" key="sumpay_m12" {...columnProps}></Column>
                        <Column title="Шартнома" dataIndex="contractm12" key="contractm12" {...columnProps}></Column>
                        <Column title="Суровнома" dataIndex="cash_appm12" key="cash_appm12" {...columnProps}></Column>
                    </ColumnGroup>

                </Table>

                {selectedRow && (

                    <Descriptions bordered
                                  size='small'
                                  style={{ position: 'absolute', left: 0, bottom: 0, width: '100%' }}
                                  column={{
                                      xxl: 2,
                                      xl: 2,
                                      lg: 2
                                  }}
                    >

                        <Descriptions.Item label="Харажат моддаси номи">{selectedRow.expense_name||''}</Descriptions.Item>
                        <Descriptions.Item label="Хисоб ракам номи">{selectedRow.acc_name||''}</Descriptions.Item>

                    </Descriptions>

                )}

            </div>
        </Layout>

    );

}

export default SmetaExecuteTab