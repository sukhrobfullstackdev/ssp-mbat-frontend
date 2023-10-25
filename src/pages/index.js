import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {PlusOutlined, MailOutlined, BarcodeOutlined} from '@ant-design/icons';
// import {ReactComponent as ReactLogo} from '../assets/loginbg.svg';
import ReactLogo from '../assets/loginbg.svg';
import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
    Checkbox,
    Upload,
    Menu, Row, Col, Layout, Card,
} from 'antd';
import {Content, Footer, Header} from "antd/es/layout/layout";
import {Link} from "react-router-dom";
import Login from "../components/User/Login";
import './indexbm.css';
import AnchorLink from "antd/es/anchor/AnchorLink";
import {AuthContext} from "../context/AuthContext";
import {useAuth} from "../hooks/auth.hook";
import {useTranslation} from "react-i18next";

const Index = (props) => {
    const auth = useContext(AuthContext);
    auth.logout();

    return (
        <Layout style={{display: "flex", flexDirection:"row-reverse", justifyContent: "center", alignItems: "center", height: "100%", minHeight:"100%"}}>
            <Content className="site-layout-background content-index" style={{minHeight:"100%"}}>

                <div style={{display:"flex", justifyContent: "right", alignItems: "center", marginRight:"47px", gap:"20px" }}>

                    <Button style={{backgroundColor: "transparent", border:"0", color:"#816132", fontWeight: "600" }}>Тизим хакида</Button>

                    <Button style={{backgroundColor: "transparent", border:"0", color:"#816132", fontWeight: "600" }}>Алока</Button>
                </div>
                <div className="page-wrapper" style={{width: "100%", height:"100%", background:"transparent", margin:"0",position:"absolute", top:"50%", left: "50%", transform: "translate(-50%, -50%)", display: "flex",
                            flexDirection:"row", justifyContent: "center", alignItems: "center"
                            }}>
                    <div className="svg-container">
                        <div className="logobm"></div>
                        {/*<object type="image/svg+xml" data={ReactLogo}*/}
                        {/*        width="100%" height="100%" className="logobm">*/}
                        {/*</object>*/}
                        {/*<div className="logobm"></div>*/}
                        <div className="logo-container">
                            <div className="logo-img">
                                {/*<img src="../iconBook.png" alt="logo" width="50px" height="50px"/>*/}
                            </div>
                            {/*<div className="logo-title">
                                <h4>E DARSLIK</h4>
                                <h6>Elektron darslik</h6>
                            </div>*/}
{/*                            <div>
                                <h2 style={{color: "#c6c6c6"}}>Добро пожаловать!</h2>
                            </div>*/}
                        </div>
                    </div>
                    <div className="login-container-index">
                        <Login style={{borderRadius: "5px"}}></Login>
                    </div>

                </div>
            </Content>

        </Layout>
    );
};

export default Index;