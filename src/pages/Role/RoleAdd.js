import React, {useContext, useState, useEffect} from "react";
import {Button, DatePicker, Form, Input, InputNumber, message, Select, Space} from "antd";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "../../api/axios";
import {LeftOutlined} from "@ant-design/icons";
const {TextArea} = Input;

const SAVE_URL = '/admin/roles/save';
const QUERY_URL = '/api/public/query';

const {Option} = Select;
const { RangePicker } = DatePicker;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
};

const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

const RoleAdd = () => {

    const navigate = useNavigate();

    const auth = useContext(AuthContext);
    const [form] = Form.useForm()

    const headers = {
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const onFinish = (values) => {
        console.warn(values ,'values');
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    const handleFormSubmit = () => {

        console.log('auth... ', auth)

        form
            .validateFields()
            .then(async (values) => {
                console.log(JSON.stringify(values),'eeed')

                try {
                    const data = await axios.post(SAVE_URL,

                        JSON.stringify(values)
                        , {
                            headers: headers
                        }
                        // )
                    ).then(response => { console.log(response, 'response')} )
                    message.success('Роль кушилди', handleFormExit);
                } catch (err) {
                    message.error(err.response?.data);
                }

            })
            .catch((errorInfo) => {
                console.log('errorInfo ...', errorInfo);
            }).then(r => r);
    }

    const handleFormExit = () => {
        navigate(-1)
    }

    useEffect(() => {

    }, []);


    return (
        <>
            <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", justifyContent: "left", alignItems:"center", padding:"12px"}}>

                {/*<Button type="primary" htmlType="submit" style={{marginRight:'10px'}} onClick={handleFormExit}>*/}
                {/*<LeftCircleFilled onClick={handleFormExit} style={{ fontSize: '34px', color: '#08c', marginRight:'10px', }}/>*/}
                {/*</Button>*/}
                <h3><Button shape="circle" icon={<LeftOutlined />}  style={{fontSize:'14px',marginRight:"10px"}} onClick={handleFormExit}/>Рол яратиш</h3>
            </div>
            <Space direction="horizontal" size="middle" style={{ display: "flex", justifyContent:"center", alignItems: "center", height: "100%", width: "100%", position: "relative", overflow: "hidden" }}/>

            <Form {...layout} name="addTextBook" form={form} scrollToFirstError initialValues={{}} onFinish={onFinish} >
                {/*onFinishFailed={onFinishFailed}*/}

                <Form.Item name="name" label="Номи" rules={[{required: true, message:'Номини киритинг!'}]}>
                    <Input />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" style={{marginRight:'10px'}} onClick={handleFormSubmit}>
                        Кушиш
                    </Button>

                    <Button type="ghost" htmlType="reset" danger>
                        Тозалаш
                    </Button>
                </Form.Item>

            </Form>
        </>
    )
}

export default RoleAdd;