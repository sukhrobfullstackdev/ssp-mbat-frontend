import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import {AuthContext} from "../../../context/AuthContext";
import {useFilter} from "../../../context/FilterContext";
import {Button, Dropdown, message, Space} from "antd";
import {fetchDocAction} from "../../../api/apiDocAction";
import {dataFilter, dataTab} from "../SmetaData";
import axios from "../../../api/axios";
import {DownOutlined, FileAddOutlined, FileExcelOutlined} from "@ant-design/icons";
import exportToExcel from "../../../components/ExportToExcel";
import FilterModal from "../../../components/FilterModalBM";
import {useDispatch, useSelector} from "react-redux";
import useTableActions from "../../../hooks/useTableActions";
import {ACCOUNT_TYPE} from "../../../store/types/references/accountType/accountType";
import {SMETA_TAB} from "../../../store/types/smeta/smetaTab/smetaTab";
const QUERY_URL = '/api/public/query';
const EXECUTE_URL = '/smeta/execute';
const useSmetaTab = (setTitleNav) => {
    const data = useSelector((state) => state.smetaTab.data);
    const totalItems = useSelector((state) => state.smetaTab.totalItems);
    const loading = useSelector((state) => state.smetaTab.loading);
    const error = useSelector((state) => state.smetaTab.error);
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useContext(AuthContext);
    const { filterValues } = useFilter();
    const filterKey = 'smetaTabFilter'; // Set the filterKey for this route
    const filterData = filterValues[filterKey] || '';
    const [filterTab, setFilterTab] = useState("");

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const {rowSelection, pagination, onRow,onSelect} = useTableActions(totalItems, selectedRowKeys, setSelectedRow, setSelectedRowKeys);
    const headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': `Bearer ${auth.token}`,
        'withCredentials': true
    };

    useEffect(() => {
        setTitleNav('Сметалар билан ишлаш');
    }, []);

    const [itemsAction, setItemsAction] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            const tt = await fetchDocAction("SMETA", auth);
            setItemsAction(tt);
        };

        fetchData();

    }, []);

    const getTabData = async (filter = '') => {

        //console.log(filter,' FILTERmmm')

        let filters = [];
        if (filter!=='' && filter!== '{}') filters = filter;

        if (filterData && filters.length === 0) {
            filters = [...filters, ...filterData];
        }

        dataTab.query['filters'] = filters;
        dataTab.query.source = "GET_SMETA_BY_EMP_ID_UI_V("+auth.empId+")"

        dispatch({type: SMETA_TAB, dataTab});

        setSelectedRow(null);
        setSelectedRowKeys([]);

        setFilterTab( dataFilter );

    };

    useEffect(() => {
        getTabData();
    }, []);

    const handleAdd = () => {
        navigate("../smetaCreate");
    };

    const handleView = () => {
        if (selectedRowKeys.length === 0) {
            messageApi.open({
                type: 'warning',
                content: 'Каторни танланг',
            });

            return false;
        }
        let data = data.find(row => row.id === selectedRowKeys[0])
        navigate("../smetaAccNew",{state: {iddoc: data.id}});

    };

    const handleAction = async (values) => {
        console.log(values)
        if (selectedRowKeys.length === 0) {
            messageApi.open({
                type: 'warning',
                content: 'Каторни танланг',
            });

            return false;
        }
        let data = data.find(row => row.id === selectedRowKeys[0]),
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
    };

    const tableHeader = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>
                <Button
                    onClick={handleAdd}
                    type="primary"
                    icon={<FileAddOutlined style={{fontSize:'16px'}}/>}
                >
                    Яратиш
                </Button>

                <Button
                    onClick={handleView}
                    type="primary"
                    icon={<FileAddOutlined style={{fontSize:'16px'}}/>}
                >
                    Куриш/Тахрирлаш
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

                {/*<SmetaPrint dataRow={selectedRow} reqHeader={headers}></SmetaPrint>*/}

                <Button type="primary" shape="circle" onClick={() => exportToExcel(data)}>
                    <FileExcelOutlined/>
                </Button>

                <FilterModal filterKey={filterKey} filterTab={filterTab} onSubmit={getTabData}/>
            </div>
        );
    };

    return {contextHolder,data,rowSelection,loading,tableHeader,pagination,onRow,selectedRow};
};

export default useSmetaTab;