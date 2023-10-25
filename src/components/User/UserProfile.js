import React, {useContext, useEffect, useState} from "react";
import {Button, Divider, Form, Input, message, Space} from "antd";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "../../api/axios";
import NumberInputBM from "../../components/NumberInput";

const QUERY_URL = '/api/public/query';
const SAVE_URL = '/user/changePassword';

const UserProfile = ({empId}) => {

    const navigate = useNavigate();

    const auth = useContext(AuthContext);
    const [form] = Form.useForm()
    const [formPassword] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();

    const [loading, setLoading] = useState(true);


    const headers = {
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const onFinish = async (values) => {

        const userLogin = form.getFieldValue("login");
        const userPass = values.passwordNew;

        try {
            const data = await axios.post(SAVE_URL,

                JSON.stringify({'login':userLogin, 'password':userPass})
                , {
                    headers: headers
                }
                // )
            ).then(response => { console.log(response, 'response')} )
            message.success('Парол узгартирилди', handleFormExit);

        } catch (err) {
            message.error(err.response?.data?.message);
        }
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    const dataTab = {
        "query": {
            "id": "EMPLOYEE_UI_V",
            "source": "EMPLOYEE_UI_V",
            "fields": [
                {   "column": "id", "format": "number", "type": "number" },
                {   "column": "filial", "format": "text", "type": "text" },
                {   "column": "filial_name", "format": "text", "type": "text" },
                {   "column": "fio", "format": "text", "type": "text" },
                {   "column": "login", "format": "text", "type": "text" },
                {   "column": "phonenumber", "format": "number", "type": "number" },
                {   "column": "mobilenumber", "format": "number", "type": "number" },
                {   "column": "staff", "format": "text", "type": "text" },
                {   "column": "struct", "format": "text", "type": "text" },
                {   "column": "state", "format": "number", "type": "number" },
                {   "column": "state_name", "format": "text", "type": "text" },
                {   "column": "created_by", "format": "number", "type": "number" },
                {   "column": "created_by_name", "format": "number", "type": "number" },
                {   "column": "created_date", "format": "text", "type": "text" },
                {   "column": "modified_by", "format": "number", "type": "number" },
                {   "column": "modified_by_name", "format": "number", "type": "number" },
                {   "column": "modified_date", "format": "text", "type": "text" }
            ]
        }
    }

    const getTabData = async () => {

        dataTab.query['filters'] = [{"column": "id", "value": empId, "operator": "=", "dataType": "number"}];

        console.log(empId,'empFilial')

        console.log(dataTab,'qweqwe')

        const { data } = await axios.post(QUERY_URL,
            ( dataTab ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });

        setLoading(false);
        console.log(data)
        //form.setFieldValue("fio",data[0].fio)
        form.setFieldsValue({
            "fio":data[0].fio,
            "filial":data[0].filial + ' - ' + data[0].filial_name,
            "login":data[0].login,
            "phonenumber":data[0].phonenumber,
            "mobilenumber":data[0].mobilenumber,
            "state":data[0].state_name,
        })



    };

    useEffect(() => {
        getTabData();
    }, []);

    const handleFormSubmit = () => {

        formPassword
            .validateFields()
            .then(async (values) => {
                console.log(JSON.stringify(values),'eeed')
                return
                try {
                    const data = await axios.post(SAVE_URL,

                        JSON.stringify(values)
                        , {
                            headers: headers
                        }
                        // )
                    ).then(response => { console.log(response, 'response')} )
                    //message.success('Парол узгартирилди', handleFormExit);
                    messageApi.open({
                        type: 'success',
                        content: 'Парол узгартирилди',
                        duration: 2,
                    }).then(()=> null);

                } catch (err) {
                    message.error(err.response?.data?.message);
                }

            })
            .catch((errorInfo) => {
                console.log('errorInfo ...', errorInfo);
            }).then(r => r);
    }

    const handleFormExit = () => {
        navigate(-1)
    }

    return (
        <>
            {contextHolder}
            <Space direction="horizontal" size="middle" style={{ display: "flex", justifyContent:"center", alignItems: "center", height: "100%", width: "100%", position: "relative", overflow: "hidden" }}/>

            <Form name="userProfile" form={form} scrollToFirstError initialValues={{}}>
                {/*onFinishFailed={onFinishFailed}*/}

                <Form.Item name="filial" label="Филиал" rules={[{required: false, message:'Филиални киритинг!'}]}>
                    <Input readOnly="readOnly"/>
                </Form.Item>

                <Form.Item name="fio" label="Ф.И.О" rules={[{required: false, message:'Ф.И.О. ни киритинг!'}]}>
                    <Input readOnly="readOnly"/>
                </Form.Item>

                <Form.Item name="phonenumber" label="Телефон ракам" rules={[{required: false, message:'Телефон ракамни киритинг!'}]}>
                    <Input readOnly="readOnly"/>
                </Form.Item>

                <Form.Item name="mobilenumber" label="Мобил ракам" rules={[{required: false, message:'Мобил ракамни киритинг!'}]}>
                    <Input readOnly="readOnly"/>
                </Form.Item>

                <Form.Item name="state" label="Холат" rules={[{required: false, message:'Холатни киритинг!'}]}>
                    <Input readOnly="readOnly"/>
                </Form.Item>

                <Form.Item name="login" label="Логин" rules={[{required: false, message:'Логинни киритинг!'}]}>
                    <Input readOnly="readOnly"/>
                </Form.Item>

            </Form>

            <Divider>Паролни узгартириш</Divider>

            <Form form={formPassword} scrollToFirstError initialValues={{passwordNew:""}} onFinish={onFinish}>

                <Form.Item name="passwordNew" label="Парол" rules={[{required:true, message: 'Паролни киритинг'}]}>
                    <Input.Password/>
                </Form.Item>

                <Form.Item name="confirmNew" label="Паролни тасдиклаш" rules={[{required:true, message: 'Тасдиклаш паролини киритинг'},
                    ({getFieldValue}) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('passwordNew') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Пароллар бир бирига тенг эмас'))
                        }
                    })]}>
                    <Input.Password/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{marginRight:'10px'}}>
                        Паролни узгартириш
                    </Button>
                </Form.Item>

            </Form>
        </>
    )
}

export default UserProfile;