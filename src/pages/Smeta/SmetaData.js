//SMETA TAB BEG

import {Badge, Input, Space, Tooltip} from "antd";
import {setExp} from "../../components/TableExpModalBm";

export const dataTab = {
    "query": {
        "id": "GET_SMETA_BY_EMP_ID_UI_V",
        "source": "GET_SMETA_BY_EMP_ID_UI_V",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "acc", "format": "text", "type": "text" },
            {   "column": "accid", "format": "number", "type": "number" },
            {   "column": "acc_name", "format": "text", "type": "text" },
            {   "column": "acc_mfo", "format": "text", "type": "text" },
            {   "column": "acc_inn", "format": "text", "type": "text" },
            {   "column": "finyear", "format": "number", "type": "number" },
            {   "column": "filial", "format": "text", "type": "text" },
            {   "column": "purpose", "format": "text", "type": "text" },
            {   "column": "smeta_type", "format": "number", "type": "number" },
            {   "column": "sumpay", "format": "number", "type": "number" },
            {   "column": "state", "format": "number", "type": "number" },
            {   "column": "state_name", "format": "text", "type": "text" },
            {   "column": "all_sum", "format": "text", "type": "text" },
            {   "column": "doc_date", "format": "text", "type": "text" },
            {   "column": "created_by", "format": "number", "type": "number" },
            {   "column": "created_by_name", "format": "text", "type": "text" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            {   "column": "modified_by_name", "format": "text", "type": "text" },
            {   "column": "modified_date", "format": "text", "type": "text" }
        ]
    }
}

export const dataFilter = [
    { "column": "id", "label": "ID", "operator": "=", "datatype":"number"},
    { "column": "acc", "label": "Хисоб ракам", "operator": "_like_", "datatype":"text"},
    { "column": "finyear", "label": "Молиявий йил", "operator": "=", "datatype":"number"},
    { "column": "filial", "label": "Филиал", "operator": "=", "datatype":"text", "type":"S","typeRef":"FILIAL"},
    { "column": "smeta_type", "label": "Смета тури", "operator": "=", "datatype":"number"},
    { "column": "state", "label": "Холат", "operator": "in", "datatype":"number","type":"M","typeRef":"DOCSTATE","paramRef":"SMETA"}
]

export const columns = [
    {
        title: 'ИД',
        dataIndex: 'id',
        fixed: 'left',
        width: 100,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: 'Молиявий йил',
        dataIndex: 'finyear',
        fixed: 'left',
        width: 200,
        sorter: (a, b) => a.finyear - b.finyear,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'Хисоб ракам',
        dataIndex: 'acc',
        fixed: 'left',
        width: 200,
        sorter: (a, b) => a.acc - b.acc,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'Хужжат санаси',
        dataIndex: 'doc_date',
        width: 200,
        sorter: (a, b) => new Date(a.doc_date.split('.').reverse().join('-')) - new Date(b.doc_date.split('.').reverse().join('-')),
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'МФО',
        dataIndex: 'acc_mfo',
        width: 200,
        sorter: (a, b) => a.mfo - b.mfo,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'ИНН',
        dataIndex: 'acc_inn',
        width: 200,
        sorter: (a, b) => a.inn - b.inn,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'Филиал',
        dataIndex: 'filial',
        width: 200,
        sorter: (a, b) => a.filial - b.filial,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'Смета тури',
        dataIndex: 'smeta_type',
        width: 200,
        sorter: (a, b) => a.smeta_type - b.smeta_type,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'Сумма',
        dataIndex: 'all_sum',
        align: 'right',
        width: 200,
        sorter: (a, b) => a.all_sum.length - b.all_sum.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
    },
    {
        title: 'Холат',
        dataIndex: 'state_name',
        width: 200,
        sorter: (a, b) => a.state - b.state,
        render: (text, record) => {
            return (
                <Space size="middle">
                    {
                          record.state === 6 || record.state === 3 || record.state === 4? <Badge status="success" text={text} />
                        : record.state === 2 ? <Badge status="warning" text={text} />
                        : record.state === 5 ? <Badge status="error" text={text} />
                        : <Badge status="default" text={text} />
                    }
                </Space>
            )
        },
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    /*{
        title: 'Тафсилотлар',
        dataIndex: 'purpose',
        width: 200,
        sorter: (a, b) => a.purpose.length - b.purpose.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
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
        sorter: (a, b) => new Date(a.created_date.split('.').reverse().join('-')) - new Date(b.created_date.split('.').reverse().join('-')),
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
        sorter: (a, b) => new Date(a.modified_date.split('.').reverse().join('-')) - new Date(b.modified_date.split('.').reverse().join('-')),
    },*/
];

//SMETA TAB END

//SMETAACC TAB BEG

export const dataSmetaAccTab = (empId) => {
    return {
    "query": {
        "id": "GET_ACCOUNTS_BY_EMP_ID_UI_V",
        "source": "GET_ACCOUNTS_BY_EMP_ID_UI_V("+empId+")",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "mfo", "format": "text", "type": "text" },
            {   "column": "code", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "inn", "format": "text", "type": "text" },
            {   "column": "filial", "format": "text", "type": "text" },
            {   "column": "state", "format": "number", "type": "number" },
            {   "column": "created_by", "format": "number", "type": "number" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            {   "column": "modified_date", "format": "text", "type": "text" }
        ]
    }
    }
}

export const dataSmetaAccFilter = [
    { "column": "id", "label": "ИД", "operator": "=", "datatype":"number"},
    { "column": "filial", "label": "Филиал", "operator": "=", "datatype":"text", "type":"S","typeRef":"FILIAL"},
    { "column": "mfo", "label": "МФО", "operator": "=", "datatype":"text"},
    { "column": "code", "label": "Хисоб ракам", "operator": "_like_", "datatype":"text"},
    { "column": "name", "label": "Номи", "operator": "_like_", "datatype":"text"}

]

export const columnsAcc = (t) => [
    {
        title: t('id'),
        dataIndex: 'id',
        width: 100,
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: t('filial'),
        dataIndex: 'filial',
        width: 100,
        sorter: (a, b) => a.filial - b.filial,
    },
    {
        title: t('acc'),
        dataIndex: 'code',
        width: 200,
        sorter: (a, b) => a.code.length - b.code.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: t('name'),
        dataIndex: 'name',
        width: 200,
        sorter: (a, b) => a.name.length - b.name.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: t('mfo'),
        dataIndex: 'mfo',
        width: 100,
        sorter: (a, b) => a.mfo.length - b.mfo.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: t('inn'),
        dataIndex: 'inn',
        width: 100,
        sorter: (a, b) => a.inn.length - b.inn.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: t('state'),
        dataIndex: 'state',
        width: 100,
        sorter: (a, b) => a.state.length - b.state.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: t('createdBy'),
        dataIndex: 'created_by',
        width: 100,
        sorter: (a, b) => a.created_by - b.created_by,
    },
    {
        title: t('createdDate'),
        dataIndex: 'created_date',
        width: 100,
        sorter: (a, b) => a.created_date - b.created_date,
        ellipsis: true,
    },
    {
        title: t('modifiedBy'),
        dataIndex: 'modified_by',
        width: 100,
        sorter: (a, b) => a.modified_by - b.modified_by,
    },
    {
        title: t('modifiedDate'),
        dataIndex: 'modified_date',
        width: 100,
        sorter: (a, b) => a.modified_date - b.modified_date,
        ellipsis: true,
    },
];

//SMETAACC TAB END

//SMETAEXPENSE TAB BEG

export const dataSmetaExpTab = {
    "query": {
        "id": "V_EXPENSE_REF",
        "source": "V_EXPENSE_REF",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "code", "format": "text", "type": "text" },
            {   "column": "parent", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "isleaf", "format": "text", "type": "text" },
            {   "column": "sumpayexp", "format": "number", "type": "number" },
            {   "column": "created_by", "format": "number", "type": "number" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            {   "column": "modified_date", "format": "text", "type": "text" }
        ]
        /*"filters": [{
            "column": "isleaf",
            "operator": "=",
            "value": "Y",
            "dataType": "text"
        }]*/

    }
}

export const dataSmetaExpNewTab = {
    "query": {
        "id": "get_smeta_by_id_expense_horizontal_month_hierarchical",
        "source": "get_smeta_by_id_expense_horizontal_month_hierarchical",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "doc_date", "format": "text", "type": "text" },
            {   "column": "finyear", "format": "number", "type": "number" },
            {   "column": "acc", "format": "text", "type": "text" },
            {   "column": "accid", "format": "number", "type": "number" },
            {   "column": "smeta_type", "format": "number", "type": "number" },
            {   "column": "expense", "format": "text", "type": "text" },
            {   "column": "expense_name", "format": "text", "type": "text" },
            {   "column": "expense_parent", "format": "text", "type": "text" },
            {   "column": "expense_isleaf", "format": "text", "type": "text" },
            {   "column": "year", "format": "text", "type": "text" },
            {   "column": "q_1", "format": "text", "type": "text" },
            {   "column": "m_1", "format": "text", "type": "text" },
            {   "column": "m_2", "format": "text", "type": "text" },
            {   "column": "m_3", "format": "text", "type": "text" },
            {   "column": "q_2", "format": "text", "type": "text" },
            {   "column": "m_4", "format": "text", "type": "text" },
            {   "column": "m_5", "format": "text", "type": "text" },
            {   "column": "m_6", "format": "text", "type": "text" },
            {   "column": "q_3", "format": "text", "type": "text" },
            {   "column": "m_7", "format": "text", "type": "text" },
            {   "column": "m_8", "format": "text", "type": "text" },
            {   "column": "m_9", "format": "text", "type": "text" },
            {   "column": "q_4", "format": "text", "type": "text" },
            {   "column": "m_10", "format": "text", "type": "text" },
            {   "column": "m_11", "format": "text", "type": "text" },
            {   "column": "m_12", "format": "text", "type": "text" },
        ]
        /*"filters": [{
            "column": "isleaf",
            "operator": "=",
            "value": "Y",
            "dataType": "text"
        }]*/

    }
}

export const dataSmetaExpCreateTab = {
    "query": {
        "id": "smeta_empty_expense_horizontal_month_hierarchical_v",
        "source": "smeta_empty_expense_horizontal_month_hierarchical_v",
        "fields": [
            {   "column": "expense", "format": "text", "type": "text" },
            {   "column": "expense_name", "format": "text", "type": "text" },
            {   "column": "expense_parent", "format": "text", "type": "text" },
            {   "column": "expense_isleaf", "format": "text", "type": "text" },
            {   "column": "year", "format": "text", "type": "text" },
            {   "column": "q_1", "format": "text", "type": "text" },
            {   "column": "m_1", "format": "text", "type": "text" },
            {   "column": "m_2", "format": "text", "type": "text" },
            {   "column": "m_3", "format": "text", "type": "text" },
            {   "column": "q_2", "format": "text", "type": "text" },
            {   "column": "m_4", "format": "text", "type": "text" },
            {   "column": "m_5", "format": "text", "type": "text" },
            {   "column": "m_6", "format": "text", "type": "text" },
            {   "column": "q_3", "format": "text", "type": "text" },
            {   "column": "m_7", "format": "text", "type": "text" },
            {   "column": "m_8", "format": "text", "type": "text" },
            {   "column": "m_9", "format": "text", "type": "text" },
            {   "column": "q_4", "format": "text", "type": "text" },
            {   "column": "m_10", "format": "text", "type": "text" },
            {   "column": "m_11", "format": "text", "type": "text" },
            {   "column": "m_12", "format": "text", "type": "text" },
        ]
    }
}


export const dataSmetaExpFilter = [
    { "column": "id", "label": "ИД", "operator": "=", "datatype":"number"},
    { "column": "code", "label": "Харажат моддаси", "operator": "=", "datatype":"text"},
    { "column": "name", "label": "Номи", "operator": "text", "datatype":"text"}

]

let arrExp = []
export const handleExpChange = (e, record) => {

    if (arrExp.length === 0) {
        arrExp.push({expense: record.code , sumpay: e.target.value })
    } else {
        console.log(arrExp.length, 'length')
        const tt = arrExp.find(elem => elem.expense = record.code)
        console.log(tt, 'tt')
        for (let i = 0; i < arrExp.length; i++) {

            console.log(arrExp[i].sumpay, 'ttrrr')
            console.log(e.target.value, 'ttrrr value')

        }
    }

}

export const getExpArr = () => { return arrExp }

export const columnsExp = [
    {
        title: 'ИД',
        dataIndex: 'id',
        width: 100,
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: 'Харажат моддаси',
        dataIndex: 'code',
        width: 150,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.code.length - b.code.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
        render: (text, record) =>
            /*{
                console.log(text,'text');
                console.log(record,'rec');
            }*/
            record.isleaf === 'Y' ? (
                text
            ) : (
                <b>{text}</b>
            ),
    },
    {
        title: 'Номи',
        dataIndex: 'name',
        width: 400,
        sorter: (a, b) => a.name.length - b.name.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
        render: (text, record) =>
            /*{
                console.log(text,'text');
                console.log(record,'rec');
            }*/
            record.isleaf === 'Y' ? (
                /*<Tooltip placement="bottomRight" title={text}>*/
                    text
                /*</Tooltip>*/

            ) : (
                /*<Tooltip placement="bottomRight" title={text}>*/
                    <b>{text}</b>
                /*</Tooltip>*/
            ),
    },
    {
        title: 'Юкори модда',
        dataIndex: 'parent',
        width: 150,
        sorter: (a, b) => a.parent.length - b.parent.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
        render: (text, record) =>
            record.isleaf === 'Y' ? (
                text
            ) : (
                <b>{text}</b>
            ),
    },
    {
        title: 'Сумма',
        dataIndex: 'sumpayexp',
        width: 200,
        align: "right",
        editable: true,
        render: (text, record) =>
            record.isleaf === 'Y' ? (
                text
                //<Input type="text" defaultValue="0" onClick={(e)=>{ e.target.select() }} onBlur={ (e) => {handleExpChange(e,record)} } style={{textAlign:"right"}}/>
            ) : (
                <b>{text}</b>
                //<Input type="text" key={record.parent} data-parent={record.parent} disabled={true} value="0" style={{textAlign:"right", fontWeight:"bold"}}/>
            ),
    },

    /*{
        title: 'isleaf',
        dataIndex: 'isleaf',
        width: 150,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.isleaf.length - b.isleaf.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },*/
    /*{
        title: 'Создал',
        dataIndex: 'created_by',
        width: 100,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.created_by - b.created_by,
    },
    {
        title: 'Дата создания',
        dataIndex: 'created_date',
        width: 100,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.created_date - b.created_date,
    },
    {
        title: 'Изменил',
        dataIndex: 'modified_by',
        width: 100,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.modified_by - b.modified_by,
    },
    {
        title: 'Дата изменения',
        dataIndex: 'modified_date',
        width: 100,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.modified_date - b.modified_date,
    },*/
];

//SMETAEXPENSE TAB END

export const dataSmetaType = {
    "query": {
        "id": "SMETA_TYPE_REF",
        "source": "SMETA_TYPE_REF",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "name", "format": "text", "type": "text" },
        ],
        //filters: [{"column":"id","operator":"=","value":1,"dataType":"number"}]
    }
}

export const dataSmetaExcel = {
    "query": {
        "id": "GET_SMETA_EXPENSES_EXCEL_BY_ID",
        "source": "GET_SMETA_EXPENSES_EXCEL_BY_ID",
        "fields": [
            {   "column": "code", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "quart1", "format": "number", "type": "number" },
            {   "column": "totalquart1", "format": "number", "type": "number" },
            {   "column": "quart2", "format": "number", "type": "number" },
            {   "column": "totalquart2", "format": "number", "type": "number" },
            {   "column": "quart3", "format": "number", "type": "number" },
            {   "column": "totalquart3", "format": "number", "type": "number" },
            {   "column": "quart4", "format": "number", "type": "number" },
            {   "column": "totalquart4", "format": "number", "type": "number" },
            {   "column": "istotal", "format": "text", "type": "text" },

        ]
    }
}



