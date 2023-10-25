import {Alert, Button, Descriptions, Dropdown, Layout, message, Space, Table} from 'antd';
import React, {useState, useEffect, useContext} from 'react';
import {useNavigate} from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import axios from "../../api/axios";
//import AuthContext from "../../context/AuthProvider";
import {AuthContext} from "../../context/AuthContext";
import {columns, dataTab, dataFilter} from "./EmpData";
import {DownOutlined, FileAddOutlined, FileExcelOutlined} from "@ant-design/icons";
import FilterModal from "../../components/FilterModalBM";
import dayjs from "dayjs";
import exportToExcel from "../../components/ExportToExcel";
import {useFilter} from "../../context/FilterContext";
import {request} from "../../api/request";

const EMPLOYEE_URL = '/user/listAll';
const QUERY_URL = '/api/public/query';
const EXECUTE_URL = '/employee/execute';

const itemsAction = [
    {
        key: '2',
        label: 'Тасдиқлаш',
    },
    {
        key: '4',
        label: 'Тасдиқни бекор қилиш',
    },
    {
        key: '5',
        label: 'Таҳрирлаш',
    },
    {
        key: '3',
        label: 'Ўчириш',
    },

]

const EmployeeTab = (props) => {
    let navigate = useNavigate();
    const { showBoundary } = useErrorBoundary();
    //const { auth, setAuth } = useContext(AuthContext);
    const auth = useContext(AuthContext);

    const {filterValues} = useFilter();
    const filterKey = 'employeeTabFilter'; // Set the filterKey for this route
    const filterData = filterValues[filterKey] || '';

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [stateTab, setStateTab] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterTab, setFilterTab] = useState("");
    const [tabHeight, setTabHeight] = useState();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        props.setTitleNav('Фойдаланувчилар билан ишлаш');
    }, []);

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    let v_data = [];

    useEffect(() => {
            getTabData();
        // const layEl = document.getElementById("bmTabLayout");
        // const tabEl = document.getElementById("bmTabHeader");

        // setTabHeight(layEl.offsetHeight-tabEl.offsetHeight);

    }, []);

    const headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': `Bearer ${auth.token}`,
        'withCredentials': true
    }

    const getTabData = async (filter = '') => {
        try {
            let filters = [];
            if (filter !== '' && filter !== '{}') filters = filter
            //console.log(dataTab.toString(),'dataTab')
            if (filterData && filters.length === 0) {
                filters = [...filters, ...filterData];
            }

            dataTab.query['filters'] = filters;
            debugger;
            const {data} = await request.post(QUERY_URL,
                (dataTab));
            setLoading(false);
            //setStateTab(data);
            console.log(data, 'nndata');
            setStateTab(data);

            setSelectedRow(null)
            setSelectedRowKeys([])

            setFilterTab(dataFilter);
        } catch (e) {
            showBoundary(e);
        }
    };

    const getDataEmployeesOld = async (filter = '') => {

        const {data} = await axios.post(EMPLOYEE_URL,
            JSON.stringify({login: "TEST", password: "SPRING"}), //#TODO login: auth.userId, password: auth.pwd
            {
                headers: headers,
                crossDomain: true,
                withCredentials: false
            });
        setLoading(false);
        //setStateTab(data);
        setStateTab(data.map(row => ({
            key: row.id,
            userId: row.id,
            deptLevel: row.deptlevel,
            struct: row.struct,
            staff: row.staff,
            name: row.fio,
            login: row.login,
            phoneNumber: row.phonenumber,
            mobileNumber: row.mobilenumber,
            dateOpen: row.dateopen,
            dateExpire: row.dateexpire,
            cntTries: row.cnttries,
            action: row.action,
            filial: row.filial,
            filialName: row.filial_name,
            state: row.state,
            stateName: row.state_name,
            emp: row.emp,
            createdDate: row.created_date,
            createdBy: row.created_by + ' - ' + row.created_by_name,
            modifiedDate: row.modified_date,
            modifiedBy: row.modified_by + ' - ' + row.modified_by_name,
            isEnabled: row.enabled,
            accountNonExpired: row.accountNonExpired,
            accountNonLocked: row.accountNonLocked,
            credentialsNonExpired: row.credentialsNonExpired
        })));
        console.log(stateTab);
        //setFilials(data);
    };

    const onSelect = (record, rowIndex) => {
        setSelectedRowKeys([record.id]);
        setSelectedRow(record);
    };

    const onRow = (record, rowIndex) => {
        return {
            onClick: () => {
                onSelect(record, rowIndex)
            }
        }
    };

    const handleAdd = () => {
        navigate("../employeeAdd");
        /*const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: '32',
            address: `London, Park Lane no. ${count}`,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);*/
    };

    const handleApprove = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Каторни танланг');
            return false;
        }
        message.success({
            content: 'Муввафакият',
            className: 'custom-class',
            style: {
                right: '0',
                top: '0',
                marginTop: '20px',
            }
        })
    }

    const handleAction = async (values) => {

        if (selectedRowKeys.length === 0) {
            message.warning('Каторни танланг');
            return false;
        }
        message.warning({
            content: 'Ривожланишда',
            className: 'custom-class',
            style: {
                right: '0',
                top: '0',
                marginTop: '20px',
            }
        })
        return false;


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
            const {data} = await axios.get(EXECUTE_URL,
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


    /*const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
                key: 'odd',
                text: 'Select Odd Row',
                onSelect: (changableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter((_, index) => {
                        return index % 2 === 0;


                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
            {
                key: 'even',
                text: 'Select Even Row',
                onSelect: (changableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter((_, index) => {
                        return index % 2 !== 0;


                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
        ],
    };*/

    const handleAccessRole = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Қаторни танланг');
            return false;
        }
        let data = stateTab.find(row => row.id === selectedRowKeys[0])
        navigate("../accessRole", {state: {empId: selectedRowKeys[0], empName: data?.fio}});
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

    const pagination = {
        total: stateTab.length,
        showTotal: (total, range) => (
            <span>
                <strong>{total}</strong> катордан {range[0]}-{range[1]} гача
            </span>
        ),
        pageSize: 500,
        size: 'small',
        defaultCurrent: 1,
        position: ['topRight'],
        hideOnSinglePage: false,
    };

    const tableHeader = () => {
        return (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10}}>

                <Button
                    onClick={handleAdd}
                    type="primary"
                >
                    Кушиш
                </Button>

                <Button
                    onClick={handleAccessRole}
                    type="primary"
                >
                    Рольни боглаш
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
                            <DownOutlined/>
                        </Space>
                    </Button>
                </Dropdown>

                <Button type="primary" shape="circle" onClick={() => exportToExcel(stateTab)}>
                    <FileExcelOutlined/>
                </Button>

                <FilterModal filterKey={filterKey} filterTab={filterTab} onSubmit={getTabData}/>
            </div>
        );
    }

    return (
        <Layout style={{height: "100%", overflow: "hidden"}}>
            {contextHolder}
            <div style={{position: 'relative', height: '100%'}}>
                {/*<div id="bmTabHeader">
                    <Button
                        onClick={handleAdd}
                        type="primary"
                        style={{
                            margin: 10,
                        }}
                    >
                        Кушиш
                    </Button>
                    <Button
                        onClick={handleApprove}
                        type="primary"
                        style={{
                            margin: 10,
                        }}
                    >
                        Тасдиклаш
                    </Button>
                </div>*/}

                <Table rowSelection={rowSelection}
                       columns={columns}
                       dataSource={stateTab}
                       rowKey="id"
                       loading={loading}
                       pagination={pagination}
                       onRow={onRow}
                       size='small'
                       scroll={{x: 300, y: 'calc(100vh - 400px)'}}
                       tableLayout="auto"
                       title={tableHeader}
                    /*style={{width: '100%', height: '100vh'}}*/
                />

                {selectedRow && (

                    <Descriptions bordered
                                  size='small'
                                  style={{position: 'absolute', left: 0, bottom: 0, width: '100%'}}
                                  column={{
                                      xxl: 4,
                                      xl: 3,
                                      lg: 3
                                  }}
                    >

                        <Descriptions.Item label="Даража">{selectedRow.deptlevel}</Descriptions.Item>
                        <Descriptions.Item label="Телефон ракам">{selectedRow.phonenumber || ''}</Descriptions.Item>
                        <Descriptions.Item
                            label="Яратди">{selectedRow.created_by + ' - ' + selectedRow.created_by_name || ''}</Descriptions.Item>
                        <Descriptions.Item label="Яратилган сана">{selectedRow.created_date || ''}</Descriptions.Item>

                        <Descriptions.Item label="Тузилма">{selectedRow.struct || ''}</Descriptions.Item>
                        <Descriptions.Item
                            label="Мобил тел. раками">{selectedRow.mobilenumber || ''}</Descriptions.Item>
                        <Descriptions.Item
                            label="Тахрирлади">{selectedRow.modified_by + ' - ' + selectedRow.modified_by_name || ''}</Descriptions.Item>
                        <Descriptions.Item
                            label="Тахрирланган сана">{selectedRow.modified_date || ''}</Descriptions.Item>

                        <Descriptions.Item
                            label="Филиал">{selectedRow.filial + ' - ' + selectedRow.filial_name || ''}</Descriptions.Item>
                    </Descriptions>

                )}

            </div>
        </Layout>
    );
};

export default EmployeeTab;