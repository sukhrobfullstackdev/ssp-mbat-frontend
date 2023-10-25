import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {message} from "antd";
import useTableActions from "../../../hooks/useTableActions";
import {FILIAL} from "../../../store/types/references/filial/filial";

const dataFilialRef = {
    "query": {
        "id": "FILIAL_REF",
        "source": "FILIAL_REF",
        "fields": [
            {   "column": "code", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
            {   "column": "region", "format": "text", "type": "text" },
            {   "column": "territory", "format": "text", "type": "text" },
            {   "column": "created_by", "format": "number", "type": "number" },
            {   "column": "created_date", "format": "text", "type": "text" },
            {   "column": "modified_by", "format": "number", "type": "number" },
            {   "column": "modified_date", "format": "text", "type": "text" }
        ]
    }
};
const useRefFilial = (setTitleNav) => {
    const data = useSelector((state) => state.filial.data);
    const totalItems = useSelector((state) => state.filial.totalItems);
    const loading = useSelector((state) => state.filial.loading);
    const error = useSelector((state) => state.filial.error);
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
        dataFilialRef.query['filters'] = filters;
        dispatch({type: FILIAL, dataFilialRef});
    };
    return {contextHolder, rowSelection, data, loading, pagination, onRow, selectedRow};
};

export default useRefFilial;