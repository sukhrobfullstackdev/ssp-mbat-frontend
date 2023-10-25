import {
    ArrowDownOutlined,
    ArrowsAltOutlined,
    ArrowUpOutlined,
    EditOutlined,
    EyeOutlined,
    FormOutlined
} from "@ant-design/icons";
import {Button, Space, Tag, Tooltip} from "antd";
import { Link } from "react-router-dom";


export const dataTab = {
    "query": {
        "id": "GET_PAYDOCS_BY_EMP_ID_UI_V",
        "source": "GET_PAYDOCS_BY_EMP_ID_UI_V",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "cl_acc", "format": "text", "type": "text" },
            {   "column": "cl_mfo", "format": "number", "type": "number" },
            {   "column": "cl_inn", "format": "number", "type": "number" },
            {   "column": "cl_name", "format": "text", "type": "text" },
            {   "column": "co_acc", "format": "text", "type": "text" },
            {   "column": "co_mfo", "format": "number", "type": "number" },
            {   "column": "co_inn", "format": "number", "type": "number" },
            {   "column": "co_name", "format": "text", "type": "text" },
            {   "column": "sumpay", "format": "number", "type": "number" },
            {   "column": "direction", "format": "number", "type": "number" },
            {   "column": "doc_date", "format": "text", "type": "date" },
            {   "column": "bank_date", "format": "text", "type": "date" },
            {   "column": "acc", "format": "text", "type": "text" },
            {   "column": "accid", "format": "number", "type": "number" },
            {   "column": "doc_type", "format": "number", "type": "number" },
            {   "column": "finyear", "format": "number", "type": "number" },
            {   "column": "filial", "format": "text", "type": "text" },
            {   "column": "filial_name", "format": "text", "type": "text" },
            {   "column": "doc_numb", "format": "text", "type": "text" },
            {   "column": "is_avans", "format": "text", "type": "text" },
            {   "column": "purpose", "format": "text", "type": "text" },
            {   "column": "state", "format": "number", "type": "number" },
            {   "column": "state_name", "format": "text", "type": "text" },
            {   "column": "bank_doc_id", "format": "text", "type": "text" },
            {   "column": "bank_send_flag", "format": "number", "type": "number" },
            {   "column": "bank_send_flag_name", "format": "text", "type": "text" },
            {   "column": "contract_id", "format": "number", "type": "number" },
            {   "column": "cash_app_id", "format": "number", "type": "number" },
            {   "column": "cl_mfo_name", "format": "text", "type": "text" },
            {   "column": "co_mfo_name", "format": "text", "type": "text" },
            {   "column": "organ_chief", "format": "text", "type": "text" },
            {   "column": "organ_bookkeeper", "format": "text", "type": "text" },
            {   "column": "doc_type_name", "format": "text", "type": "text" },
            {   "column": "points_json", "format": "text", "type": "text" },
            {   "column": "source", "format": "text", "type": "text" },
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
    { "column": "filial", "label": "Филиал", "operator": "=", "datatype":"text", "type":"S","typeRef":"FILIAL"},
    { "column": "cl_acc", "label": "Туловчи Х.Р.", "operator": "_like_", "datatype":"text"},
    { "column": "cl_inn", "label": "Туловчи ИНН", "operator": "=", "datatype":"text"},
    { "column": "cl_mfo", "label": "Туловчи МФО", "operator": "=", "datatype":"text"},
    { "column": "co_acc", "label": "Олувчи Х.Р.", "operator": "_like_", "datatype":"text"},
    { "column": "co_inn", "label": "Олувчи ИНН", "operator": "=", "datatype":"text"},
    { "column": "co_mfo", "label": "Олувчи МФО", "operator": "=", "datatype":"text"},
    { "column": "purpose", "label": "Тулов максади", "operator": "_like_", "datatype":"text"},
    { "column": "sumpay", "label": "Сумма", "operator": "range", "datatype":"number", "type":"R"},
    { "column": "bank_doc_id", "label": "Банк ИД", "operator": "=", "datatype":"text"},
    { "column": "bank_date", "label": "Банк санаси", "operator": "range", "datatype":"date", "type":"R"},
    { "column": "doc_date", "label": "Хужжат санаси", "operator": "range", "datatype":"date", "type":"R"},
    { "column": "contract_id", "label": "Шартнома ИД", "operator": "=", "datatype":"number"},
    { "column": "cash_app_id", "label": "Сўровнома Ид", "operator": "=", "datatype":"number"},
    { "column": "direction", "label": "Кирим/Чиким", "operator": "=", "datatype":"number","type":"S","typeRef":"DIRECTION",},
    { "column": "state", "label": "Холат", "operator": "in", "datatype":"number", "type":"M","typeRef":"DOCSTATE","paramRef":"PAYDOC"},
]

export const columns = (t) => [
    {
        title: t('id'),
        dataIndex: 'id',
        width: 100,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: t('docNumb'),
        dataIndex: 'doc_numb',
        width: 100,
        sorter: (a, b) => a.doc_numb - b.doc_numb,
    },
    {
        title: t('docDate'),
        dataIndex: 'doc_date',
        width: 100,
        sorter: (a, b) => new Date(a.doc_date.split('.').reverse().join('-')) - new Date(b.doc_date.split('.').reverse().join('-')),
    },
    {
        title: t('bankDay'),
        dataIndex: 'bank_date',
        width: 100,
        sorter: (a, b) => new Date(a.bank_date.split('.').reverse().join('-')) - new Date(b.bank_date.split('.').reverse().join('-')),
    },
    {
        title: t('payerAcc'),
        dataIndex: 'cl_acc',
        width: 200,
        sorter: (a, b) => a.cl_acc.length - b.cl_acc.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: t('payerMfo'),
        dataIndex: 'cl_mfo',
        width: 200,
        sorter: (a, b) => a.cl_mfo.length - b.cl_mfo.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: t('payerInn'),
        dataIndex: 'cl_inn',
        width: 200,
        sorter: (a, b) => a.cl_inn.length - b.cl_inn.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: t('recipAcc'),
        dataIndex: 'co_acc',
        width: 200,
        sorter: (a, b) => a.co_acc.length - b.co_acc.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: t('recipMfo'),
        dataIndex: 'co_mfo',
        width: 200,
        sorter: (a, b) => a.co_mfo.length - b.co_mfo.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: t('recipInn'),
        dataIndex: 'co_inn',
        width: 200,
        sorter: (a, b) => a.co_inn.length - b.co_inn.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: t('sumpay'),
        dataIndex: 'sumpay',
        width: 100,
        sorter: (a, b) => a.sumpay - b.sumpay,
        render: (text) => parseFloat(text).toLocaleString("en-EN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    },
    {
        title: t('state'),
        dataIndex: 'state_name',
        width: 150,
        render: (text, record) => {
            return (
                <Space size="middle">
                {
                      record.state === 3 ? <Tag color='green-inverse' key={text}> {text.toUpperCase()} </Tag>
                    : record.state === 2 ? <Tag color='gold-inverse' key={text}> {text.toUpperCase()} </Tag>
                    : record.state === 4 ? <Tag color='red-inverse' key={text}> {text.toUpperCase()} </Tag>
                    : <Tag color='default' key={text}> {text.toUpperCase()} </Tag>
                }
                </Space>
            )
        },
        sorter: (a, b) => a.state_name.length - b.state_name.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: 'К/Ч',
        dataIndex: 'direction',
        width: 50,
        render: (text, record) => {
            return (
                <Space size="middle">
                    {
                        record.direction === 1 ? <ArrowDownOutlined style={{color: '#07b961'}}/>
                        : <ArrowUpOutlined  style={{color: '#ff0e0e'}}/>
                    }
                </Space>
            )
        },
        sorter: (a, b) => a.direction - b.direction,
    },
    {
        title: '',
        dataIndex: 'actions',
        width: 100,
        render: (_, record) => {
            return (
                <Space size="middle">
                    {record.state === 1 ?
                        <Tooltip title={"Таҳрирлаш"}>
                            <Link to={`edit/${record.id}`}>
                                <Button type="default" shape="circle" icon={<EditOutlined />} />
                            </Link>
                        </Tooltip> :
                     record.state === 10 ?
                            <Tooltip title={"Таҳрирлаш"}>
                                <Link to={`editBank/${record.id}/${record.state}`}>
                                    <Button type="default" shape="circle" icon={<FormOutlined />} />
                                </Link>
                            </Tooltip> :
                        <Tooltip title={"Кўриш"}>
                            <Link to={`edit/${record.id}`}>
                                <Button type="default" shape="circle" icon={<EyeOutlined />} />
                            </Link>
                        </Tooltip>
                    }
                </Space>
            );
        },
    },
];

export const dataPaydocExpTab = {
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

export const columnsPaydocExp = (t) => [
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
        title: t('name'),
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
        title: t('parentExpCode'),
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
        title: t('sumpay'),
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

export const dataPaydocExpFilter = [
    { "column": "id", "label": "ИД", "operator": "=", "datatype":"number"},
    { "column": "code", "label": "Харажат моддаси", "operator": "=", "datatype":"text"},
    { "column": "name", "label": "Номи", "operator": "text", "datatype":"text"}

]

export const dataContractIdTab = {
    "query": {
        "id": "CONTRACTS",
        "source": "CONTRACTS",
        "fields": [
            {   "column": "finyear", "format": "number", "type": "number" },
            {   "column": "filial", "format": "text", "type": "text" },
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "parent_id", "format": "number", "type": "number" },
            {   "column": "accid", "format": "number", "type": "number" },
            {   "column": "acc", "format": "text", "type": "text" },
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
            {   "column": "created_by", "format": "number", "type": "number" },
            //{   "column": "created_by_name", "format": "text", "type": "text" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            //{   "column": "modified_by_name", "format": "text", "type": "text" },
            {   "column": "modified_date", "format": "text", "type": "text" }
        ],
        filters: [
            {
                "column": 'state',
                "value": 1,
                "operator": '=',
                "dataType": 'number',
            }
        ]
    }
}

export const columnsContractId = (t) => [
    {
        title: t('id'),
        dataIndex: 'id',
        width: 100,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: t('contrNumb'),
        dataIndex: 'numb_contr',
        width: 100,
        sorter: (a, b) => a.numb_contr - b.numb_contr,
    },
    {
        title: t('contrDate'),
        dataIndex: 'date_contr',
        width: 100,
        sorter: (a, b) => a.date_contr - b.date_contr,
    },
    {
        title: t('acc'),
        dataIndex: 'acc',
        width: 200,
        sorter: (a, b) => a.acc.length - b.acc.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: t('vendorName'),
        dataIndex: 'vendor_name',
        width: 200,
        sorter: (a, b) => a.vendor_name.length - b.vendor_name.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: t('sumpay'),
        dataIndex: 'sum_pay',
        width: 100,
        sorter: (a, b) => a.sum_pay - b.sum_pay,
        render: (text) => parseFloat(text).toLocaleString("en-EN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }),
    },
    {
        title: t('purpose'),
        dataIndex: 'purpose',
        width: 200,
        sorter: (a, b) => a.purpose.length - b.purpose.length,
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

];

export const dataContractIdFilter = [
    { "column": "id", "label": "ИД", "operator": "=", "datatype":"number"},
    { "column": "parent_id", "label": "Юкори ИД", "operator": "=", "datatype":"number"},
    { "column": "acc", "label": "Хисоб ракам", "operator": "_like_", "datatype":"text"},
    { "column": "purpose", "label": "Тафсилотлар", "operator": "_like_", "datatype":"text"},
    { "column": "sum_pay", "label": "Сумма", "operator": "=", "datatype":"number"},
    { "column": "doc_type", "label": "Хужжат тури", "operator": "=", "datatype":"text"},
    { "column": "state", "label": "Холат", "operator": "=", "datatype":"number"},
]

export const dataCashAppIdTab = {
    "query": {
        "id": "CASH_APPS",
        "source": "CASH_APPS",
        "fields": [
            {   "column": "fin_year", "format": "number", "type": "number" },
            {   "column": "filial", "format": "text", "type": "text" },
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "currency", "format": "text", "type": "text" },
            {   "column": "accid", "format": "number", "type": "number" },
            {   "column": "acc", "format": "text", "type": "text" },
            {   "column": "doc_numb", "format": "number", "type": "number" },
            {   "column": "doc_date", "format": "text", "type": "text" },
            {   "column": "month", "format": "number", "type": "number" },
            {   "column": "sum_pay", "format": "number", "type": "number" },
            {   "column": "sum_transit", "format": "number", "type": "number" },
            {   "column": "co_mfo", "format": "number", "type": "number" },
            {   "column": "co_acc", "format": "text", "type": "text" },
            {   "column": "co_inn", "format": "text", "type": "text" },
            {   "column": "co_name", "format": "text", "type": "text" },
            {   "column": "state", "format": "number", "type": "number" },
            {   "column": "action", "format": "number", "type": "number" },
            {   "column": "purpose", "format": "text", "type": "text" },
            {   "column": "created_by", "format": "number", "type": "number" },
            //{   "column": "created_by_name", "format": "text", "type": "text" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            //{   "column": "modified_by_name", "format": "text", "type": "text" },
            {   "column": "modified_date", "format": "text", "type": "text" }
        ]
    }
}

export const columnsCashAppId = (t) => [
    {
        title: t('id'),
        dataIndex: 'id',
        width: 100,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: t('cashAppNumb'),
        dataIndex: 'doc_numb',
        width: 100,
        sorter: (a, b) => a.doc_numb - b.doc_numb,
    },
    {
        title: t('cashAppDate'),
        dataIndex: 'doc_date',
        width: 100,
        sorter: (a, b) => a.doc_date - b.doc_date,
    },
    {
        title: t('acc'),
        dataIndex: 'acc',
        width: 200,
        sorter: (a, b) => a.acc.length - b.acc.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: t('sumpay'),
        dataIndex: 'sum_pay',
        width: 100,
        sorter: (a, b) => a.sum_pay - b.sum_pay,
    },
    {
        title: t('month'),
        dataIndex: 'month',
        width: 100,
        sorter: (a, b) => a.month - b.month,
    },
    {
        title: t('state'),
        dataIndex: 'state',
        width: 200,
        sorter: (a, b) => a.state.length - b.state.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
        title: t('purpose'),
        dataIndex: 'purpose',
        width: 200,
        sorter: (a, b) => a.purpose.length - b.purpose.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        ellipsis: true,
    },

];

export const dataCashAppIdFilter = [
    { "column": "id", "label": "ИД", "operator": "=", "datatype":"number"},
    { "column": "doc_numb", "label": "Хужжат раками", "operator": "=", "datatype":"text"},
    { "column": "acc", "label": "Хисоб ракам", "operator": "_like_", "datatype":"text"},
    { "column": "purpose", "label": "Тафсилотлар", "operator": "_like_", "datatype":"text"},
    { "column": "sum_pay", "label": "Сумма", "operator": "=", "datatype":"number"},
    { "column": "state", "label": "Холат", "operator": "=", "datatype":"number"},
]