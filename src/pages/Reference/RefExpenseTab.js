import {
    Alert,
    Button,
    Descriptions,
    Divider,
    Form,
    Input,
    Layout,
    message,
    Modal,
    Pagination,
    Space,
    Table
} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import {useNavigate} from "react-router-dom";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import FilterModal from "../../components/FilterModalBM";
import {FileAddOutlined} from "@ant-design/icons";
const {Column} = Table;


//import {getDataBooks} from "../../services/index"

const QUERY_URL = '/api/public/query';


const dataExpenseRef = {
    "query": {
        "id": "EXPENSE_REF",
        "source": "EXPENSE_REF",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "code", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "parent", "format": "text", "type": "text" },
            {   "column": "isleaf", "format": "text", "type": "text" },
            {   "column": "created_by", "format": "number", "type": "number" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            {   "column": "modified_date", "format": "text", "type": "text" }
        ]
    }
}

const RefExpenseTab = ({setTitleNav}) => {

    let navigate = useNavigate();

    const auth = useContext(AuthContext);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [stateTab, setStateTab] = useState([]);
    const [filterTab, setFilterTab] = useState("");
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        setTitleNav('Харажат моддалари маълумотномаси');
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
        dataExpenseRef.query['filters'] = filters;


        const { data } = await axios.post(QUERY_URL,
            ( dataExpenseRef ),
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

    const handlePageChange = (page, pageSize) => {
        // Handle page change
    };

    const handlePageSizeChange = (current, size) => {
        // Handle page size change
    };

    return (

        <Layout style={{height:"100%", overflow:"hidden"}}>
            {contextHolder}
            <div>
                {/*<Space>
                    <FilterModal filterTab={filterTab} onSubmit={getTabData}/>
                </Space>*/}

                <Table rowSelection={rowSelection}
                       dataSource={stateTab}
                       className='table-striped-rows'
                       rowKey="id"
                       loading={loading}
                       size="small"
                       scroll={{x: 300, y:'calc(100vh - 300px)'}}
                       tableLayout="auto"
                       pagination={pagination}
                    //defaultSelectedRowKeys={defaultSelectedRowKeys}
                       onRow={onRow}
                >
                    <Column title="ИД" dataIndex="id" key="id" width={50}></Column>
                    <Column title="Модда" dataIndex="code" key="code" width={100}></Column>
                    <Column title="Юкори модда" dataIndex="parent" key="parent" width={100}></Column>
                    <Column title="Номи" dataIndex="name" key="name" width={100} ></Column>

                    <Column title="Яратди" dataIndex="created_by" key="created_by" width={100}></Column>
                    <Column title="Яратилган сана" dataIndex="created_date" key="created_date" width={100}></Column>
                    <Column title="Тахрирлади" dataIndex="modified_by" key="modified_by" width={50}></Column>
                    <Column title="Тахрирланган сана" dataIndex="modified_date" key="modified_date" width={50}></Column>


                </Table>

                {/*{selectedRow && (

                    <Descriptions bordered
                                  size='small'
                                  column={{
                                      xxl: 4,
                                      xl: 3,
                                      lg: 3
                                  }}
                    >

                        <Descriptions.Item label="Хужжат тури">{selectedRow.doc_type}</Descriptions.Item>
                        <Descriptions.Item label="Юкори ИД">{selectedRow.parent_id}</Descriptions.Item>
                    </Descriptions>

                )}*/}

            </div>
        </Layout>

    );

}

export default RefExpenseTab