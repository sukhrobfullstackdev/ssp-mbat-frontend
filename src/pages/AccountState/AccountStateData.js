export const dataAccStateTab = {
    "query": {
        "id": "SMETA_EXECUTE_HIERARCHICAL_CUMULATIVE_BY_MONTH_V",
        "source": "SMETA_EXECUTE_HIERARCHICAL_CUMULATIVE_BY_MONTH_V",
        "fields": [
            {   "column": "acc", "format": "text", "type": "text" },
            {   "column": "expense", "format": "text", "type": "text" },
            {   "column": "expname", "format": "text", "type": "text" },
            {   "column": "month", "format": "number", "type": "number" },
            {   "column": "smeta", "format": "number", "type": "number" },
            {   "column": "sum_contract", "format": "number", "type": "number" },
            {   "column": "sum_cash_app", "format": "number", "type": "number" },
            {   "column": "smeta_contract_saldo", "format": "number", "type": "number" },
            {   "column": "contract_payment_saldo", "format": "number", "type": "number" },
            {   "column": "sumpay", "format": "number", "type": "number" },
            {   "column": "isleaf", "format": "text", "type": "text" },
        ]
    }
}

export const dataAccStateFilter = [
    { "column": "expense", "label": "Харажат моддаси", "operator": "=", "datatype":"text"},
]

export const columnsAccState = [
    {
        title: 'Харажат моддаси номи',
        dataIndex: 'expname',
        width: 400,

        sorter: (a, b) => a.expname.length - b.expname.length,
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
        title: 'Харажат моддаси',
        dataIndex: 'expense',
        width: 100,
        sorter: (a, b) => a.expense - b.expense,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
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
/*    {
        title: 'Ой',
        dataIndex: 'month',
        width: 200,
        sorter: (a, b) => a.month - b.month,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,

    },*/
    {
        title: 'Смета',
        dataIndex: 'smeta',
        width: 100,
        align: "right",
        sorter: (a, b) => a.smeta.length - b.smeta.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
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
        title: 'Харажат',
        dataIndex: 'sumpay',
        width: 100,
        align: "right",
        sorter: (a, b) => a.sumpay.length - b.sumpay.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
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
        title: 'Смета буйича колдик',
        dataIndex: 'smeta_contract_saldo',
        width: 100,
        align: "right",
        sorter: (a, b) => a.smeta_contract_saldo.length - b.smeta_contract_saldo.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
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
        title: 'Харажат буйича колдик',
        dataIndex: 'contract_payment_saldo',
        width: 100,
        align: "right",
        sorter: (a, b) => a.contract_payment_saldo.length - b.contract_payment_saldo.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
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
        title: 'Шартнома',
        dataIndex: 'sum_contract',
        width: 100,
        align: "right",
        sorter: (a, b) => a.sum_contract.length - b.sum_contract.length,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
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
        title: 'Суровнома',
        dataIndex: 'sum_cash_app',
        width: 100,
        align: "right",
        sorter: (a, b) => a.sum_cash_app - b.sum_cash_app,
        //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
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
];

export const dataMonitorAccTab = {
    "query": {
        "id": "GET_ACCOUNT_SALDO_BY_EMP_ID_UI_V",
        "source": "GET_ACCOUNT_SALDO_BY_EMP_ID_UI_V",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "acc_id", "format": "number", "type": "number" },
            {   "column": "acc", "format": "text", "type": "text" },
            {   "column": "mfo", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "filial", "format": "text", "type": "text" },
            {   "column": "filial_name", "format": "text", "type": "text" },
            {   "column": "created_by", "format": "number", "type": "number" },
            {   "column": "created_by_name", "format": "text", "type": "text" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            {   "column": "modified_by_name", "format": "text", "type": "text" },
            {   "column": "modified_date", "format": "text", "type": "text" },
            {   "column": "state", "format": "number", "type": "number" },
            {   "column": "state_name", "format": "text", "type": "text" },
            {   "column": "saldo_in", "format": "number", "type": "number" },
            {   "column": "debet", "format": "number", "type": "number" },
            {   "column": "credit", "format": "number", "type": "number" },
            {   "column": "saldo_out", "format": "number", "type": "number" },
            {   "column": "oper_day", "format": "date", "type": "date" }
        ]
    }
}

export const dataMonitorAccFilter = [
    { "column": "acc", "label": "Хисоб ракам", "operator": "=", "datatype":"text"},
    { "column": "oper_day", "label": "Сана", "operator": "=", "datatype":"date"},
    { "column": "filial", "label": "Филиал коди", "operator": "=", "datatype":"text"}
]

export const dataAccSaldoPeriodTab = {
    "query": {
        "id": "GET_ACCOUNT_SALDO_CURRENT_BY_EMP_ID_UI_V",
        "source": "GET_ACCOUNT_SALDO_CURRENT_BY_EMP_ID_UI_V",
        "fields": [
            //{   "column": "id", "format": "number", "type": "number" },
            {   "column": "acc_id", "format": "number", "type": "number" },
            {   "column": "acc_type", "format": "number", "type": "number" },
            {   "column": "acc_type_name", "format": "text", "type": "text" },
            {   "column": "account", "format": "text", "type": "text" },
            {   "column": "account_name", "format": "text", "type": "text" },
            {   "column": "saldo_in", "format": "number", "type": "number" },
            {   "column": "debet", "format": "number", "type": "number" },
            {   "column": "credit", "format": "number", "type": "number" },
            {   "column": "saldo_out", "format": "number", "type": "number" },
            {   "column": "last_operday", "format": "text", "type": "text" }
        ]
    }
}

export const dataAccSaldoPeriodFilter = [
    { "column": "account", "label": "Хисоб ракам", "operator": "_like_", "datatype":"text"},
    { "column": "last_operday", "label": "Сана", "operator": "=", "datatype":"date"},
    { "column": "account_name", "label": "Хисоб ракам номи", "operator": "_like_", "datatype":"text"}
]

export const dataSmetaExecuteTab = {
    "query": {
        "id": "GET_SMETA_EXECUTE_BY_EXPENSE_MONTH_HORIZONTAL_BY_EMP_ID",
        "source": "GET_SMETA_EXECUTE_BY_EXPENSE_MONTH_HORIZONTAL_BY_EMP_ID",
        "fields": [
            {   "column": "acc", "format": "text", "type": "text" },
            {   "column": "acc_name", "format": "text", "type": "text" },
            {   "column": "expense", "format": "text", "type": "text" },
            {   "column": "expense_name", "format": "text", "type": "text" },
            {   "column": "year_smeta", "format": "number", "type": "number" },
            {   "column": "smeta_q1", "format": "number", "type": "number" },
            {   "column": "smeta_m1", "format": "number", "type": "number" },
            {   "column": "smeta_m2", "format": "number", "type": "number" },
            {   "column": "smeta_m3", "format": "number", "type": "number" },
            {   "column": "smeta_q2", "format": "number", "type": "number" },
            {   "column": "smeta_m4", "format": "number", "type": "number" },
            {   "column": "smeta_m5", "format": "number", "type": "number" },
            {   "column": "smeta_m6", "format": "number", "type": "number" },
            {   "column": "smeta_q3", "format": "number", "type": "number" },
            {   "column": "smeta_m7", "format": "number", "type": "number" },
            {   "column": "smeta_m8", "format": "number", "type": "number" },
            {   "column": "smeta_m9", "format": "number", "type": "number" },
            {   "column": "smeta_q4", "format": "number", "type": "number" },
            {   "column": "smeta_m10", "format": "number", "type": "number" },
            {   "column": "smeta_m11", "format": "number", "type": "number" },
            {   "column": "smeta_m12", "format": "number", "type": "number" },

            {   "column": "year_sumpay", "format": "number", "type": "number" },
            {   "column": "sumpay_q1", "format": "number", "type": "number" },
            {   "column": "sumpay_m1", "format": "number", "type": "number" },
            {   "column": "sumpay_m2", "format": "number", "type": "number" },
            {   "column": "sumpay_m3", "format": "number", "type": "number" },
            {   "column": "sumpay_q2", "format": "number", "type": "number" },
            {   "column": "sumpay_m4", "format": "number", "type": "number" },
            {   "column": "sumpay_m5", "format": "number", "type": "number" },
            {   "column": "sumpay_m6", "format": "number", "type": "number" },
            {   "column": "sumpay_q3", "format": "number", "type": "number" },
            {   "column": "sumpay_m7", "format": "number", "type": "number" },
            {   "column": "sumpay_m8", "format": "number", "type": "number" },
            {   "column": "sumpay_m9", "format": "number", "type": "number" },
            {   "column": "sumpay_q4", "format": "number", "type": "number" },
            {   "column": "sumpay_m10", "format": "number", "type": "number" },
            {   "column": "sumpay_m11", "format": "number", "type": "number" },
            {   "column": "sumpay_m12", "format": "number", "type": "number" },

            {   "column": "year_contract", "format": "number", "type": "number" },
            {   "column": "contract_q1", "format": "number", "type": "number" },
            {   "column": "contract_m1", "format": "number", "type": "number" },
            {   "column": "contract_m2", "format": "number", "type": "number" },
            {   "column": "contract_m3", "format": "number", "type": "number" },
            {   "column": "contract_q2", "format": "number", "type": "number" },
            {   "column": "contract_m4", "format": "number", "type": "number" },
            {   "column": "contract_m5", "format": "number", "type": "number" },
            {   "column": "contract_m6", "format": "number", "type": "number" },
            {   "column": "contract_q3", "format": "number", "type": "number" },
            {   "column": "contract_m7", "format": "number", "type": "number" },
            {   "column": "contract_m8", "format": "number", "type": "number" },
            {   "column": "contract_m9", "format": "number", "type": "number" },
            {   "column": "contract_q4", "format": "number", "type": "number" },
            {   "column": "contractm10", "format": "number", "type": "number" },
            {   "column": "contractm11", "format": "number", "type": "number" },
            {   "column": "contractm12", "format": "number", "type": "number" },

            {   "column": "year_cash_app", "format": "number", "type": "number" },
            {   "column": "cash_app_q1", "format": "number", "type": "number" },
            {   "column": "cash_app_m1", "format": "number", "type": "number" },
            {   "column": "cash_app_m2", "format": "number", "type": "number" },
            {   "column": "cash_app_m3", "format": "number", "type": "number" },
            {   "column": "cash_app_q2", "format": "number", "type": "number" },
            {   "column": "cash_app_m4", "format": "number", "type": "number" },
            {   "column": "cash_app_m5", "format": "number", "type": "number" },
            {   "column": "cash_app_m6", "format": "number", "type": "number" },
            {   "column": "cash_app_q3", "format": "number", "type": "number" },
            {   "column": "cash_app_m7", "format": "number", "type": "number" },
            {   "column": "cash_app_m8", "format": "number", "type": "number" },
            {   "column": "cash_app_m9", "format": "number", "type": "number" },
            {   "column": "cash_app_q4", "format": "number", "type": "number" },
            {   "column": "cash_appm10", "format": "number", "type": "number" },
            {   "column": "cash_appm11", "format": "number", "type": "number" },
            {   "column": "cash_appm12", "format": "number", "type": "number" },


        ]
    }
}


export const dataSmetaExecuteFilter = [
    { "column": "expense", "label": "Харажат моддаси", "operator": "_like_", "datatype":"text"},
    { "column": "acc", "label": "Хисоб ракам", "operator": "_like_", "datatype":"text"},
]