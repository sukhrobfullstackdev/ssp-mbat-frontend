import React from "react";
import { useNavigate } from "react-router-dom";
import {Button, Calendar, Card, Col, Descriptions, Radio, Row, Space, Statistic, Tag} from "antd";
import {useState, useEffect, useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import {useAuth} from "../hooks/auth.hook";
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";
import locale from 'antd/locale/ru_RU';
import {Footer} from "antd/es/layout/layout";
import DemoPie from "../components/PieChart";
import HomeTable from "./HomeTable";
import axios from "../api/axios";

const QUERY_URL = '/api/public/query';

const HomeNew = (props) => {
    const navigate = useNavigate();

    const auth = useContext(AuthContext);
    const {empId, empName} = useAuth();
    const [saldoSum, setSaldoSum] = useState({"saldo_in": 0, "debet": 0, "credit": 0, "saldo_out": 0});

    const [size, setSize] = useState('default');
    const onChangeDesripSize = (e) => {
        setSize(e.target.value);
    }

    const headers = {'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const dataSaldo = {
        "query": {
            "ID": "GET_ACCOUNT_SALDO_GROUP_BY_EMP_ID_UI_V",
            "source": "GET_ACCOUNT_SALDO_GROUP_BY_EMP_ID_UI_V",
            "fields": [
                {   "column": "saldo_in", "format": "text", "type": "text" },
                {   "column": "debet", "format": "text", "type": "text" },
                {   "column": "credit", "format": "text", "type": "text" },
                {   "column": "saldo_out", "format": "text", "type": "text" },
            ]
        }
    }
    const getSaldoData = async (filter = '') => {

        //SALDO

        dataSaldo.query.source = "GET_ACCOUNT_SALDO_GROUP_BY_EMP_ID_UI_V("+auth.empId+")"

        console.log(dataSaldo, 'dataSaldo')

        const { data } = await axios.post(QUERY_URL,
            ( dataSaldo ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        console.log(data, 'respDatadataSaldo')
        console.log(data[0], 'respDatadataSaldo')
        setSaldoSum(data[0])

    };

    useEffect(() => {
        props.setTitleNav('Асосий ойна');
        getSaldoData()
    }, []);

    return (
        <>
            <div className="app-content-wrapper app" style={{padding:'20px', minHeight:'100%', position:'relative', overflow:"auto"}}>

                <div className="app__content">

                    <Row gutter={[24, 16]}>

                        {/*<Col span={6} >

                            <div style={{width:"300px", height: "400px"}}>
                                <div className="site-calendar-demo-card">
                                    <Calendar fullscreen={false} locale={locale}/>
                                </div>
                            </div>

                        </Col>*/}

                        <Col span={24}>

                            <Row gutter={[24,16]}>

                                <Col span={6} >

                                    <Card bordered={false}>
                                        <Statistic
                                            title="Колдик кун бошига"
                                            value={saldoSum.saldo_in || 0}
                                            precision={2}
                                            suffix="сум"
                                        />
                                    </Card>

                                </Col>

                                <Col span={6} >

                                    <Card bordered={false}>
                                        <Statistic
                                            title="Тушум"
                                            value={saldoSum.debet || 0}
                                            precision={2}
                                            valueStyle={{
                                                color: '#3f8600',
                                            }}
                                            prefix={<ArrowDownOutlined />}
                                            suffix="сум"
                                        />
                                    </Card>

                                </Col>

                                <Col span={6} >

                                    <Card bordered={false}>
                                        <Statistic
                                            title="Харажат"
                                            value={saldoSum.credit || 0}
                                            precision={2}
                                            valueStyle={{
                                                color: '#cf1322',
                                            }}
                                            prefix={<ArrowUpOutlined />}
                                            suffix="сум"
                                        />
                                    </Card>

                                </Col>

                                <Col span={6} >

                                    <Card bordered={false}>
                                        <Statistic
                                            title="Колдик кун охирига"
                                            value={saldoSum.saldo_out || 0}
                                            precision={2}
                                            suffix="сум"
                                        />
                                    </Card>

                                </Col>

                            </Row>

                        </Col>

                        <Col span={18}>

                            <Card bordered={false} title='Амаллар хакида маълумот'>
                                <HomeTable/>
                            </Card>

                        </Col>

                        {/*<Col span={12}>

                            <Card bordered={false}>
                                <DemoPie/>
                            </Card>

                        </Col>*/}

                        <Col span={6}>

                            {/*<Card bordered={false} title='Валюта курслари (МБ)'>
                                <a href="https://cbu.uz/" target="_blank" title="Ўзбекистон Республикаси Марказий банки">
                                    <img src="https://cbu.uz/oz/informer/?txtclr=000000&brdclr=ffffff&bgclr=dddddd&r_choose=USD_EUR_RUB"
                                         alt=""

                                    />
                                </a>
                            </Card>*/}

                        </Col>

                    </Row>

                    <Footer style={{position: 'absolute', right: 0, bottom: 0, width: '100%'}}>
                        <div style={{display: 'flex', flexDirection:'row', justifyContent:'space-between'}}>
                            <h4> Савдо саноат палатаси молиясини бошқариш ахборот тизими </h4>
                            <h4> Версия 1.0. Яратувчи "Goodness Software"</h4>
                        </div>
                    </Footer>

                </div>

            </div>
        </>
    );
};

export default HomeNew;
