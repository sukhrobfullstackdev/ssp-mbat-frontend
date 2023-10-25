import {useContext, useState, useEffect} from "react";
import {Table} from "antd";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";

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

const columnsExpenseRefData = [
    {
        title: 'ИД',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: 'Модда',
        dataIndex: 'code',
        key: 'code',
        width: 100,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.code - b.code,
    },
    {
        title: 'Юкори модда',
        dataIndex: 'parent',
        key: 'parent',
        width: 100,
        sorter: (a, b) => a.parent - b.parent,
    },
    {
        title: 'Номи',
        dataIndex: 'name',
        width: 100,
        sorter: (a, b) => a.name.length - b.name.length,
    },
    {
        title: 'Яратди',
        dataIndex: 'created_by',
        width: 100,
        sorter: (a, b) => a.created_by - b.created_by,
    },
    {
        title: 'Яратилган сана',
        dataIndex: 'created_date',
        width: 100,
        sorter: (a, b) => a.created_date - b.created_date,
    },
    {
        title: 'Тахрирлади',
        dataIndex: 'modified_by',
        width: 100,
        sorter: (a, b) => a.modified_by - b.modified_by,
    },
    {
        title: 'Тахрирланган сана',
        dataIndex: 'modified_date',
        width: 100,
        sorter: (a, b) => a.modified_date - b.modified_date,
    },

]

const dataAccountRef = {
    "query": {
        "id": "ACCOUNT_TYPE_REF",
        "source": "ACCOUNT_TYPE_REF",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "name", "format": "text", "type": "text" },
        ]
    }
}

const columnsAccountRefData = [
    {
        title: 'ИД',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: 'Номи',
        dataIndex: 'name',
        width: 100,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.name.length - b.name.length,
    }
]

const ReferencesTab = (props) => {

    const auth = useContext(AuthContext);

    const [stateTab, setStateTab] = useState([]);
    const [columnTab, setColumnTab] = useState([]);
    const [filterTab, setFilterTab] = useState("");
    const [loading, setLoading] = useState(false);

    let currData = {}, currColumn = [];

    const headers = {'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    useEffect(() => {
        props.setTitleNav(props.refTitle);
    }, [columnTab]);

    const getRefTabData = async (filter = '') => {

        if (props.refType === 'account') {
            console.log(props.refType,'props.refType')
            currData = {...dataAccountRef};
            currColumn = [...columnsAccountRefData]
            setColumnTab(columnsAccountRefData)
        }

        if (props.refType === 'expense') {
            console.log(props.refType,'props.refType')
            currData = {...dataExpenseRef};
            currColumn = [...columnsExpenseRefData]
            setColumnTab(columnsExpenseRefData)
        }

        /*let filters = [];
        if (filter!=='' && filter!== '{}') filters = filter
        currData.query['filters'] = filters;*/

        const { data } = await axios.post(QUERY_URL,
            ( currData ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        setLoading(false);
        //setStateTab(data);
        console.log(currData, 'currData')
        console.log(data, 'nndata')
        setStateTab(data);

        //setFilterTab( dataAccStateFilter );

    };

    useEffect(() => {
        getRefTabData();
    }, [props.refType]);

    return (

            <Table
                dataSource={stateTab}
                columns={columnTab}
                rowKey="id"
                loading={loading}
                scroll={{x: 300, y:'calc(100vh - 400px)'}}
                tableLayout="auto"
            />


    )
}

export default ReferencesTab