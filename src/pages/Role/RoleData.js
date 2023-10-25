export const dataTab = {
    "query": {
        "ID": "ROLES_UI_V",
        "source": "ROLES_UI_V",
        "fields": [
            {
                "column": "id", "format": "number", "type": "number" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "createdby", "format": "number", "type": "number" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "created_by_name", "format": "text", "type": "text" },
            {   "column": "modifiedby", "format": "number", "type": "number" },
            {   "column": "modified_date", "format": "text", "type": "text" },
            {   "column": "modified_by_name", "format": "text", "type": "text" },

        ]
    }
}

export const dataFilter = [
    { "column": "id", "label": "ИД", "operator": "=", "datatype":"number" },
    { "column": "name", "label": "Номи", "operator": "text", "datatype":"text"},
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
        title: 'Номи',
        dataIndex: 'name',
        fixed: 'left',
        width: 200,
        sorter: (a, b) => a.name.length - b.name.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'Яратди',
        dataIndex: 'createdby',
        width: 100,
        sorter: (a, b) => a.createdby - b.createdby,
        render: (text, record) => {
            return record.createdby + ' - ' + record.created_by_name
        }
    },
    {
        title: 'Яратилган сана',
        dataIndex: 'created_date',
        width: 100,
        sorter: (a, b) => a.created_date - b.created_date,
    },
    {
        title: 'Тахрирлади',
        dataIndex: 'modifiedby',
        width: 100,
        sorter: (a, b) => a.modifiedby - b.modifiedby,
        render: (text, record) => {
            return record.modifiedby + ' - ' + record.modified_by_name
        }
    },
    {
        title: 'Тахрирланган сана',
        dataIndex: 'modified_date',
        width: 100,
        sorter: (a, b) => a.modified_date - b.modified_date,
    },
];

