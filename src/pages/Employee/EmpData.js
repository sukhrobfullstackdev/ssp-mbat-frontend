import {Badge, Space} from "antd";

export const dataTab = {
    "query": {
        "id": "EMPLOYEE_UI_V",
        "source": "EMPLOYEE_UI_V",
        "fields": [
            {   "column": "filial", "format": "text", "type": "text" },
            {   "column": "filial_name", "format": "text", "type": "text" },
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "fio", "format": "text", "type": "text" },
            {   "column": "login", "format": "text", "type": "text" },
            {   "column": "dateexpire", "format": "text", "type": "text" },
            {   "column": "dateopen", "format": "text", "type": "text" },
            {   "column": "cnttries", "format": "number", "type": "number" },
            {   "column": "deptlevel", "format": "number", "type": "number" },
            {   "column": "mobilenumber", "format": "text", "type": "text" },
            {   "column": "phonenumber", "format": "text", "type": "text" },
            {   "column": "staff", "format": "text", "type": "text" },
            {   "column": "struct", "format": "text", "type": "text" },
            {   "column": "state", "format": "number", "type": "number" },
            {   "column": "state_name", "format": "text", "type": "text" },
            {   "column": "created_by", "format": "number", "type": "number" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "created_by_name", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            {   "column": "modified_date", "format": "text", "type": "text" },
            {   "column": "modified_by_name", "format": "text", "type": "text" },
        ]
    }
}

export const dataFilter = [
    { "column": "id", "label": "ИД", "operator": "=", "datatype":"number" },
    { "column": "fio", "label": "Номи", "operator": "text", "datatype":"text"},
    { "column": "login", "label": "Логин", "operator": "text", "datatype":"text"},
    { "column": "filial", "label": "Филиал", "operator": "=", "datatype":"text","type":"S","typeRef":"FILIAL"},
    { "column": "state", "label": "Холат", "operator": "in", "datatype":"number","type":"M","typeRef":"DOCSTATE","paramRef":"EMPLOYEE"}
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
        title: 'Ф.И.Ш.',
        dataIndex: 'fio',
        fixed: 'left',
        width: 200,
        sorter: (a, b) => a.fio.length - b.fio.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    /*{
        title: 'Даража',
        dataIndex: 'deptLevel',
        width: 100,
    },
    {
        title: 'Тузилма',
        dataIndex: 'struct',
        width: 100,
    },*/
    {
        title: 'Булим',
        dataIndex: 'staff',
        width: 100,
    },
    {
        title: 'Логин',
        dataIndex: 'login',
        width: 100,
        sorter: (a, b) => a.login - b.login,
    },
    /*{
        title: 'Телефон ракам',
        ellipsis: true,
        dataIndex: 'phoneNumber',
        width: 100,
    },
    {
        title: 'Мобил тел. раками',
        ellipsis: true,
        dataIndex: 'mobileNumber',
        width: 100,
    },*/
    {
        title: 'Очилган сана',
        dataIndex: 'dateopen',
        ellipsis: true,
        width: 100,
        sorter: (a, b) => a.dateOpen - b.dateOpen,
    },
    {
        title: 'Фойдаланиш санаси',
        ellipsis: true,
        dataIndex: 'dateexpire',
        width: 100,
    },
    {
        title: 'Кириш уриниши',
        ellipsis: true,
        dataIndex: 'cnttries',
        width: 100,
    },
    {
        title: 'Холат',
        dataIndex: 'state_name',
        fixed: 'right',
        width: 100,
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
    },
];


export const dataFilialTab = {
    "query": {
        "id": "FILIAL_REF",
        "source": "FILIAL_REF",
        "fields": [
            {   "column": "code", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "territory", "format": "text", "type": "text" },
            {   "column": "region", "format": "text", "type": "text" },
            {   "column": "created_by", "format": "number", "type": "number" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            {   "column": "modified_date", "format": "text", "type": "text" }
        ]
    }
}

export const dataFilial = [
    {
        "code": "000",
        "name": "Марказий аппарат"
    },{
        "code": "573",
        "name": "Тошкент шахар"
    },{
        "code": "433",
        "name": "Андижон вилояти"
    },
];
export const dataStruct = [
    {
        "code": "0",
        "name": "Молия"
    },{
        "code": "1",
        "name": "Бухгалтерия"
    }
];
export const dataPosition = [
    {
        "code": "01000",
        "name": "Молиячи"
    },{
        "code": "01010",
        "name": "Бухгалтер"
    },{
        "code": "01030",
        "name": "Рахбар"
    }
]

