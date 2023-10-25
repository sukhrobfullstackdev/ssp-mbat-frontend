import { Table, Tag } from 'antd';
import {useContext, useEffect, useState} from 'react';
import axios from "../api/axios";
import {AuthContext} from "../context/AuthContext";

const QUERY_URL = '/api/public/query';

const columns = [
    {
        title: 'Группа',
        key: 'expense_grp',
        dataIndex: 'expense_grp',
        render: (value) =>
                {
                    let color = 'gray';
                    if (value === '1')  color = 'geekblue'
                    if (value === '2')  color = 'green'
                    if (value === '4')  color = 'orange'

                    return (
                        <span>
                            <Tag color={color} key={value}>
                                    {   ( value === '0' )?'Жами':value + ' гурух' }
                            </Tag>
                        </span>
                    );

            }
    },
    {
        title: 'Смета',
        dataIndex: 'year_smeta',
        key: 'smeta',
        align: 'right',
        render: (value) =>
            parseFloat(value).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
    },
    {
        title: 'Юридик мажбурият',
        dataIndex: 'year_contract',
        key: 'finob',
        align: 'right',
        render: (value) =>
            parseFloat(value).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
    },
    {
        title: 'Туловлар',
        dataIndex: 'year_sumpay',
        key: 'paydoc',
        align: 'right',
        render: (value) =>
            parseFloat(value).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
    },
    {
        title: 'Суровнома',
        dataIndex: 'year_cash_app',
        key: 'cash_app',
        align: 'right',
        render: (value) =>
            parseFloat(value).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
    }

];

const dataAggregate = {
    "query": {
        "ID": "GET_AGGREGATIONS_BY_EXPGROUP_GROUPED_BY_FILIAL_FOR_EMP_ID",
        "source": "GET_AGGREGATIONS_BY_EXPGROUP_GROUPED_BY_FILIAL_FOR_EMP_ID",
        "fields": [
            {   "column": "filial", "format": "number", "type": "number" },
            {   "column": "expense_grp", "format": "text", "type": "text" },
            {   "column": "year_smeta", "format": "text", "type": "text" },
            {   "column": "year_sumpay", "format": "text", "type": "text" },
            {   "column": "year_contract", "format": "text", "type": "text" },
            {   "column": "year_cash_app", "format": "text", "type": "text" },
            {   "column": "ordnumb", "format": "number", "type": "number" },
        ]
    }
}

const HomeTable = () => {

    const auth = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [aggregateData, setAggregateData] = useState([]);

    const headers = {'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const getAggregateData = async (filter = '') => {

        dataAggregate.query.source = "GET_AGGREGATIONS_BY_EXPGROUP_GROUPED_BY_FILIAL_FOR_EMP_ID("+auth.empId+")"

        console.log(dataAggregate, 'dataagrree')

        const { data } = await axios.post(QUERY_URL,
            ( dataAggregate ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        setLoading(false);
        console.log(data, 'dataagrree')
        setAggregateData(data);

    };

    useEffect(()=>{
        getAggregateData()
    },[])

    return (
        <div>
            <Table
                columns={columns}
                dataSource={aggregateData}
                pagination={false}
            />
        </div>
    );
};
export default HomeTable;