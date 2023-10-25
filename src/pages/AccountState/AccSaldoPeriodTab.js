import {Button, DatePicker, Descriptions, Drawer, Layout, message, Modal, Space, Table, Tag} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import "../../custombm.css";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import { dataAccSaldoPeriodFilter, dataAccSaldoPeriodTab } from "./AccountStateData";
import FilterModal from "../../components/FilterModalBM";
import dayjs from "dayjs";
import 'dayjs/locale/uz';

import {useTranslation} from "react-i18next";
import {sortCompareString} from "../../libs/formbm";
import exportToExcel from "../../components/ExportToExcel";
import {FileExcelOutlined} from "@ant-design/icons";
import {useFilter} from "../../context/FilterContext";

const { RangePicker } = DatePicker;

const {Column, ColumnGroup} = Table;

const QUERY_URL = '/api/public/query';

const AccSaldoPeriodTab = ({setTitleNav}) => {

    const navigate = useNavigate();

    const { t } = useTranslation();

    const auth = useContext(AuthContext);

    const { filterValues } = useFilter();
    const filterKey = 'accountSaldoPeriodTabFilter'; // Set the filterKey for this route
    const filterData = filterValues[filterKey] || '';

    const [stateTab, setStateTab] = useState([]);
    const [filterTab, setFilterTab] = useState("");
    const [loading, setLoading] = useState(true);
    const [openSaldo, setOpenSaldo] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [saldoDates, setSaldoDates ] = useState({"dateBeg":dayjs(), "dateEnd":dayjs()})

    const headers = {'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const getTabData = async (filter = '') => {
        setLoading(true)
        let filters = [];
        if (filter!=='' && filter!== '{}') filters = filter
        //console.log(dataTab.toString(),'dataTab')
        if (filterData && filters.length === 0) {
            filters = [...filters, ...filterData];
        }

        dataAccSaldoPeriodTab.query['filters'] = filters;


        //dataAccSaldoPeriodTab.query['filters'].push( { "column": "acc", "value": accCode, "operator": "=", "dataType": "text" }) //Obyazatelnoe pole
        const dateBeg = dayjs(saldoDates.dateBeg).format('DD.MM.YYYY')
        const dateEnd = dayjs(saldoDates.dateEnd).format('DD.MM.YYYY')

        dataAccSaldoPeriodTab.query.source = "GET_ACCOUNT_SALDO_CURRENT_BY_EMP_ID_UI_V("+auth.empId+",'"+dateBeg+"','"+dateEnd+"')"

        const { data } = await axios.post(QUERY_URL,
            ( dataAccSaldoPeriodTab ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });

        setStateTab(data);
        setLoading(false);

        setFilterTab( dataAccSaldoPeriodFilter );

    };

    useEffect(() => {
        setTitleNav('Хисоб ракамлар колдиги');
        getTabData();
    }, [saldoDates]);

    const handleRange = (date, dateString) => {
        const dateBeg = date[0]
        const dateEnd = date[1]
        setSaldoDates({dateBeg,dateEnd})
    }
    const tableHeader = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>
                <b style={{fontWeight:'600', marginLeft:15}}>Даврни танланг</b>
                <RangePicker size="medium"
                             value={[saldoDates.dateBeg, saldoDates.dateEnd]}
                             onChange={handleRange}/>

                {/*{openSaldo &&
                    <Modal
                        title="Хисоб ракамга колдик киритиш"
                        width={600}
                        onCancel={closeSaldo}
                        open={openSaldo}
                        footer={[]}
                    >
                        <AccountSaldoAdd closeSavedSaldo={closeSavedSaldo} accCode={accCode} accId={accId}/>

                    </Modal>
                }*/}

                <Button type="primary" shape="circle" onClick={() => exportToExcel(stateTab)}>
                    <FileExcelOutlined/>
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
            <div style={{position: 'relative', height: '100%',  minHeight:'80vh'}}>

                <Table dataSource={stateTab}
                       rowSelection={rowSelection}
                       className="table-striped-rows"
                       size='small'
                       rowKey={(record, index) => record.acc +''+ index}
                       title={tableHeader}
                       loading={loading}
                       scroll={{x: 300, y:'calc(100vh - 300px)' }}
                       tableLayout="auto"
                       pagination={pagination}
                       onRow={onRow}

                >
                    {/*<Column title="Филиал" dataIndex="filial" key="filial" width={80}></Column>*/}
                    {/*<Column title="Хисоб ракам" dataIndex="acc_id" key="acc_id"></Column>*/}
                    <Column title="Хисоб ракам" dataIndex="account" key="account" sorter={(a, b) => a.account - b.account}></Column>
                    <Column title="Хисоб ракам номи" dataIndex="account_name" key="account_name" ellipsis={true} sorter={(a, b) => sortCompareString(a.account_name, b.account_name)}></Column>
                    <Column title="Сана" dataIndex="last_operday" key="last_operday"
                            sorter={(a, b) => {
                                    if (!a.last_operday && !b.last_operday) return 0;
                                    if (!a.last_operday) return -1;
                                    if (!b.last_operday) return 1;
                                    const dateA = new Date(a.last_operday.split('.').reverse().join('-')).getTime();
                                    const dateB = new Date(b.last_operday.split('.').reverse().join('-')).getTime();
                                    return dateA - dateB
                                }
                            }
                    ></Column>
                    <Column title="Кун бошига колдик" dataIndex="saldo_in" key="saldo_in" {...columnProps} sorter={(a,b) => a.saldo_in - b.saldo_in}></Column>
                    <Column title="Дебет" dataIndex="debet" key="debet" {...columnProps} sorter={(a,b) => a.debet - b.debet}></Column>
                    <Column title="Кредит" dataIndex="credit" key="credit" {...columnProps} sorter={(a,b) => a.credit - b.credit}></Column>
                    <Column title="Кун охирига колдик" dataIndex="saldo_out" key="saldo_out" {...columnProps} sorter={(a,b) => a.saldo_out - b.saldo_out}></Column>
                    {/*<Column title="Холати" dataIndex="state_name" key="state_name"></Column>*/}
                </Table>

                {/*{selectedRow && (

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

                )}*/}

            </div>
        </Layout>

    );

}

export default AccSaldoPeriodTab