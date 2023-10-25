import React, {useEffect, useState, useContext} from 'react';
import {Button, Cascader, DatePicker, Form, Input, InputNumber, message, Radio, Select, Space} from "antd";
import { useNavigate } from "react-router-dom";

import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import {LeftOutlined} from "@ant-design/icons";
import { dataStruct, dataPosition, dataFilialTab} from "./EmpData"

const USER_REGISTER_URL = '/user/register';
const QUERY_URL = '/api/public/query';
const {Option} = Select;

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


const EmployeeAdd = (props) => {

    const navigate = useNavigate();

    const [form] = Form.useForm()
    const auth = useContext(AuthContext);

    const [dates, setDates] = useState({})
    const [messageApi, contextHolder] = message.useMessage();

    const [filials  , setFilials] = useState("");
    const [structs  , setStructs] = useState("");
    const [positions, setpositions] = useState("");
    const [positionsValue, setPositionsValue] = useState("");

    const [f_filial, setF_filial] = useState("");

    const dateFormat = 'DD.MM.YYYY';

    const prefixMobileSelector = (
        <Form.Item name="prefixmobile" noStyle>
            <Select style={{ width: 70 }}>
                <Option value="90">+90</Option>
                <Option value="97">+97</Option>
                <Option value="98">+98</Option>
                <Option value="99">+99</Option>
            </Select>
        </Form.Item>
    );

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select style={{ width: 70 }}>
                <Option value="71">+71</Option>
                <Option value="78">+78</Option>
            </Select>
        </Form.Item>
    );

    const headers = {
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const getAnswer = async () => {
        const { data } = await axios.post(QUERY_URL,
                ( dataFilialTab ),
            {
                headers: headers,
                withCredentials: false
            });


        console.log(data, 'dataFilial');
        setFilials(data);
        setStructs(dataStruct);
        setpositions(dataPosition);
    };

    useEffect(() => {
        getAnswer();
    }, []);

    const setPosValue = ({ target: {value} }) => {
        form.setFieldsValue({'staff':value});
        setPositionsValue(value);
    }

    const onFinish = (values) => {
        console.warn(values);
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    const handleFormExit = () => {
        navigate(-1)
    }

    const handleFormSubmit = (values) => {

        const headers = {'Content-Type':'application/json;charset=utf-8',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Credentials':'true',
            'Authorization':`Bearer ${auth.token}`,
            'withCredentials': true
        }

        form
            .validateFields()
                .then(async (values) => {
                    console.log('values ...', values);
                    let dop = { 'deptlevel': 0,
                                'cnttries': 0,
                            }
                    values = {...values,...dop, 'fio':values.firstName+' '+values.surName+' '+values.secondName}
                    //values.phonenumber = values.prefix + values.phonenumber;
                    //values.mobilenumber = values.prefixmobile + values.mobilenumber;
                    values["dateopen"] = dates.dateopen
                    console.log('upd values ...', values);
                    delete values.dateEnter
                    delete values.confirm
                    delete values.firstName
                    delete values.surName
                    delete values.prefixmobile
                    delete values.prefix
                    delete values.position

                    console.log('upd deleted values ...', values);

                    try {
                        const data = await axios.post(USER_REGISTER_URL,

                            JSON.stringify(values),
                            {
                                headers: headers,
                                crossDomain: true,
                                withCredentials: false
                            }
                            // )
                        )
                        messageApi.open({
                            type: 'success',
                            content: 'Муввафакият',
                            duration: 2,
                        }).then(()=> handleFormExit());
                    } catch (err) {
                        messageApi.open({
                            type: 'error',
                            content: err.response?.data?.message,
                            duration: 5,
                        });
                    }
                    // Submit values
                    // SubmitValues(values);

                })
                .catch((errorInfo, values) => {
                    console.log('errorInfo ...', errorInfo);
                    console.log('errorInfo ...', errorInfo.values);
                }).then(r => r);
    };

    function changeDateFormat(date, dateString, evDate){
        let updatedValue = {};
        updatedValue[evDate] = dateString;
        setDates(dates => ({
            ...dates,
            ...updatedValue
        }));
    }

    return (
        <>
            {contextHolder}
            <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", justifyContent: "left", alignItems:"center", padding:"12px"}}>
                <h3><Button shape="circle" icon={<LeftOutlined />}  style={{fontSize:'14px',marginRight:"10px"}} onClick={handleFormExit}/>Янги фойдаланувчи яратиш</h3>
            </div>

            <Form {...layout} name="addEmployee" form={form} scrollToFirstError initialValues={{prefix:'71',prefixmobile:'99',struct:'0', filial:'000'}} onFinish={onFinish} >
                {/*onFinishFailed={onFinishFailed}*/}
                <Form.Item name="firstName" label="Исм" rules={[{required: true, message:'Исмни киритинг!'}]}>
                    <Input/>
                </Form.Item>

                <Form.Item name="surName" label="Фамилия" rules={[{required: true, message:'Фамилияни киритинг!'}]}>
                    <Input/>
                </Form.Item>

                <Form.Item name="secondName" label="Отасининг исми" rules={[{required: true, message:'Отасининг исмини киритинг!'}]}>
                    <Input/>
                </Form.Item>

                <Form.Item name="login" label="Логин" rules={[{required: true, message:'Логинни киритинг!'}]}>
                    <Input/>
                </Form.Item>

                <Form.Item name="filial" label="Филиал" value={f_filial} onChange={e => setF_filial(e.target.value)} rules={[{ required: true, message:'Филиални танланг!'}]}>
                    <Select >
                        {filials &&
                            filials.map((filial) => {
                                return (
                                    <Option key={filial.code}>{filial.name}</Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>

                <Form.Item name="password" label="Парол" rules={[{required:true, message: 'Паролни киритинг'}]}>
                    <Input.Password/>
                </Form.Item>

                <Form.Item name="confirm" label="Паролни тасдиклаш" rules={[{required:true, message: 'Тасдиклаш паролини киритинг'},
                    ({getFieldValue}) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Пароллар бир бирига тенг эмас'))
                        }
                    })]}>
                    <Input.Password/>
                </Form.Item>

                <Form.Item name="struct" label="Тузилма" rules={[{required: true, message:'Тузилмани танланг!'}]}>
                    <Select >
                        {structs &&
                            structs.map((struct) => {
                                return (
                                    <Option key={struct.code}>{struct.name}</Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>

                {/*<Form.Item name="staff" label="Булим" rules={[{required: true, message:'Булимни танланг!'}]}>
                    <Select >
                        {structs &&
                            structs.map((struct) => {
                                return (
                                    <Option key={struct.code}>{struct.name}</Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>*/}

                <Form.Item name="staff" label="Лавозим" rules={[{required: true, message:'Лавозимни танланг!'}]}>

                    {positions &&
                        positions.map((pos, inx) => {
                            return (
                                <Radio.Group key={inx} options={[{label:pos.name, value: pos.code}]}  onChange={setPosValue} value={positionsValue} optionType="button"/>
                            )
                        })
                    }

                </Form.Item>

                <Form.Item name="phonenumber" label="Телефон ракам" rules={[{required: true, message:'Телефон ракамни киритинг!'}]}>
                    {/*<Input addonBefore={prefixSelector} style={{width: '100%'}}/>*/}
                    <Input style={{width: '100%'}}/>
                </Form.Item>

                <Form.Item name="mobilenumber" label="Мобил ракам" rules={[{required: true, message:'Мобил ракамни киритинг!'}]}>
                    {/*<Input addonBefore={prefixMobileSelector} style={{width: '100%'}}/>*/}
                    <Input style={{width: '100%'}}/>
                </Form.Item>

                <Form.Item name="dateopen" label="Очилиш санаси" rules={[{required: true, message:'Очилиш санасини танланг!'}]}>
                    <DatePicker label="data" format={dateFormat} onChange={(date, dateString) => changeDateFormat(date, dateString, 'dateopen')} >

                    </DatePicker>
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
    );
};

export default EmployeeAdd;