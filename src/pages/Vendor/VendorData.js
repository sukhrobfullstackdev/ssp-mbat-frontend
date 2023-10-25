export const dataTab = {
    "query": {
        "id": "VENDORS_UI_V",
        "source": "VENDORS_UI_V",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "inn", "format": "text", "type": "text" },
            {   "column": "pinfl", "format": "text", "type": "text" },
            {   "column": "is_resident", "format": "text", "type": "text" },
            {   "column": "country", "format": "text", "type": "text" },
            {   "column": "territory", "format": "text", "type": "text" },
            {   "column": "vendor_type", "format": "text", "type": "text" },
            {   "column": "okonh", "format": "text", "type": "text" },
            {   "column": "address", "format": "text", "type": "text" },
            {   "column": "address_jur", "format": "text", "type": "text" },
            {   "column": "size_status", "format": "text", "type": "text" },
            {   "column": "post_index", "format": "text", "type": "text" },
            {   "column": "phones", "format": "text", "type": "text" },
            {   "column": "fax", "format": "text", "type": "text" },
            {   "column": "gov_reg_date", "format": "text", "type": "text" },
            {   "column": "gov_reg_numb", "format": "text", "type": "text" },
            {   "column": "note", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "chief", "format": "text", "type": "text" },
            {   "column": "bookkeeper", "format": "text", "type": "text" },
            {   "column": "state", "format": "number", "type": "number" },
            {   "column": "state_name", "format": "text", "type": "text" },
            {   "column": "beneficiar", "format": "text", "type": "text" },
            {   "column": "created_by", "format": "number", "type": "number" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "created_by_name", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            {   "column": "modified_date", "format": "text", "type": "text" },
            {   "column": "modified_by_name", "format": "text", "type": "text" }
        ]
    }
}

export const dataFilter = [
    { "column": "id", "label": "ИД", "operator": "=", "datatype":"number"},
    { "column": "pinfl", "label": "ПИНФЛ", "operator": "=", "datatype":"text"},
    { "column": "inn", "label": "ИНН", "operator": "=", "datatype":"text"},
    { "column": "state", "label": "Холат", "operator": "in", "datatype":"number","type":"M","typeRef":"DOCSTATE","paramRef":"VENDOR"}


]

export const columnsVendor = [
    {
        title: 'ИД',
        dataIndex: 'id',
        width: 100,
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: 'ИНН',
        dataIndex: 'inn',
        width: 200,
        sorter: (a, b) => a.inn.length - b.inn.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'Номи',
        dataIndex: 'name',
        width: 200,
        sorter: (a, b) => a.name.length - b.name.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'Манзил',
        dataIndex: 'address',
        width: 200,
        sorter: (a, b) => a.address.length - b.address.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'Давлат руйхат раками',
        dataIndex: 'gov_reg_numb',
        width: 200,
        sorter: (a, b) => a.gov_reg_numb.length - b.gov_reg_numb.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'ПИНФЛ',
        dataIndex: 'pinfl',
        width: 200,
        sorter: (a, b) => a.pinfl.length - b.pinfl.length,
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

export const dataBank = {
    "query": {
        "id": "BANK_REF",
        "source": "BANK_REF",
        "fields": [
            {   "column": "code", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "district", "format": "text", "type": "text" },
            {   "column": "address", "format": "text", "type": "text" },
            {   "column": "bank_type", "format": "text", "type": "text" },
            {   "column": "state", "format": "number", "type": "number" },
            {   "column": "created_by", "format": "number", "type": "number" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            {   "column": "modified_date", "format": "text", "type": "text" }
        ]
    }
}

export const columnsBank = [
    {
        title: 'ИД',
        dataIndex: 'code',
        fixed: 'left',
        width: 100,
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: 'Номи',
        dataIndex: 'name',
        fixed: 'left',
        width: 200,
        sorter: (a, b) => a.name.length - b.name.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'Худуд',
        dataIndex: 'district',
        fixed: 'left',
        width: 200,
        sorter: (a, b) => a.district - b.district,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'Манзил',
        dataIndex: 'address',
        fixed: 'left',
        width: 200,
        sorter: (a, b) => a.address.length - b.address.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },

];

export const dataBankFilter = [
    { "column": "code", "label": "Коди", "operator": "=", "datatype":"text"},
    { "column": "name", "label": "Номи", "operator": "_like_", "datatype":"text"}
]

export const dataVendorBankAccTab = {
    "query": {
        "id": "VENDOR_BANK_ACCOUNTS",
        "source": "VENDOR_BANK_ACCOUNTS",
        "fields": [
            {   "column": "vendor_id", "format": "number", "type": "number" },
            {   "column": "mfo", "format": "text", "type": "text" },
            {   "column": "account", "format": "text", "type": "text" },
        ]
    }
}

export const columnsVendorBankAcc = [
    {
        title: 'vendor_id',
        dataIndex: 'vendor_id',
        width: 100,
        sorter: (a, b) => a.vendor_id - b.vendor_id,
    },
    {
        title: 'Банк коди',
        dataIndex: 'mfo',
        width: 200,
        sorter: (a, b) => a.mfo - b.mfo,
        ellipsis: true,
    },
    {
        title: 'Хисоб ракам',
        dataIndex: 'account',
        width: 200,
        sorter: (a, b) => a.account - b.account,
        ellipsis: true,
    }
];

export const dataTerritoryRef = {
    "query": {
        "id": "TERRITORY_REF",
        "source": "TERRITORY_REF",
        "fields": [
            {   "column": "code", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "parent", "format": "text", "type": "text" },
            {   "column": "region", "format": "text", "type": "text" },
            {   "column": "type", "format": "text", "type": "text" },
            {   "column": "state", "format": "number", "type": "number" },
            {   "column": "created_by", "format": "number", "type": "number" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            {   "column": "modified_date", "format": "text", "type": "text" }
        ]
    }
}

export const columnsTerritoryRef = [
    {
        title: 'Коди',
        dataIndex: 'code',
        width: 100,
        sorter: (a, b) => a.code - b.code,
    },
    {
        title: 'Номи',
        dataIndex: 'name',
        width: 200,
        sorter: (a, b) => a.name - b.name,
    },
    {
        title: 'Вилоят',
        dataIndex: 'region',
        width: 200,
        sorter: (a, b) => a.region - b.region,
    }
];

export const dataTerritoryFilter = [
    { "column": "code", "label": "Коди", "operator": "=", "datatype":"text"},
    { "column": "name", "label": "Номи", "operator": "_like_", "datatype":"text"},
    { "column": "region", "label": "Вилоят", "operator": "_like_", "datatype":"text"}
]