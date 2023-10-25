export const dataTab = {
    "query": {
        "id": "GET_CONTRACTS_BY_EMP_ID_UI_V",
        "source": "GET_CONTRACTS_BY_EMP_ID_UI_V",
        "fields": [
            {   "column": "finyear", "format": "number", "type": "number" },
            {   "column": "filial", "format": "text", "type": "text" },
            {   "column": "filial_name", "format": "text", "type": "text" },
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "parent_id", "format": "number", "type": "number" },
            {   "column": "accid", "format": "number", "type": "number" },
            {   "column": "acc", "format": "text", "type": "text" },
            {   "column": "acc_name", "format": "text", "type": "text" },
            {   "column": "doc_type", "format": "number", "type": "number" },
            {   "column": "numb_contr", "format": "text", "type": "text" },
            {   "column": "date_contr", "format": "text", "type": "text" },
            {   "column": "date_begin", "format": "text", "type": "text" },
            {   "column": "date_end", "format": "text", "type": "text" },
            {   "column": "sum_pay", "format": "number", "type": "number" },
            {   "column": "nds", "format": "number", "type": "number" },
            {   "column": "sum_avans", "format": "number", "type": "number" },
            {   "column": "date_avans", "format": "text", "type": "text" },
            {   "column": "reg_date", "format": "text", "type": "text" },
            {   "column": "reg_numb", "format": "text", "type": "text" },
            {   "column": "currency", "format": "text", "type": "text" },
            {   "column": "purpose", "format": "text", "type": "text" },
            {   "column": "delivery_time", "format": "number", "type": "number" },
            {   "column": "vendor_id", "format": "number", "type": "number" },
            {   "column": "vendor_inn", "format": "text", "type": "text" },
            {   "column": "vendor_pinfl", "format": "text", "type": "text" },
            {   "column": "vendor_name", "format": "text", "type": "text" },
            {   "column": "vendor_bank_code", "format": "text", "type": "text" },
            {   "column": "vendor_bank_acc", "format": "text", "type": "text" },
            {   "column": "state", "format": "number", "type": "number" },
            {   "column": "state_name", "format": "text", "type": "text" },
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
    { "column": "parent_id", "label": "Юкори ИД", "operator": "=", "datatype":"number"},
    { "column": "filial", "label": "Филиал", "operator": "=", "datatype":"text", "type":"S","typeRef":"FILIAL"},
    { "column": "acc", "label": "Хисоб ракам", "operator": "_like_", "datatype":"text"},
    { "column": "vendor_inn", "label": "Таъминотчи ИНН", "operator": "=", "datatype":"text"},
    { "column": "purpose", "label": "Тафсилотлар", "operator": "_like_", "datatype":"text"},
    { "column": "sum_pay", "label": "Сумма", "operator": "=", "datatype":"number"},
    { "column": "doc_type", "label": "Хужжат тури", "operator": "=", "datatype":"text"},
    { "column": "state", "label": "Холат", "operator": "in", "datatype":"number", "type":"M","typeRef":"DOCSTATE","paramRef":"CONTRACT"},
]

export const dataSmetaExpOnlyTab = {
    "query": {
        "id": "SMETA_EXPENSES_ONLY_BY_FINYEAR_ACC_V",
        "source": "SMETA_EXPENSES_ONLY_BY_FINYEAR_ACC_V",
        "fields": [
            {
                "column": "finyear",
                "format": "number",
                "type": "number"
            },
            {
                "column": "acc",
                "format": "text",
                "type": "text"
            },
            {
                "column": "expense",
                "format": "text",
                "type": "text"
            }
        ]
    }
}

export const dataExpTab = {
    "query": {
        "id": "EXPENSE_REF",
        "source": "EXPENSE_REF",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "code", "format": "text", "type": "text" },
            {   "column": "parent", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "isleaf", "format": "text", "type": "text" },
            {   "column": "created_by", "format": "number", "type": "number" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            {   "column": "modified_date", "format": "text", "type": "text" }
        ],
        "filters": [{
            "column": "isleaf",
            "operator": "=",
            "value": "Y",
            "dataType": "text"
        }]
    }
}

export const columnsExp = (t) => [
    {
        title: t('id'),
        dataIndex: 'id',
        width: 100,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: t('expCode'),
        dataIndex: 'code',
        width: 150,
        sorter: (a, b) => a.code.length - b.code.length,
        ellipsis: true,
    },
    {
        title: t('name'),
        dataIndex: 'name',
        width: 400,
        sorter: (a, b) => a.name.length - b.name.length,
        ellipsis: true,
    },
];

export const dataExpFilter = [
    { "column": "id", "label": "ИД", "operator": "=", "datatype":"number"},
    { "column": "code", "label": "Харажат моддаси", "operator": "=", "datatype":"text"},
    { "column": "name", "label": "Номи", "operator": "text", "datatype":"text"}

]

export const dataGoodsTab = {
    "query": {
        "id": "GOODS_EXPENSES_V",
        "source": "GOODS_EXPENSES_V",
        "fields": [
            {   "column": "good_id", "format": "number", "type": "number" },
            {   "column": "code", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "short_name", "format": "text", "type": "text" },
            {   "column": "is_leaf", "format": "text", "type": "text" },
            {   "column": "unit", "format": "text", "type": "text" },
            {   "column": "unit_id", "format": "number", "type": "number" },
            {   "column": "category", "format": "text", "type": "text" },
            {   "column": "expense", "format": "text", "type": "text" },
        ],
        /*"filters": [{
            "column": "expense",
            "operator": "=",
            "value": "Y",
            "dataType": "text"
        }]*/
    }
}

export const columnsGoods = (t) => [
    {
        title: t('id'),
        dataIndex: 'good_id',
        width: 150,
        sorter: (a, b) => a.good_id - b.good_id,
        ellipsis: true,
    },
    {
        title: t('code'),
        dataIndex: 'code',
        width: 150,
        sorter: (a, b) => a.code.length - b.code.length,
        ellipsis: true,
    },
    {
        title: t('name'),
        dataIndex: 'name',
        width: 400,
        sorter: (a, b) => a.name.length - b.name.length,
        ellipsis: true,
        /*render: (text, record) => {
            let jsonb = JSON.parse(text.value) //MULTILANG
            return jsonb.RU
        }*/

    },
    {
        title: t('unit'),
        dataIndex: 'unit',
        width: 100,
        sorter: (a, b) => a.unit.length - b.unit.length,
        ellipsis: true,
    },
];

export const dataGoodsFilter = [
    { "column": "name", "label": "Товар номи", "operator": "_like_", "datatype":"text"},
    { "column": "code", "label": "Коди", "operator": "=", "datatype":"text"}

]

export const dataSmetaUsedSumExp = {
    "query": {
        "id": "SMETA_EXECUTE_BY_EXPENSE_MONTH_V",
        "source": "SMETA_EXECUTE_BY_EXPENSE_MONTH_V",
        "fields": [
            {"column": "acc", "format": "text", "type": "text"},
            {"column": "expense", "format": "text", "type": "text"},
            {"column": "month", "format": "number", "type": "number"},
            {"column": "smeta", "format": "number", "type": "number"},
            {"column": "paysum", "format": "number", "type": "number"},
            {"column": "sum_contract", "format": "number", "type": "number"},
            {"column": "sum_cash_app", "format": "number", "type": "number"},
        ]
    }
}