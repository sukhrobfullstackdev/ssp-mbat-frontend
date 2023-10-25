import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {Button, Checkbox, Divider, Form, Input, Space} from "antd";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
//import cors from "cors";
import {useNavigate} from "react-router-dom";
import {useAuth} from '../../hooks/auth.hook';

const LOGIN_URL = '/user/login';
const CHANGE_PWD_URL = '/user/changePassword';
// const proxy = require('http-proxy-middleware');

const Login = () => {
    let navigate = useNavigate();
    const handleOnClick = useCallback(() => navigate('/layout', {replace: true}), [navigate]);

    //const { auth, setAuth } = useContext(AuthContext);
    const auth = useContext(AuthContext);
    // const userRef = useRef();
    const errRef = useRef();
    //const {token, userId, login} = useAuth();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    // useEffect(() => {
    //     userRef.current.focus();
    // }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleSubmit = async (e) => {

        try {
            const headers1 = {'Content-Type':'application/json;charset=utf-8', 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Credentials':'true', 'withCredentials': 'true'}
            const headers2 = {'Content-Type':'application/json;charset=utf-8', 'Authorization':''}

            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ login: user, password: pwd }),
                {
                    headers: headers1,
                    proxy: {
                        protocol: 'https',
                        //host: '217.30.161.190',
                        //host: '172.24.255.74',
                        //host: 'mbat.chamber.uz',
                        host: 'mbatbackend.chamber.uz',
                        //port: 10006,
                        //port: 9595,
                    },
                    crossdomain: true,
                    withCredentials: false
                }
            );

            const accessToken = response?.headers?.jwt;

            const empId = response?.data?.id;
            const empName = response?.data?.fio;
            const empFilial = response?.data?.filial;

            auth.login(accessToken, user, empId, empName, empFilial)
            setUser('');
            setPwd('');
            setSuccess(true);
            //navigate("layout",success);
            handleOnClick();
            useAuth.login(accessToken, user, empId, empName, empFilial)
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                if (err.code === 'ERR_NETWORK') {setErrMsg('Нет соединения с сервером'); return}
                setErrMsg('Login Failed');
            }
            //handleOnClick();
            // errRef.current.focus();
        }

        // const logData = { "login":"TEST", "password": "SPRING" };
        // const headers = {'Content-Type':'application/json;charset=utf-8','Access-Control-Allow-Origin':'*','Authorization':'', 'withCredentials': true, mode:'cors'}
        // //axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
        // // axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        // const { data } = await axios.post("http://10.50.50.145:8383/user/login",logData, {headers});
        // // const { data } = await proxy("http://10.50.50.145:8383/user/login",logData, {headers});
        // console.log(data);

    };

    const handleSubmitChange = async (e) => {
        // console.warn(user);
        // console.warn(pwd);
        // console.error(auth);

        try {
            const headers3 = {'Content-Type':'application/json;charset=utf-8',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Credentials':'true',
                'Authorization':`Bearer ${auth.accessToken}`,
                'withCredentials': 'true'
            }
            console.warn(headers3);
            const response = await axios.post(CHANGE_PWD_URL,
                JSON.stringify({ login: user, password: pwd }),
                {
                    headers: headers3,
                    crossdomain: true,
                    withCredentials: false,
                    //Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJURVNUIiwiaWF0IjoxNjYwMTM2NDYyLCJleHAiOjE2NjAyMjI4NjIsInVzZXJOYW1lIjoiVEVTVCIsInVzZXJJZCI6MSwidXNlclN0YWZmIjoiMDAwMDAwMCIsInVzZXJGaWxpYWwiOiIwMDAiLCJ1c2VyU3RydWN0IjoiMDAiLCJ1c2VyIjp7ImZpbGlhbCI6IjAwMCIsImlkIjoxLCJkZXB0bGV2ZWwiOjAsInN0cnVjdCI6IjAwIiwic3RhZmYiOiIwMDAwMDAwIiwiZmlvIjoi0JDQsdC00YPQu9C70LDQtdCyINCQ0LHQtNGD0LvQu9C-0YUg0JDQsdC00YPQu9C70L7RhSDRg9Cz0LvQuCIsImxvZ2luIjoiVEVTVCIsInBhc3N3b3JkIjoie2JjcnlwdH0kMmEkMTAkV2Y4UzQ5MlBoT3MybmdWRDRFZDlZLjhKL0Rkb2JrN3B1MUNpZ0VOMGF1TEZGaU5yRmRNTm0iLCJwaG9uZW51bWJlciI6Iis5OTg5Nzc3Nzc3NzciLCJtb2JpbGVudW1iZXIiOiI5OTg5OTc3Nzc3NzciLCJkYXRlb3BlbiI6IjI3LjA3LjIwMjIiLCJkYXRlZXhwaXJlIjoiMDEuMDEuMjA5OSIsImNudHRyaWVzIjowLCJhY3Rpb24iOjEsInN0YXRlIjoxLCJkYXRlQWN0aXYiOm51bGwsImRhdGVEZWFjdCI6bnVsbCwiZGF0ZUNvcnJlY3QiOm51bGwsImVtcCI6MH19.dL7a3GgaDEE6DMS6_OHuQHOs16-mWjcHJQTbzLyVV7WA3OIEwHYMCEvtC0CsykuiL7y78IfEpkAvapRPByg2WQ'
                }
            );
            //headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Credentials':'true', 'withCredentials': true, mode:'cors' },
            console.log(JSON.stringify(response?.data));
            const accessToken = auth.accessToken;
            const roles = response?.data?.roles;
            //setAuth({ user, pwd, roles, accessToken, isLogin: true });
            setUser('');
            setPwd('');
            setSuccess(true);
            navigate("/employeeTab",success);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
        }
    };



    return (
        <div style={{width:'80%', height:'80%', backgroundColor:'#ffffffb8', position: "relative", overflow: "hidden",
                     border: "0px solid #f6d98f", boxShadow:"-2px -2px 100px rgb(213, 213, 213)",
                    borderRadius:"10px"}}>

            <Space direction="vertical" size="middle" style={{ display: "flex", justifyContent:"center", alignItems: "center", height: "100%", width: "100%", position: "relative", overflow: "hidden", marginTop:"-50px" }}>

                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

                <Divider orientation="center" plain style={{color:"rgb(159, 121, 71)"}}>
                    <h2>Тизимга кириш</h2>
                </Divider>

                <Form
                    name="basic"
                    className="login-form"

                    initialValues={{
                        remember: false,
                    }}
                    //onFinish={onFinish}
                    onFinish={handleSubmit}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    style={{width:"300px"}}

                >
                    <Form.Item
                        /*label="Логин"*/
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Логин киритинг!',
                            },
                        ]}
                    >
                        <Input
                            id="username"
                            autoComplete="off"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            required
                            placeholder="Логин"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Пароль киритинг!',
                            },
                        ]}
                    >
                        <Input.Password
                            id="password"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            required
                            placeholder="Пароль"
                        />
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                    >
                        <Checkbox>Эслаб колиш</Checkbox>

                        <a className="login-form-forgot" href="#" style={{float:"right"}}>
                            Парол эсдан чикдими?
                        </a>

                    </Form.Item>

                    <Form.Item>

                        <Button type="primary" className="btn-grad login-form-button" htmlType="submit" style={{width:"100%"}}>
                            Кириш
                        </Button>

                    </Form.Item>
                </Form>
            </Space>
           {/*)}*/}
        </div>
    );
}

export default Login;

