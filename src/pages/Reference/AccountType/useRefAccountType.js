import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {message} from "antd";
import {ACCOUNT_TYPE} from "../../../store/types/references/accountType/accountType";
import useTableActions from "../../../hooks/useTableActions";


const dataAccountRef = {
    "query": {
        "id": "ACCOUNT_TYPE_REF",
        "source": "ACCOUNT_TYPE_REF",
        "fields": [
            {"column": "id", "format": "number", "type": "number"},
            {"column": "name", "format": "text", "type": "text"},
        ]
    }
};
const useRefAccountType = (setTitleNav) => {
    const data = useSelector((state) => state.accountType.data);
    const totalItems = useSelector((state) => state.accountType.totalItems);
    const loading = useSelector((state) => state.accountType.loading);
    const error = useSelector((state) => state.accountType.error);
    const dispatch = useDispatch();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const {rowSelection, pagination, onRow} = useTableActions(totalItems, selectedRowKeys, setSelectedRow, setSelectedRowKeys);
    const getTabData = async (filter = '') => {
        let filters = [];
        if (filter !== '' && filter !== '{}') filters = filter;
        dataAccountRef.query['filters'] = filters;
        dispatch({type: ACCOUNT_TYPE, dataAccountRef});
    };


    useEffect(() => {
        setTitleNav('Хисоб ракам маълумотномаси');
        getTabData();
    }, []);
    return {data, loading, contextHolder, rowSelection, pagination, onRow};
};

export default useRefAccountType;