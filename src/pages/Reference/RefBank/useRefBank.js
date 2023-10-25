import React, {useEffect, useState} from 'react';

import {message} from "antd";
import {ACCOUNT_TYPE} from "../../../store/types/references/accountType/accountType";
import {useDispatch, useSelector} from "react-redux";
import {BANK} from "../../../store/types/references/bank/bank";
import useTableActions from "../../../hooks/useTableActions";


const dataBankRef = {
    "query": {
        "id": "BANK_REF",
        "source": "BANK_REF",
        "fields": [
            {"column": "code", "format": "text", "type": "text"},
            {"column": "name", "format": "text", "type": "text"},
            {"column": "district", "format": "text", "type": "text"},
            {"column": "address", "format": "text", "type": "text"},
            {"column": "bank_type", "format": "text", "type": "text"},
            {"column": "state", "format": "number", "type": "number"},
            {"column": "created_by", "format": "number", "type": "number"},
            {"column": "created_date", "format": "text", "type": "text"},
            {"column": "modified_by", "format": "number", "type": "number"},
            {"column": "modified_date", "format": "text", "type": "text"}
        ]
    }
}
const useRefBank = (setTitleNav) => {
    const data = useSelector((state) => state.bank.data);
    const totalItems = useSelector((state) => state.bank.totalItems);
    const loading = useSelector((state) => state.bank.loading);
    const error = useSelector((state) => state.bank.error);
    const dispatch = useDispatch();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const {rowSelection, pagination, onRow} = useTableActions(totalItems, selectedRowKeys, setSelectedRow, setSelectedRowKeys);
    useEffect(() => {
        setTitleNav('Банклар маълумотномаси');
        getTabData();
    }, []);

    const getTabData = async (filter = '') => {
        let filters = [];
        if (filter !== '' && filter !== '{}') filters = filter;
        dataBankRef.query['filters'] = filters;
        dispatch({type: BANK, dataBankRef});
    };
    return {contextHolder, rowSelection, data, loading, pagination, onRow, selectedRow};
};

export default useRefBank;