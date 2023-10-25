export const dataTab = {
    "query": {
        "id": "INVOICES",
        "source": "INVOICES",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "fin_year", "format": "number", "type": "number" },
            {   "column": "filial", "format": "text", "type": "text" },
            //{   "column": "filial_name", "format": "text", "type": "text" },
            {   "column": "contract_id", "format": "number", "type": "number" },
            {   "column": "acc", "format": "text", "type": "text" },
            {   "column": "acc_id", "format": "number", "type": "number" },
            {   "column": "doc_numb", "format": "number", "type": "number" },
            {   "column": "doc_date", "format": "text", "type": "text" },
            //{   "column": "acc_name", "format": "text", "type": "text" },
            {   "column": "nds_reg_numb", "format": "text", "type": "text" },
            {   "column": "doc_type", "format": "number", "type": "number" },
            {   "column": "incom_type", "format": "number", "type": "number" },
            {   "column": "vendor_id", "format": "number", "type": "number" },
            {   "column": "vendor_name", "format": "text", "type": "text" },
            {   "column": "vendor_address", "format": "text", "type": "text" },
            {   "column": "vendor_phone", "format": "text", "type": "text" },
            {   "column": "vendor_bank_code", "format": "text", "type": "text" },
            {   "column": "vendor_bank_acc", "format": "text", "type": "text" },
            {   "column": "vendor_chief", "format": "text", "type": "text" },
            {   "column": "vendor_bookkeeper", "format": "text", "type": "text" },
            {   "column": "vendor_info", "format": "text", "type": "text" },
            {   "column": "vendor_inn", "format": "text", "type": "text" },
            {   "column": "vendor_pinfl", "format": "text", "type": "text" },
            {   "column": "good_release_person", "format": "text", "type": "text" },
            {   "column": "sum_pay", "format": "number", "type": "number" },
            {   "column": "state", "format": "number", "type": "number" },
//            {   "column": "state_name", "format": "text", "type": "text" },
//            {   "column": "action", "format": "number", "type": "number" },
            {   "column": "created_by", "format": "number", "type": "number" },
//            {   "column": "created_by_name", "format": "text", "type": "text" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
//            {   "column": "modified_by_name", "format": "text", "type": "text" },
            {   "column": "modified_date", "format": "text", "type": "text" }
        ]
    }
}

export const dataFilter = [
    { "column": "id", "label": "ИД", "operator": "=", "datatype":"number"},
    { "column": "doc_numb", "label": "Хужжат раками", "operator": "=", "datatype":"text"},
    { "column": "acc", "label": "Хисоб ракам", "operator": "_like_", "datatype":"text"},
    { "column": "filial", "label": "Филиал", "operator": "=", "datatype":"text","type":"S","typeRef":"FILIAL"},
    { "column": "sum_pay", "label": "Сумма", "operator": "=", "datatype":"number"},
    { "column": "state", "label": "Холат", "operator": "in", "datatype":"number","type":"M","typeRef":"DOCSTATE","paramRef":"INVOICE"}
]