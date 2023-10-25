import {Button, Descriptions, Dropdown, Layout, message, Modal, Space, Table} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import {useNavigate} from "react-router-dom";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import {dataAccFilter, columnsAcc, dataAccTab} from "./AccountData";
import FilterModal from "../../components/FilterModalBM";
import {
    DownloadOutlined,
    DownOutlined,
    FileAddOutlined,
    FileExcelFilled,
    FileExcelOutlined,
    TableOutlined
} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import AccountStateTab from "../AccountState/AccountStateTab";
import {useAuth} from "../../hooks/auth.hook";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import AccountMonitoringTab from "../AccountState/AccountMonitoringTab";
import {fetchDocAction} from "../../api/apiDocAction";
import AccountEdit from "./AccountEdit";
import AccountSaldoTab from "../AccountState/AccountSaldoTab";
import exportToExcel from "../../components/ExportToExcel";
import {useFilter} from "../../context/FilterContext";


//import {getDataBooks} from "../../services/index"

const QUERY_URL = '/api/public/query';
const EXECUTE_URL = '/account/execute';

const AccountTab = ({setTitleNav}) => {

    let navigate = useNavigate();

    const { t } = useTranslation();

    const auth = useContext(AuthContext);

    const { filterValues } = useFilter();
    const filterKey = 'accountTabFilter'; // Set the filterKey for this route
    const filterData = filterValues[filterKey] || '';

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [stateTab, setStateTab] = useState([]);
    const [filterTab, setFilterTab] = useState("");
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saldoOpen, setSaldoOpen] = useState(false);
    const [isModalSaldoOpen, setIsModalSaldoOpen] = useState(false);
    const [selAcc, setSelAcc] = useState({});
    const [accountId, setAccountId] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();


    useEffect(() => {
        setTitleNav('Хисоб ракамлар билан ишлаш');
    }, []);

    const [itemsAction, setItemsAction] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            const tt = await fetchDocAction("ACCOUNT", auth)
            console.log(tt,'tttete')
            setItemsAction(tt);
        }

        fetchData();

    }, []);

    const headers = {'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const getTabData = async (filter = '') => {

        let filters = [];
        if (filter !== '' && filter !== '{}') filters = filter

        if (filterData && filters.length === 0) {
            filters = [...filters, ...filterData];
        }

        dataAccTab.query['filters'] = filters;
        /*const defFilterValue = [
            { "column": "filial", "value": empFilial, "operator": "=", "dataType": "text" }
        ];
        dataAccTab.query.filters.push(...defFilterValue)*/
        dataAccTab.query.source = "GET_ACCOUNTS_BY_EMP_ID_UI_V("+auth.empId+")"

        const { data } = await axios.post(QUERY_URL,
            ( dataAccTab ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        setLoading(false);
        //setStateTab(data);
        console.log(data, 'nndata')
        setStateTab(data);

        setSelectedRow(null)
        setSelectedRowKeys([])

        setFilterTab( dataAccFilter );

    };

    useEffect(() => {
        getTabData();
    }, []);


    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const handleAdd = () => {
        navigate("../accountAdd");
    };

    const handleAccState = () => {
        if (selectedRowKeys.length === 0) { message.warning('Каторни танланг'); return false; }
        setOpen(true)
        let data = stateTab.find(row => row.id === selectedRowKeys[0])
        setSelAcc({ acc:data?.code, accName:data?.name})
        //navigate("../accountStateTab",{state: { acc:data?.code, accName:data?.name}});
    }

    const handleSaldoTab = () => {
        if (selectedRowKeys.length === 0) { message.warning('Каторни танланг'); return false; }
        let data = stateTab.find(row => row.id === selectedRowKeys[0])
        setSelAcc({ acc:data?.code, accName:data?.name, accId:data?.id})
        setSaldoOpen(true)
        //navigate("../accountStateTab",{state: { acc:data?.code, accName:data?.name}});
    }

    const handleMonitorAcc = () => {
        navigate("../accountMonitoringTab");
    }

    const handleApproveMenu = () => {
        if (selectedRowKeys.length === 0) { message.warning('Каторни танланг'); return false; }
        message.success('Муввафакият');
    }

    const handleAction = async (values) => {

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

        if (action === '5') {
            setAccountId(iddoc)
            showModal(true)
            return;
        }


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

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        getTabData().then( () => setIsModalOpen(false))

    };
    const handleCancel = () => {
        setIsModalOpen(false);
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

    const handleExport11 = () => {
        const tableHeaders = Object.keys(stateTab[0]);

        /* Create a CSV content string */
        let csvContent = 'data:text/csv;charset=utf-8,';

        /* Add headers to the CSV content */
        csvContent += tableHeaders.join(',') + '\r\n';

        /* Add table data to the CSV content */
        stateTab.forEach((row) => {
            const rowData = tableHeaders.map((header) => row[header]);
            csvContent += rowData.join(',') + '\r\n';
        });

        /* Create a data URI for the CSV file */
        const encodedUri = encodeURI(csvContent);

        /* Create a link element and set its attributes */
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'tableData.csv');

        /* Simulate a click event to trigger the download */
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExport = () => {

        exportToExcel(stateTab)
        /*/!* Convert tableData to worksheet *!/
        const worksheet = XLSX.utils.json_to_sheet(stateTab);

        /!* Create workbook and add the worksheet *!/
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        /!* Generate Excel file buffer *!/
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });

        /!* Save the file *!/
        const excelBlob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(excelBlob, 'tableData.xlsx');*/
    };

    const tableHeader = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>
                <Button
                    onClick={handleAdd}
                    type="primary"
                >
                    Хисоб ракам очиш
                </Button>

                <Button
                    onClick={handleAccState}
                    type="primary"
                    icon={<TableOutlined />}
                >
                    Хисоб ракам холати
                </Button>

                <Modal
                    title={t('accState')}
                    open={open}
                    onCancel={() => setOpen(false)}
                    footer={[]}
                    width={'80%'}
                    style={{
                        top: 20,
                        overflowY: "auto"
                    }}
                >
                    <AccountStateTab selAcc={selAcc}/>

                </Modal>

                <Button
                    onClick={handleSaldoTab}
                    type="primary"
                    icon={<TableOutlined />}
                >
                    Хисоб ракам колдиги
                </Button>

                <Modal
                    title={t('accSaldo')}
                    open={saldoOpen}
                    onCancel={() => setSaldoOpen(false)}
                    footer={[]}
                    width={'80%'}
                    style={{
                        top: 20,
                        overflowY: "auto"
                    }}
                >
                    <AccountSaldoTab selAcc={selAcc}/>

                </Modal>

                {/* beg first version with router page and Drawer*/}
                <Button
                    onClick={handleMonitorAcc}
                    type="primary"
                    hidden={true}
                    /*icon={<DownloadOutlined />}*/
                >
                    Хисоб ракам колдиги
                </Button>

                {/* end first version with router page and Drawer*/}

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

                <Button  type="primary" shape="circle" onClick={handleExport}>
                    <FileExcelOutlined/>
                </Button>

                <FilterModal filterKey={filterKey} filterTab={filterTab} onSubmit={getTabData}/>

                <Modal title="Хисоб ракамни тахрирлаш" open={isModalOpen} footer={[]} onOk={handleOk} onCancel={handleCancel} width={800}>
                    { isModalOpen && <AccountEdit accountId={accountId} handleSaveEdit={handleOk} handleCancelEdit={handleCancel}/> }
                </Modal>

            </div>
        );
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

    return (

        <Layout style={{height:"100%", overflow:"hidden"}}>
            {contextHolder}
            <div style={{position: 'relative', height: '100%'}}>

                <Table rowSelection={rowSelection}
                       columns={columnsAcc}
                       className="table-striped-rows"
                       dataSource={stateTab}
                       rowKey="id"
                       loading={loading}
                       size='small'
                       title={tableHeader}
                    //scroll={{x: 300, y:'calc(100vh - 345px)'}}
                       scroll={{x: 300, y:'calc(100vh - 400px)' }}
                       tableLayout="auto"
                       pagination={pagination}
                       onRow={onRow}

                />

                {selectedRow && (

                    <Descriptions bordered
                                  size='small'
                                  style={{ position: 'absolute', left: 0, bottom: 0, width: '100%' }}
                                  column={{
                                      xxl: 3,
                                      xl: 3,
                                      lg: 3
                                  }}
                    >

                        <Descriptions.Item label={t('recipName')}>{selectedRow.filial_name||''}</Descriptions.Item>
                        <Descriptions.Item label={t('createdBy')}>{selectedRow.created_by + ' - '+selectedRow.created_by_name||''}</Descriptions.Item>
                        <Descriptions.Item label={t('createdDate')}>{selectedRow.created_date||''}</Descriptions.Item>

                        <Descriptions.Item label={t('accType')}>{selectedRow.acc_type||''}</Descriptions.Item>
                        <Descriptions.Item label={t('modifiedDate')}>{selectedRow.modified_date||''}</Descriptions.Item>
                        <Descriptions.Item label={t('modifiedBy')}>{selectedRow.modified_by + ' - '+selectedRow.modified_by_name}</Descriptions.Item>

                    </Descriptions>

                )}

            </div>
        </Layout>

    );

}

export default AccountTab