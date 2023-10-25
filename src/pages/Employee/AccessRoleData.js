import role from "../../dist/Role";

export const dataTab = {
    "query": {
        "id": "ROLE_CATALOG",
        "source": "ROLE_CATALOG",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "name", "format": "text", "type": "text" },
        ],
    }
}

export const roleTransferTab = {
    "query": {
        "id": "ACCESS_EMP_ROLE_TRANSFER_V",
        "source": "ACCESS_EMP_ROLE_TRANSFER_V",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "empid", "format": "number", "type": "number" },
            {   "column": "chosen", "format": "text", "type": "text" },
        ],
    }
}