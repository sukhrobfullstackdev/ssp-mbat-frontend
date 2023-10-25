import role from "../../dist/Role";

export const dataTab = {
    "query": {
        "id": "MENU_SSP",
        "source": "MENU_SSP",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "parent_id", "format": "number", "type": "number" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "description", "format": "text", "type": "text" },
        ],
    }
}

export const accessMenuTab = {
    "query": {
        "id": "V_ACCESS_MENU",
        "source": "V_ACCESS_MENU",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "menu", "format": "number", "type": "number" },
            {   "column": "menuname", "format": "text", "type": "text" },
            {   "column": "description", "format": "text", "type": "text" },
        ],
    }
}

export const menuTransferTab = {
    "query": {
        "id": "V_MENU_TRANSFER",
        "source": "V_MENU_TRANSFER",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "parent_id", "format": "number", "type": "number" },
            {   "column": "roleid", "format": "number", "type": "number" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "description", "format": "text", "type": "text" },
            {   "column": "chosen", "format": "text", "type": "text" },
        ],
    }
}