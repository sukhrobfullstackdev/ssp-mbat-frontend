import {Button, DatePicker, Layout, message, Table, Tag} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import "../../custombm.css";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import {dataAccStateFilter, columnsAccState, dataAccStateTab } from "./AccountStateData";
import FilterModal from "../../components/FilterModalBM";
import {LeftOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import 'dayjs/locale/uz';
import locale from 'antd/locale/ru_RU';
import {useFilter} from "../../context/FilterContext";



//import {getDataBooks} from "../../services/index"

const QUERY_URL = '/api/public/query';


const AccountStateTab = ({selAcc}) => {

    let navigate = useNavigate();

    const auth = useContext(AuthContext);

    const { filterValues } = useFilter();
    const filterKey = 'accountStateTabFilter'; // Set the filterKey for this route
    const filterData = filterValues[filterKey] || '';

    const [stateTab, setStateTab] = useState([]);
    const [filterTab, setFilterTab] = useState("");
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(dayjs());


    const headers = {'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    let location = useLocation();
    const accCode = selAcc.acc;
    const accName = selAcc.accName;

    const getTabData = async (filter = '') => {

        setLoading(true)
        let filters = [];
        if (filter!=='' && filter!== '{}') filters = filter
        //console.log(dataTab.toString(),'dataTab')
        if (filterData && filters.length === 0) {
            filters = [...filters, ...filterData];
        }

        dataAccStateTab.query['filters'] = filters;
        let targetMonth = month.$M+1

        dataAccStateTab.query['filters'].push( { "column": "acc", "value": accCode, "operator": "=", "dataType": "text" }) //Obyazatelnoe pole
        if (month !== 0) dataAccStateTab.query['filters'].push( { "column": "month", "value": targetMonth, "operator": "=", "dataType": "number" })

        const { data } = await axios.post(QUERY_URL,
            ( dataAccStateTab ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });

        setStateTab(data);
        setLoading(false);

        setFilterTab( dataAccStateFilter );

    };

    useEffect(() => {
        getTabData();
    }, [month, selAcc.acc]);

    const onChangeMonth = (date, dateString) => {
        setMonth(date);
    }

    const pagination = {
        total: stateTab.length,
        showTotal: (total, range) => (
            <span>
                <strong>{total}</strong> катордан {range[0]}-{range[1]} гача
            </span>
        ),
        pageSize: 200,
        size: 'small',
        defaultCurrent: 1,
        position: ['topRight'],
        hideOnSinglePage:false,
    };

    return (

        <Layout style={{height:"100%", overflow:"hidden"}}>
            <div>
                <div style={{display:"flex", flexDirection:"row", gap:"4px", height:"64px", justifyContent: "left", alignItems:"center", padding:"6px"}}>
                    <DatePicker onChange={onChangeMonth} picker="month" defaultValue={month}/>
                    <FilterModal filterKey={filterKey} filterTab={filterTab} onSubmit={getTabData}/>
                </div>

                <Table columns={columnsAccState}
                       dataSource={stateTab}
                       className="table-striped-rows"
                       size='small'
                       rowKey="id"
                       title={() => <><Tag color="rgb(213, 213, 213)" style={{fontSize:'14px', padding:'4px 8px', color: '#000'}}>{accCode}</Tag> <span>{accName}</span></>}
                       loading={loading}
                    //footer={() => 'Footer'}
                    //scroll={{x: 300, y:'calc(100vh - 345px)'}}
                       scroll={{x: 300, y:'calc(100vh - 345px)' }}
                       tableLayout="auto"
                       pagination={pagination}

                />

            </div>
        </Layout>

    );

}

export default AccountStateTab