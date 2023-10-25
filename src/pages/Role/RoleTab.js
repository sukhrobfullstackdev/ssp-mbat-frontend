import {Alert, Button, Drawer, Form, Input, Layout, message, Modal, Space, Table} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import {useNavigate} from "react-router-dom";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import {columns, dataFilter, dataTab} from "./RoleData";
import FilterModal from "../../components/FilterModalBM";
import CNSpecification from "../Contract/Specification";
import AccessDocAction from "./AccessDocAction";
import {TableOutlined} from "@ant-design/icons";
import {useFilter} from "../../context/FilterContext";

//import {getDataBooks} from "../../services/index"

const QUERY_URL = '/api/public/query';


const RoleTab = (props) => {

    let navigate = useNavigate();

    const auth = useContext(AuthContext);

    const { filterValues } = useFilter();
    const filterKey = 'roleTabFilter'; // Set the filterKey for this route
    const filterData = filterValues[filterKey] || '';

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [stateTab, setStateTab] = useState([]);
    const [filterTab, setFilterTab] = useState("");
    const [loading, setLoading] = useState(true);
    const [openSpec, setOpenSpec] = useState(false)
    const [roleData, setRoleData] = useState({})

    const showSpec = () => {
        setOpenSpec(true)
    }
    const closeSpec = () => {
        setOpenSpec(false)
    }

    useEffect(() => {
        props.setTitleNav('Роллар билан ишлаш');
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


        const { data } = await axios.post(QUERY_URL,
            ( dataTab ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        setLoading(false);

        setStateTab(data);

        setFilterTab( dataFilter );

    };

    useEffect(() => {
        getTabData();
    }, []);


    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const handleAdd = () => {
        navigate("../roleAdd");
    };

    const handleAccessMenu = () => {
        if (selectedRowKeys.length === 0) { message.warning('Қаторни танланг'); return false; }
        let data = stateTab.find(row => row.id === selectedRowKeys[0])
        navigate("../accessMenu",{state: { roleId:selectedRowKeys[0], roleName: data?.name}});
    };

    const handleAccessDocAction = () => {
        if (selectedRowKeys.length === 0) { message.warning('Қаторни танланг'); return false; }
        let data = stateTab.find(row => row.id === selectedRowKeys[0])

        //navigate("../accessDocAction",{state: { roleId:selectedRowKeys[0], roleName: data?.name}});
        setRoleData({roleId: selectedRowKeys[0], roleName: data?.name})
        showSpec()
    };

    const handleApproveMenu = () => {
        if (selectedRowKeys.length === 0) { message.warning('Қаторни танланг'); return false; }
        message.success('Муввафақият');
    }

    const onSelect = (record, rowIndex) => {
        setSelectedRowKeys([record.id]);
        setSelectedRow(record);
    };

    const onRow = (record, rowIndex) => {
        return {
            onClick: () =>{ onSelect(record, rowIndex) }
        }
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

    const tableHeader = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>
                <Button
                    onClick={handleAdd}
                    type="primary"
                >
                    Янги роль
                </Button>
                <Button
                    onClick={handleAccessMenu}
                    type="primary"
                >
                    Модулларга ваколат бериш
                </Button>
                <Button
                    //onClick={handleAccessDocAction}
                    onClick={handleAccessDocAction}
                    icon={<TableOutlined />}
                    type="primary"
                >
                    Амалларга ваколат бериш
                </Button>

                <Drawer
                    title="Амалларга ваколат бериш"
                    width={700}
                    placement='right'
                    onClose={closeSpec}
                    open={openSpec}
                    bodyStyle={{
                        paddingBottom: 80,
                    }}
                >
                    <AccessDocAction roleData={roleData}/>

                </Drawer>

                <Button
                    onClick={handleApproveMenu}
                    type="primary"
                >
                    Тасдиклаш
                </Button>
                <FilterModal filterKey={filterKey} filterTab={filterTab} onSubmit={getTabData}/>
            </div>
        );
    }

    return (

        <Layout style={{height:"100%", overflow:"hidden"}}>
            <div>

                <Table rowSelection={rowSelection}
                       columns={columns}
                       dataSource={stateTab}
                       rowKey="id"
                       loading={loading}
                       size='small'
                       title={tableHeader}
                       //scroll={{x: 300, y:'calc(100vh - 345px)'}}
                       scroll={{x: 300, y:'calc(100vh - 300px)'}}
                       tableLayout="auto"
                       pagination={pagination}
                       onRow={onRow}
                       /*style={{width: '100%', height: '100vh'}}*/
                />

            </div>
        </Layout>

    );

}

export default RoleTab