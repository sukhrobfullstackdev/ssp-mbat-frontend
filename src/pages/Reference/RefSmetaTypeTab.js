import {Alert, Button, Descriptions, Divider, Form, Input, Layout, message, Modal, Table} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import {useNavigate} from "react-router-dom";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import FilterModal from "../../components/FilterModalBM";
import {FileAddOutlined} from "@ant-design/icons";
const {Column} = Table;


//import {getDataBooks} from "../../services/index"

const QUERY_URL = '/api/public/query';


const dataSmetaTypeRef = {
    "query": {
        "id": "SMETA_TYPE_REF",
        "source": "SMETA_TYPE_REF",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "name", "format": "text", "type": "text" },
        ]
    }
}

const RefSmetaTypeTab = ({setTitleNav}) => {

    let navigate = useNavigate();

    const auth = useContext(AuthContext);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [stateTab, setStateTab] = useState([]);
    const [filterTab, setFilterTab] = useState("");
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        setTitleNav('Смета турлари маълумотномаси');
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
        dataSmetaTypeRef.query['filters'] = filters;


        const { data } = await axios.post(QUERY_URL,
            ( dataSmetaTypeRef ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        setLoading(false);
        //setStateTab(data);
        console.log(data, 'nndata')
        setStateTab(data);

        //setFilterTab( dataFilter );

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
        setSelectedRowKeys([record.id]);
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
            <div>
                {/*<div>
                    <FilterModal filterTab={filterTab} onSubmit={getTabData}/>
                </div>*/}

                <Table rowSelection={rowSelection}
                       dataSource={stateTab}
                       className='table-striped-rows'
                       rowKey="id"
                       loading={loading}
                       size="small"
                       scroll={{x: 300, y:'calc(100vh - 400px)'}}
                       tableLayout="auto"
                       pagination={pagination}
                    //defaultSelectedRowKeys={defaultSelectedRowKeys}
                       onRow={onRow}
                >
                    <Column title="ИД" dataIndex="id" key="id" width={50}></Column>
                    <Column title="Номи" dataIndex="name" key="name" width={100}></Column>

                </Table>

            </div>
        </Layout>

    );

}

export default RefSmetaTypeTab