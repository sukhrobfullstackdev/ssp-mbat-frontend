import React, { useEffect, useState } from "react";
import axios from "axios";
import {PlusOutlined, MailOutlined, BarcodeOutlined} from '@ant-design/icons';
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

const Welcome = (props) => {
    const [quotes, setQuotes] = useState("");


    let cnt = 0;
    let filterArray = [];
    let bb = [];
    useEffect(() => {
        if (quotes === "") {
            //axios.get("https://type.fit/api/quotes").then((response) => {
            axios.get("http://localhost:3000/quotes").then((response) => {

                filterArray = response.data;
                console.log(filterArray);

                setQuotes(filterArray);

                //setQuotes(response.data);
            });
        }
    }, [quotes]);

    return (
        <Layout>
            {/*<Header className="header">
                <Row>
                    <Col span={4}>

                        <h2 style={{color: '#fff'}}><BarcodeOutlined /> EKITOB</h2>
                    </Col>
                    <Col span={20} style={{float: 'right'}}>
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['welcome']} style={{justifyContent: 'flex-end'}}>
                            <Menu.Item key="welcome" icon={<MailOutlined />}>
                                Registration
                            </Menu.Item>
                            <Menu.Item key="login" icon={<PlusOutlined />}>
                                <Link to="/home">Log in</Link>
                            </Menu.Item>
                        </Menu>
                    </Col>

                </Row>
            </Header>*/}
            <Content className="site-layout-background" style={{ padding: 24, minHeight: '100%', height: '570px', background: '#e6ff8f4f none repeat scroll 0% 0%', overflow: 'auto' }}>
                <h2>Quotes</h2>
                <Card style={{height: '300px', overflow:'auto'}}>

                    {quotes &&
                        quotes.map((quote, id) => {
                            return (

                                <blockquote className="blockquote mb-0" key={id}>
                                    <p>{quote.text}</p>
                                    <footer className="blockquote-footer">{quote.author}</footer>
                                </blockquote>

                            )
                        })
                }

                </Card>

            </Content>
            <Footer style={{position: 'absolute', bottom: 0, left: 0, width: '100%'}}>
                HAB

            </Footer>
        </Layout>



        /*<Card bg="dark" text="light">
            <Card.Header>Quotes</Card.Header>
            <Card.Body style={{ overflowY: "scroll", height: "570px" }}>
                {quotes &&
                    quotes.map((quote, id) => (
                        <blockquote className="blockquote mb-0" key={id}>
                            <p>{quote.text}</p>
                            <footer className="blockquote-footer">{quote.author}</footer>
                        </blockquote>
                    ))}
            </Card.Body>
        </Card>*/
    );
};

export default Welcome;