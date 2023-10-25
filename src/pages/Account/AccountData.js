
import {sortCompareString} from '../../libs/formbm'
import {Badge, Space, Tag} from "antd";
export const dataAccTab = {
    "query": {
        "ID": "GET_ACCOUNTS_BY_EMP_ID_UI_V",
        "source": "GET_ACCOUNTS_BY_EMP_ID_UI_V",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "mfo", "format": "text", "type": "text" },
            {   "column": "code", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "inn", "format": "text", "type": "text" },
            {   "column": "acc_type", "format": "number", "type": "number" },
            {   "column": "pinfl", "format": "text", "type": "text" },
            {   "column": "filial", "format": "text", "type": "text" },
            {   "column": "filial_name", "format": "text", "type": "text" },
            {   "column": "state", "format": "number", "type": "number" },
            {   "column": "state_name", "format": "text", "type": "text" },
            {   "column": "created_by", "format": "number", "type": "number" },
            {   "column": "created_by_name", "format": "number", "type": "number" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            {   "column": "modified_by_name", "format": "number", "type": "number" },
            {   "column": "modified_date", "format": "text", "type": "text" }
        ]
    }
}

export const dataAccFilter = [
    { "column": "id", "label": "ИД", "operator": "=", "datatype":"number"},
    { "column": "mfo", "label": "МФО", "operator": "=", "datatype":"text"},
    { "column": "code", "label": "Хисоб ракам", "operator": "_like_", "datatype":"text"},
    { "column": "name", "label": "Номи", "operator": "_like_", "datatype":"text"},
    { "column": "state", "label": "Холат", "operator": "in", "datatype":"number","type":"M","typeRef":"DOCSTATE","paramRef":"ACCOUNT"}

]

export const columnsAcc = [
    {
        title: 'ИД',
        dataIndex: 'id',
        width: 100,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: 'Хисоб ракам',
        dataIndex: 'code',
        width: 200,
        sorter: (a, b) => a.code.length - b.code.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'Номи',
        dataIndex: 'name',
        width: 200,
        //sorter: (a, b) => a.name.localeCompare(b.name, 'ru', { sensitivity: 'base' }),
        sorter: (a, b) => sortCompareString(a.name, b.name),
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'МФО',
        dataIndex: 'mfo',
        width: 200,
        sorter: (a, b) => a.mfo - b.mfo,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'ИНН',
        dataIndex: 'inn',
        width: 200,
        sorter: (a, b) => a.inn - b.inn,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    /*{
        title: 'ПИНФЛ',
        dataIndex: 'pinfl',
        width: 200,
        sorter: (a, b) => a.pinfl - b.pinfl,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },*/
    {
        title: 'Холат',
        dataIndex: 'state_name',
        width: 200,
        sorter: (a, b) => a.state_name - b.state_name,
        render: (text, record) => {
            return (
                <Space size="middle">
                    {
                          record.state === 2 ? <Badge status="success" text={text} />
                        : record.state === 3 ? <Badge status="volcano" text={text} />
                        : <Badge status="default" text={text} />
                    }
                </Space>
            )
        },
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    /*{
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
    },*/
];

export const dataAccoountTypeData = {
    "query": {
        "ID": "ACCOUNT_TYPE_REF",
        "source": "ACCOUNT_TYPE_REF",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "name", "format": "text", "type": "text" },

        ]
    }
}

