import {
    Alert,
    Button,
    Descriptions,
    Divider,
    Dropdown,
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

const {Column} = Table;

const QUERY_URL = '/api/public/query';

const dataGoodRef = {
    "query": {
        "id": "GOODS_REF",
        "source": "GOODS_REF",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "code", "format": "text", "type": "text" },
            {   "column": "type", "format": "number", "type": "number" },
            {   "column": "ikpu_code", "format": "number", "type": "number" },
            {   "column": "bar_code", "format": "number", "type": "number" },
            {   "column": "tnved_code", "format": "number", "type": "number" },
            {   "column": "parent_id", "format": "number", "type": "number" },
            {   "column": "is_leaf", "format": "text", "type": "text" },
            {   "column": "short_name", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "unit", "format": "text", "type": "text" },
            {   "column": "unit_id", "format": "number", "type": "number" },
            {   "column": "state", "format": "number", "type": "number" },
            {   "column": "ord_num", "format": "number", "type": "number" },
            {   "column": "created_by", "format": "number", "type": "number" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            {   "column": "modified_date", "format": "text", "type": "text" }
        ]
    }
}

export const dataGoodFilter = [
    { "column": "id", "label": "ИД", "operator": "=", "datatype":"number"},
    { "column": "code", "label": "Коди", "operator": "_like_", "datatype":"text"},
    { "column": "ikpu_code", "label": "ИКПУ коди", "operator": "_like_", "datatype":"text"},
    { "column": "name", "label": "Номи", "operator": "_like_", "datatype":"text"},
    { "column": "unit", "label": "Улчов бирлиги", "operator": "_like_", "datatype":"text"}

]

const RefGoodTab = ({setTitleNav}) => {

    let navigate = useNavigate();

    const auth = useContext(AuthContext);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [stateTab, setStateTab] = useState([]);
    const [filterTab, setFilterTab] = useState("");
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        setTitleNav('Товар ва хизматлар маълумотномаси');
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
        dataGoodRef.query['filters'] = filters;
        const queryParams = new URLSearchParams({
            linesPerPage: pageSize,
            pageNum: currentPage,
        });

        const { data } = await axios.post(`/api/public/query/paging?${queryParams.toString()}`,
            ( dataGoodRef ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        setLoading(false);
        //setStateTab(data);
        setStateTab(data.data);
        setTotalRows(data.totalRowCount);
        console.log(data.data,'data')
        console.log(data.totalPageCount,'totalPageCount')
        console.log(data.totalRowCount,'totalRowCount')
        //setStateTab(data);

        setFilterTab( dataGoodFilter );

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

    const handleAdd = () => {
        navigate("../refGoodAdd");
        /*const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: '32',
            address: `London, Park Lane no. ${count}`,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);*/
    };

    const tableHeader = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>

                <Button
                    onClick={handleAdd}
                    type="primary"
                >
                    Кушиш
                </Button>

                <FilterModal filterTab={filterTab} onSubmit={getTabData}/>
            </div>
        );
    }

    return (

        <Layout style={{height:"100%", overflow:"hidden"}}>
            {contextHolder}
            <div style={{position: 'relative', height: '100%'}}>
                {/*<div>
                    <FilterModal filterTab={filterTab} onSubmit={getTabData}/>
                </div>*/}
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
                       className='table-striped-rows'
                       rowKey="id"
                       loading={loading}
                       size="small"
                       scroll={{x: 300, y:'calc(100vh - 400px)'}}
                       tableLayout="fixed"
                       title={tableHeader}
                       pagination={false}
                    //defaultSelectedRowKeys={defaultSelectedRowKeys}
                       onRow={onRow}
                >
                    <Column title="ИД" dataIndex="id" key="id" width={50} sorter={ (a, b) => a.id - b.id}></Column>
                    <Column title="Коди" dataIndex="code" key="code" width={250} sorter={ (a, b) => a.code - b.code}></Column>
                    <Column title="Номи" dataIndex="name" key="name" width={400} ellipsis={true} sorter={ (a, b) => a.name.length - b.name.length}></Column>
                    <Column title="ИКПУ коди" dataIndex="ikpu_code" key="ikpu_code" width={250}></Column>
                    {/*<Column title="БАР коди" dataIndex="bar_code" key="bar_code" width={250}></Column>
                    <Column title="ТНВЕД коди" dataIndex="tnved_code" key="tnved_code" width={250}></Column>*/}
                    <Column title="Улчов бирлиги" dataIndex="unit" key="unit" width={150}></Column>
                    <Column title="Холат" dataIndex="state" key="state" width={100}></Column>

                </Table>

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

                        <Descriptions.Item label="БАР коди">{selectedRow.bar_code}</Descriptions.Item>
                        <Descriptions.Item label="Яратди">{selectedRow.created_by}</Descriptions.Item>
                        <Descriptions.Item label="Яратилган сана">{selectedRow.created_date}</Descriptions.Item>

                        <Descriptions.Item label="ТНВЕД коди">{selectedRow.tnved_code}</Descriptions.Item>
                        <Descriptions.Item label="Тахрирлади">{selectedRow.modified_by}</Descriptions.Item>
                        <Descriptions.Item label="Тахрирланган сана">{selectedRow.modified_date}</Descriptions.Item>
                    </Descriptions>

                )}

            </div>
        </Layout>

    );

}

export default RefGoodTab