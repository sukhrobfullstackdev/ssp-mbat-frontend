import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {message} from "antd";
import useTableActions from "../../../hooks/useTableActions";
import {BANK_TYPE} from "../../../store/types/references/bankType/bankType";

const dataBankTypeRef = {
    "query": {
        "id": "BANK_TYPE_REF",
        "source": "BANK_TYPE_REF",
        "fields": [
            {   "column": "code", "format": "text", "type": "text" },
            {   "column": "country", "format": "text", "type": "text" },
            {   "column": "account_type", "format": "text", "type": "text" },
            {   "column": "short_name", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "state", "format": "number", "type": "number" },
        ]
    }
};
const useRefBankType = (setTitleNav) => {
    const data = useSelector((state) => state.bankType.data);
    const totalItems = useSelector((state) => state.bankType.totalItems);
    const loading = useSelector((state) => state.bankType.loading);
    const error = useSelector((state) => state.bankType.error);
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
        dataBankTypeRef.query['filters'] = filters;
        dispatch({type: BANK_TYPE, dataBankTypeRef});
    };
    return {contextHolder, rowSelection, data, loading, pagination, onRow, selectedRow};
};

export default useRefBankType;