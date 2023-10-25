import React, {useContext, useState, useEffect} from "react";
import {Button, DatePicker, Form, Input, InputNumber, message, Select, Space} from "antd";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "../../api/axios";
import {LeftOutlined} from "@ant-design/icons";
import NumberInputBM from "../../components/NumberInput";
import {dataFilialTab, dataPosition, dataStruct} from "../Employee/EmpData";
import {dataAccoountTypeData} from "./AccountData";

const {Option} = Select;
const QUERY_URL = '/api/public/query';
const SAVE_URL = '/account/save';

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

const AccountAdd = () => {

    const navigate = useNavigate();

    const auth = useContext(AuthContext);
    const [form] = Form.useForm()
    const [accountType  , setAccountType] = useState("");
    const [f_accType  , setF_accType] = useState("");

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
                try {
                    const data = await axios.post(SAVE_URL,

                        JSON.stringify(values)
                        , {
                            headers: headers
                        }
                        // )
                    ).then(response => { console.log(response, 'response')} )
                    message.success('Хисоб ракам очилди', handleFormExit);
                    //message.success(data);
                    //history.push(`/detail/${data.link._id}`)
                } catch (err) {
                    message.error(err.response?.data?.message);
                }
                // Submit values
                // SubmitValues(values);

            })
            .catch((errorInfo) => {
                console.log('errorInfo ...', errorInfo);
            }).then(r => r);
    }

    const handleFormExit = () => {
        navigate(-1)
    }

    const getAccountType = async () => {
        const { data } = await axios.post(QUERY_URL,
            ( dataAccoountTypeData ),
            {
                headers: headers,
                withCredentials: false
            });


        console.log(data, 'dataFilial');
        setAccountType(data);
    };

    useEffect(() => {
        getAccountType()
    }, []);


    return (
        <>
            <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", justifyContent: "left", alignItems:"center", padding:"12px"}}>

                {/*<Button type="primary" htmlType="submit" style={{marginRight:'10px'}} onClick={handleFormExit}>*/}
                {/*<LeftCircleFilled onClick={handleFormExit} style={{ fontSize: '34px', color: '#08c', marginRight:'10px', }}/>*/}
                {/*</Button>*/}
                <h3><Button shape="circle" icon={<LeftOutlined />}  style={{fontSize:'14px',marginRight:"10px"}} onClick={handleFormExit}/>Хисоб ракам очиш</h3>
            </div>
            <Space direction="horizontal" size="middle" style={{ display: "flex", justifyContent:"center", alignItems: "center", height: "100%", width: "100%", position: "relative", overflow: "hidden" }}/>

            <Form {...layout} name="addTextBook" form={form} scrollToFirstError initialValues={{accType:'1'}} onFinish={onFinish} >
                {/*onFinishFailed={onFinishFailed}*/}

                <Form.Item name="accType" label="Хисоб ракам тури" value={f_accType} onChange={e => setF_accType(e.target.value)} rules={[{ required: true, message:'Хисоб ракам турини танланг!'}]}>
                    <Select >
                        {accountType &&
                            accountType.map((row) => {
                                return (
                                    <Option key={row.id}>{row.name}</Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>

                <Form.Item name="mfo" label="МФО"
                           rules={[
                               {required: true, message:'МФО ни киритинг!'},
                               { min: 5, message: 'МФО 5 хонали сон булиши керак!' },
                               { max: 5, message: 'МФО 5 хонали сон булиши керак!' }
                           ]}>
                    <NumberInputBM
                        style={{ width: '100%' }}
                        maxLength={5}
                        showCount={true}
                    />
                </Form.Item>

                <Form.Item name="code" label="Хисоб ракам"
                           rules={[
                               {required: true, message:'Хисоб ракамни киритинг!'},
                               { min: 20, message: 'Хисоб ракам 20 хонали сон булиши керак!' },
                               { max: 20, message: 'Хисоб ракам 20 хонали сон булиши керак!' }
                           ]}>
                    <NumberInputBM
                        style={{ width: '100%' }}
                        maxLength={20}
                        showCount={true}

                    />
                </Form.Item>

                <Form.Item name="name" label="Хисоб ракам номи" rules={[{required: true, message:'Хисоб ракам номини киритинг!'}]}>
                    <Input />
                </Form.Item>

                <Form.Item name="inn" label="ИНН"
                           rules={[
                               {required: true, message:'ИНН ни киритинг!'},
                               { min: 9, message: 'ИНН 9 хонали булиши керак!' },
                               { max: 9, message: 'ИНН 9 хонали булиши керак!' }
                           ]}>
                    <NumberInputBM
                        style={{ width: '100%' }}
                        maxLength={9}
                        showCount={true}
                    />
                </Form.Item>

                <Form.Item name="pinfl" label="ПИНФЛ" rules={[{required: false, message:'ПИНФЛ ни киритинг!'}]}>
                    <NumberInputBM
                        style={{ width: '100%' }}
                        maxLength={14}
                    />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" style={{marginRight:'10px'}} onClick={handleFormSubmit}>
                        Саклаш
                    </Button>

                    <Button type="ghost" htmlType="reset" danger>
                        Тозалаш
                    </Button>
                </Form.Item>

            </Form>
        </>
    )
}

export default AccountAdd;