import React, {useContext, useState, useEffect} from "react";
import {Button, DatePicker, Form, Input, InputNumber, message, Select, Space} from "antd";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "../../api/axios";
import {LeftOutlined} from "@ant-design/icons";
import {dataSmetaType} from "./SmetaData";
const {TextArea} = Input;

const SAVE_URL = '/admin/roles/save';

const {Option} = Select;
const { RangePicker } = DatePicker;

const QUERY_URL = '/api/public/query';

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

const SmetaAdd = () => {

    const navigate = useNavigate();

    const auth = useContext(AuthContext);
    const [form] = Form.useForm()

    const [smetaTypes  , setSmetaTypes] = useState("");

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

    const getSmetaType = async () => {

        try {

            const headers = {'Content-Type':'application/json;charset=utf-8',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Credentials':'true',
                'withCredentials': true
            }

            const response = await axios.post(QUERY_URL,
                JSON.stringify(dataSmetaType),
                {
                    headers: headers,
                    crossDomain: true,
                    withCredentials: false
                });
            //setLoading(false);
            setSmetaTypes(response?.data);

        } catch (err) {
            if (!err?.response) {
                message.error(err.response?.data);
            } else if (err.response?.status === 400) {
                message.error(err.response?.data ||'INTERNAL');
            } else if (err.response?.status === 401) {
                message.error(err.response?.data ||'UNAUTHORIZED');
            } else if (err.response?.status === 404) {
                message.error(err.response?.data ||'NOT FOUND');
            } else {
                message.error(err.response?.data ||'OTHERS');
            }
            // errRef.current.focus();
        }

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
                    message.success('Роль создана', handleFormExit);
                    //message.success(data);
                    //history.push(`/detail/${data.link._id}`)
                } catch (err) {
                    message.error(err.response?.data);
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

    useEffect(() => {
        getSmetaType()
    }, []);


    return (
        <>
            <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", justifyContent: "left", alignItems:"center", padding:"12px"}}>
                <h3><Button shape="circle" icon={<LeftOutlined />}  style={{fontSize:'14px',marginRight:"10px"}} onClick={handleFormExit}/>Смета яратиш</h3>
            </div>

            <Space direction="horizontal" size="middle" style={{ display: "flex", justifyContent:"center", alignItems: "center", height: "100%", width: "100%", position: "relative", overflow: "hidden" }}/>

            <Form {...layout} name="addTextBook" form={form} scrollToFirstError initialValues={{}} onFinish={onFinish} >
                {/*onFinishFailed={onFinishFailed}*/}

                <Form.Item name="smeta_type" label="Смета тури"  rules={[{ required: true, message:'Смета турини танланг!'}]}>
                    <Select placeholder="Смета турини танланг">
                        {smetaTypes &&
                            smetaTypes.map((elem) => {
                                return (
                                    <Option key={elem.id}>{elem.name}</Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>

                <Form.Item name="finyear" label="Молиявий йил" rules={[{ required: true, message:'Молиявий йилни танланг!'}]}>
                    <DatePicker picker="year" format="YYYY"/>
                </Form.Item>

                <Form.Item name="accid" label="Хисоб ракам" rules={[{required: true, message:'Хисоб ракамни танланг!'}]}>
                    <InputNumber controls={false} />
                </Form.Item>

                <Form.Item name="purpose" label="Детали" rules={[{required: true, message:'Введите детали!'}]}>
                    <TextArea rows={4} showCount maxLength={200} />
                </Form.Item>

                <Form.Item {...tailLayout}>

                    <Button type="primary" htmlType="submit" disabled={true} style={{marginRight:'10px'}} onClick={handleFormSubmit}>
                        Саклаш
                    </Button>

                </Form.Item>

            </Form>
        </>
    )
}

export default SmetaAdd;