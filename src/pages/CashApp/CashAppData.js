export const dataTab = {
    "query": {
        "id": "GET_CASH_APP_BY_EMP_ID_UI_V",
        "source": "GET_CASH_APP_BY_EMP_ID_UI_V",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "fin_year", "format": "number", "type": "number" },
            {   "column": "filial", "format": "text", "type": "text" },
            {   "column": "filial_name", "format": "text", "type": "text" },
            {   "column": "currency", "format": "text", "type": "text" },
            {   "column": "doc_numb", "format": "number", "type": "number" },
            {   "column": "doc_date", "format": "text", "type": "text" },
            {   "column": "accid", "format": "number", "type": "number" },
            {   "column": "acc", "format": "text", "type": "text" },
            {   "column": "acc_name", "format": "text", "type": "text" },
            {   "column": "month", "format": "number", "type": "number" },
            {   "column": "sum_pay", "format": "number", "type": "number" },
            {   "column": "sum_transit", "format": "number", "type": "number" },
            {   "column": "co_mfo", "format": "number", "type": "number" },
            {   "column": "co_acc", "format": "text", "type": "text" },
            {   "column": "co_inn", "format": "text", "type": "text" },
            {   "column": "co_name", "format": "text", "type": "text" },
            {   "column": "state", "format": "number", "type": "number" },
            {   "column": "state_name", "format": "text", "type": "text" },
            {   "column": "action", "format": "number", "type": "number" },
            {   "column": "purpose", "format": "text", "type": "text" },
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
    { "column": "id", "label": "ИД", "operator": "=", "datatype":"number"},
    { "column": "doc_numb", "label": "Хужжат раками", "operator": "=", "datatype":"text"},
    { "column": "acc", "label": "Хисоб ракам", "operator": "_like_", "datatype":"text"},
    { "column": "purpose", "label": "Тафсилотлар", "operator": "_like_", "datatype":"text"},
    { "column": "sum_pay", "label": "Сумма", "operator": "=", "datatype":"number"},
    { "column": "filial", "label": "Филиал", "operator": "=", "datatype":"text","type":"S","typeRef":"FILIAL"},
    { "column": "state", "label": "Холат", "operator": "in", "datatype":"number","type":"M","typeRef":"DOCSTATE","paramRef":"CASH_APP"}
]

export const dataCashAppExpTab = {
    "query": {
        "id": "V_EXPENSE_PAYDOC_REF",
        "source": "V_EXPENSE_PAYDOC_REF",
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

export const columnsCashAppExp = [
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
        title: 'Смета суммаси',
        dataIndex: 'smetaSum',
        key:'smetaSum',
        width: 200,
        align: "right",
        editable: true,
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

export const dataCashAppExpFilter = [
    { "column": "id", "label": "ИД", "operator": "=", "datatype":"number"},
    { "column": "code", "label": "Харажат моддаси", "operator": "=", "datatype":"text"},
    { "column": "name", "label": "Номи", "operator": "text", "datatype":"text"}

]