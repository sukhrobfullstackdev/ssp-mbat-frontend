import {Descriptions, Layout, message, Table} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate} from "react-router-dom";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import FilterModal from "../../components/FilterModalBM";
import {dataSmetaExecuteFilter, dataSmetaExecuteTab} from "./AccountStateData";

const {Column, ColumnGroup} = Table;

const QUERY_URL = '/api/public/query';


const SmetaExecuteTab = ({setTitleNav}) => {

    let navigate = useNavigate();

    const auth = useContext(AuthContext);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [stateTab, setStateTab] = useState([]);
    const [filterTab, setFilterTab] = useState("");
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

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

    const getTabData = async (filter = '') => {

        let filters = [];
        if (filter!=='' && filter!== '{}') filters = filter
        dataSmetaExecuteTab.query['filters'] = filters;

        const { data } = await axios.post(QUERY_URL,
            ( dataSmetaExecuteTab ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        setLoading(false);
        setStateTab(data);

        setFilterTab( dataSmetaExecuteFilter );

    };

    useEffect(() => {
        getTabData();
    }, []);

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

                <FilterModal filterTab={filterTab} onSubmit={getTabData}/>

        );
    }

    const columnProps = {
        width: 200,
        align: 'right',
        render: (value) => parseFloat(value).toLocaleString("en-EN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    };

    return (

        <Layout style={{height:"100%", overflow:"hidden"}}>
            {contextHolder}
            <div style={{position: 'relative', height: '100%'}}>

                <Table rowSelection={rowSelection}
                       dataSource={stateTab}
                       className='table-striped-rows table-th-nobreak-word'
                       rowKey={(record, index) => record.acc +''+ index}
                       loading={loading}
                       size='small'
                       scroll={{x: 300, y:'calc(100vh - 350px)'}}
                       tableLayout="auto"
                       title={tableHeader}
                       pagination={pagination}
                    //defaultSelectedRowKeys={defaultSelectedRowKeys}
                       onRow={onRow}
                >
                    <Column title="Хисоб ракам" dataIndex="acc" key="acc" width={100} fixed="left" sorter={ (a, b) => a.acc.length - b.acc.length} defaultSortOrder='ascend'
                            render={(text) => <b>{text}</b>}
                    ></Column>
{/*                    <Column title="Х/Р номи" dataIndex="acc_name" key="acc_name" width={100}></Column>*/}
                    <Column title="Харажат моддаси" dataIndex="expense" key="expense" width={100} fixed="left" sorter={ (a, b) => a.expense - b.expense} defaultSortOrder='ascend'
                            render={(text) => <b>{text}</b>}
                    ></Column>
                    {/*<Column title="Харажат моддаси номи" dataIndex="expense_name" key="expense_name" width={100}></Column>*/}

                    <ColumnGroup title="Смета"  key="smeta" >

                        <Column title="Сумма" dataIndex="year_smeta" key="year_smeta" width="100" align="right"
                            render={(value) => <b>{parseFloat(value).toLocaleString("en-EN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>}
                        ></Column>

                        <Column title="1кв" dataIndex="smeta_q1" key="smeta_q1" {...columnProps}></Column>
                        <Column title="Янв" dataIndex="smeta_m1" key="smeta_m1" {...columnProps}></Column>
                        <Column title="Фев" dataIndex="smeta_m2" key="smeta_m2" {...columnProps}></Column>
                        <Column title="Мар" dataIndex="smeta_m3" key="smeta_m3" {...columnProps}></Column>
                        <Column title="2кв" dataIndex="smeta_q2" key="smeta_q2" {...columnProps}></Column>
                        <Column title="Апр" dataIndex="smeta_m4" key="smeta_m4" {...columnProps}></Column>
                        <Column title="Май" dataIndex="smeta_m5" key="smeta_m5" {...columnProps}></Column>
                        <Column title="Июн" dataIndex="smeta_m6" key="smeta_m6" {...columnProps}></Column>
                        <Column title="3кв" dataIndex="smeta_q3" key="smeta_q3" {...columnProps}></Column>
                        <Column title="Июл" dataIndex="smeta_m7" key="smeta_m7" {...columnProps}></Column>
                        <Column title="Авг" dataIndex="smeta_m8" key="smeta_m8" {...columnProps}></Column>
                        <Column title="Сен" dataIndex="smeta_m9" key="smeta_m9" {...columnProps}></Column>
                        <Column title="4кв" dataIndex="smeta_q4" key="smeta_q4" {...columnProps}></Column>
                        <Column title="Окт" dataIndex="smeta_m10" key="smeta_m10" {...columnProps}></Column>
                        <Column title="Нов" dataIndex="smeta_m11" key="smeta_m11" {...columnProps}></Column>
                        <Column title="Дек" dataIndex="smeta_m12" key="smeta_m12" {...columnProps}></Column>
                    </ColumnGroup>

                    <ColumnGroup title="Харажат"  key="paydoc">

                        <Column title="Сумма" dataIndex="year_sumpay" key="year_sumpay" width="100" align="right"
                                render={(value) => <b>{parseFloat(value).toLocaleString("en-EN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>}
                        ></Column>

                        <Column title="1кв" dataIndex="sumpay_q1" key="sumpay_q1" {...columnProps}></Column>
                        <Column title="Янв" dataIndex="sumpay_m1" key="sumpay_m1" {...columnProps}></Column>
                        <Column title="Фев" dataIndex="sumpay_m2" key="sumpay_m2" {...columnProps}></Column>
                        <Column title="Мар" dataIndex="sumpay_m3" key="sumpay_m3" {...columnProps}></Column>
                        <Column title="2кв" dataIndex="sumpay_q2" key="sumpay_q2" {...columnProps}></Column>
                        <Column title="Апр" dataIndex="sumpay_m4" key="sumpay_m4" {...columnProps}></Column>
                        <Column title="Май" dataIndex="sumpay_m5" key="sumpay_m5" {...columnProps}></Column>
                        <Column title="Июн" dataIndex="sumpay_m6" key="sumpay_m6" {...columnProps}></Column>
                        <Column title="3кв" dataIndex="sumpay_q3" key="sumpay_q3" {...columnProps}></Column>
                        <Column title="Июл" dataIndex="sumpay_m7" key="sumpay_m7" {...columnProps}></Column>
                        <Column title="Авг" dataIndex="sumpay_m8" key="sumpay_m8" {...columnProps}></Column>
                        <Column title="Сен" dataIndex="sumpay_m9" key="sumpay_m9" {...columnProps}></Column>
                        <Column title="4кв" dataIndex="sumpay_q4" key="sumpay_q4" {...columnProps}></Column>
                        <Column title="Окт" dataIndex="sumpay_m10" key="sumpay_m10" {...columnProps}></Column>
                        <Column title="Нов" dataIndex="sumpay_m11" key="sumpay_m11" {...columnProps}></Column>
                        <Column title="Дек" dataIndex="sumpay_m12" key="sumpay_m12" {...columnProps}></Column>

                    </ColumnGroup>

                    <ColumnGroup title="Шартнома"  key="smeta">

                        <Column title="Сумма" dataIndex="year_contract" key="year_contract" width="100" align="right"
                                render={(value) => <b>{parseFloat(value).toLocaleString("en-EN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>}
                        ></Column>

                        <Column title="1кв" dataIndex="contract_q1" key="contract_q1" {...columnProps}></Column>
                        <Column title="Янв" dataIndex="contract_m1" key="contract_m1" {...columnProps}></Column>
                        <Column title="Фев" dataIndex="contract_m2" key="contract_m2" {...columnProps}></Column>
                        <Column title="Мар" dataIndex="contract_m3" key="contract_m3" {...columnProps}></Column>
                        <Column title="2кв" dataIndex="contract_q2" key="contract_q2" {...columnProps}></Column>
                        <Column title="Апр" dataIndex="contract_m4" key="contract_m4" {...columnProps}></Column>
                        <Column title="Май" dataIndex="contract_m5" key="contract_m5" {...columnProps}></Column>
                        <Column title="Июн" dataIndex="contract_m6" key="contract_m6" {...columnProps}></Column>
                        <Column title="3кв" dataIndex="contract_q3" key="contract_q3" {...columnProps}></Column>
                        <Column title="Июл" dataIndex="contract_m7" key="contract_m7" {...columnProps}></Column>
                        <Column title="Авг" dataIndex="contract_m8" key="contract_m8" {...columnProps}></Column>
                        <Column title="Сен" dataIndex="contract_m9" key="contract_m9" {...columnProps}></Column>
                        <Column title="4кв" dataIndex="contract_q4" key="contract_q4" {...columnProps}></Column>
                        <Column title="Окт" dataIndex="contractm10" key="contractm10" {...columnProps}></Column>
                        <Column title="Нов" dataIndex="contractm11" key="contractm11" {...columnProps}></Column>
                        <Column title="Дек" dataIndex="contractm12" key="contractm12" {...columnProps}></Column>

                    </ColumnGroup>

                    <ColumnGroup title="Суровнома"  key="cash_app">

                        <Column title="Сумма" dataIndex="year_cash_app" key="year_cash_app" width="100" align="right"
                                render={(value) => <b>{parseFloat(value).toLocaleString("en-EN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>}
                        ></Column>

                        <Column title="1кв" dataIndex="cash_app_q1" key="cash_app_q1" {...columnProps}></Column>
                        <Column title="Янв" dataIndex="cash_app_m1" key="cash_app_m1" {...columnProps}></Column>
                        <Column title="Фев" dataIndex="cash_app_m2" key="cash_app_m2" {...columnProps}></Column>
                        <Column title="Мар" dataIndex="cash_app_m3" key="cash_app_m3" {...columnProps}></Column>
                        <Column title="2кв" dataIndex="cash_app_q2" key="cash_app_q2" {...columnProps}></Column>
                        <Column title="Апр" dataIndex="cash_app_m4" key="cash_app_m4" {...columnProps}></Column>
                        <Column title="Май" dataIndex="cash_app_m5" key="cash_app_m5" {...columnProps}></Column>
                        <Column title="Июн" dataIndex="cash_app_m6" key="cash_app_m6" {...columnProps}></Column>
                        <Column title="3кв" dataIndex="cash_app_q3" key="cash_app_q3" {...columnProps}></Column>
                        <Column title="Июл" dataIndex="cash_app_m7" key="cash_app_m7" {...columnProps}></Column>
                        <Column title="Авг" dataIndex="cash_app_m8" key="cash_app_m8" {...columnProps}></Column>
                        <Column title="Сен" dataIndex="cash_app_m9" key="cash_app_m9" {...columnProps}></Column>
                        <Column title="4кв" dataIndex="cash_app_q4" key="cash_app_q4" {...columnProps}></Column>
                        <Column title="Окт" dataIndex="cash_appm10" key="cash_appm10" {...columnProps}></Column>
                        <Column title="Нов" dataIndex="cash_appm11" key="cash_appm11" {...columnProps}></Column>
                        <Column title="Дек" dataIndex="cash_appm12" key="cash_appm12" {...columnProps}></Column>

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