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

const Home = (props) => {
    const navigate = useNavigate();

    const auth = useContext(AuthContext);
    const {empId, empName} = useAuth();

    const [size, setSize] = useState('default');
    const onChangeDesripSize = (e) => {
        setSize(e.target.value);
    }

    useEffect(() => {
        props.setTitleNav('Асосий ойна');
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

                        <Col span={8}>

                            <Row gutter={[24,16]} wrap='wrap'>

                                <Col span={24}>

                                    <Card bordered={false}>
                                        <Statistic
                                            title="Колдик"
                                            value={112893000}
                                            precision={2}
                                            suffix="сум"
                                        />
                                    </Card>

                                </Col>

                                <Col span={24}>

                                    <Card bordered={false}>
                                        <Statistic
                                            title="Тушум"
                                            value={1115000.28}
                                            precision={2}
                                            valueStyle={{
                                                color: '#3f8600',
                                            }}
                                            prefix={<ArrowDownOutlined />}
                                            suffix="сум"
                                        />
                                    </Card>

                                </Col>

                                <Col span={24}>

                                    <Card bordered={false}>
                                        <Statistic
                                            title="Харажат"
                                            value={25000.28}
                                            precision={2}
                                            valueStyle={{
                                                color: '#cf1322',
                                            }}
                                            prefix={<ArrowUpOutlined />}
                                            suffix="сум"
                                        />
                                    </Card>

                                </Col>

                            </Row>

                        </Col>

                        <Col span={16}>

                            <DemoPie/>

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

export default Home;
