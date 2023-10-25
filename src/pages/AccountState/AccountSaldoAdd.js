import React, {useContext, useEffect, useState} from "react";
import {Button, DatePicker, Divider, Form, Input, InputNumber, message, Space} from "antd";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "../../api/axios";
import NumberInputBM from "../../components/NumberInput";
import {NumericInput} from "../../libs/formbm";
import TableModal from "../../components/TableModalBM";
import {columnsAcc, dataSmetaAccFilter, dataSmetaAccTab} from "../Smeta/SmetaData";
import {useTranslation} from "react-i18next";
import {dataMonitorAccFilter, dataMonitorAccTab} from "./AccountStateData";

const QUERY_URL = '/api/public/query';
const SAVE_URL = '/account_saldo/save';

const AccountSaldoAdd = ({closeSavedSaldo, accCode, accId}) => {

    const navigate = useNavigate();

    const { t } = useTranslation()

    const auth = useContext(AuthContext);
    const [form] = Form.useForm()
    const [formPassword] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const [docDate  , setDocDate] = useState("");
    const [currencyLabel, setCurrencyLabel] = useState('сум')

    const [loading, setLoading] = useState(true);


    const headers = {
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const dataAccStateTab = {
        "query": {
            "id": "GET_ACCOUNT_SALDO_PREV_SALDO",
            "source": "GET_ACCOUNT_SALDO_PREV_SALDO",
            "fields": [
                {   "column": "saldo_out", "format": "text", "type": "text" },
            ]
        }
    }

    const getSaldoOutData = async (v_operDay) => {

        setLoading(true)

        console.log(v_operDay,'v_operDay')
        console.log(accCode,'accCode')

        dataAccStateTab.query.source = "GET_ACCOUNT_SALDO_PREV_SALDO('"+accCode+"','"+v_operDay+"')"

        const { data } = await axios.post(QUERY_URL,
            ( dataAccStateTab ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });

        console.log(data,'qweqwe')

        //setStateTab(data);
        setLoading(false);
        if (data.length === 0) form.setFieldValue('saldoIn', 0)
        else form.setFieldValue('saldoIn', data[0].saldo_out)
        //setFilterTab( dataMonitorAccFilter );

    };

    const onFinish = async (values) => {

        values["operDay"] = docDate
        console.log(values,'llllasd')
        //const userLogin = form.getFieldValue("login");
        //const userPass = values.passwordNew;
        try {
            const data = await axios.post(SAVE_URL,

                JSON.stringify(values),
                {
                    headers: headers
                }
                // )
            ).then(response => { console.log(response, 'response')} )
            message.success('Колдик киритилди');
            closeSavedSaldo()

        } catch (err) {
            message.error(err.response?.data?.message);
        }
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    const changeAccCode = (res) => {
        form.setFieldValue('acc',res.code)
        form.setFieldValue('accId',res.id)
        form.setFieldValue('accName',res.name)
    }

    function changeDateFormat(date, dateString){
        setDocDate(dateString)
        getSaldoOutData(dateString)
    }

    const calcSaldoOut = (value) => {

        const getValue = (value) => {
            return value === '' || value === null ? 0 : parseInt(value);
        };

/*        console.log(form.getFieldValue("saldoIn"))
        console.log(form.getFieldValue("debet"))
        console.log(form.getFieldValue("credit"))*/

        let saldoIn = getValue(form.getFieldValue("saldoIn")),
            debet   = getValue(form.getFieldValue("debet")),
            credit  = getValue(form.getFieldValue("credit")),
            saldoOut= saldoIn + debet - credit;

        form.setFieldValue("saldoOut", saldoOut)
    }

    return (
        <>
            {contextHolder}
            <Space direction="horizontal" size="middle" style={{ display: "flex", justifyContent:"center", alignItems: "center", height: "100%", width: "100%", position: "relative", overflow: "hidden"}}/>

            <Form name="userProfile" form={form} scrollToFirstError onFinish={onFinish} layout='vertical' style={{paddingTop: 20}}
                  initialValues={{"acc":accCode,"accId":accId,"saldoIn":0,"saldoOut":0,"debet":0, "credit":0}}
            >

                <Space>

                    <Form.Item name="operDay" label="Операцион кун" rules={[{ required: true, message:'Операцион кунни танланг!'}]} >
                        <DatePicker label="Операцион кун" format='DD.MM.YYYY' onChange={changeDateFormat}/>
                    </Form.Item>

                    <Form.Item name="acc" hidden={false} label="Хисоб ракам" rules={[{ required: true, message:'Хисоб ракамни танланг!'}]} >
                        {/*<InputNumber maxLength="20" width="200px"/>*/}
                        <NumberInputBM readOnly='readOnly'/>
                    </Form.Item>

                    {/*<TableModal modalDataTab={dataSmetaAccTab(auth.empId)}
                                modalColumnTab={columnsAcc(t)}
                                modalFilterTab={dataSmetaAccFilter}
                                modalTitleTab="Хисоб ракамлар"
                                onSubmit={ changeAccCode }
                    />*/}

                </Space>

                <Form.Item name="accName" hidden={true} rules={[{ required: false, message:'Хисоб ракамни номи буш!'}]} style={{ width:"400px"}}>
                    <Input readOnly="true"/>
                </Form.Item>

                <Form.Item name="accId" label="accId" hidden={true}>
                    <Input type="text" />
                </Form.Item>

                <Space>

                    <Form.Item name="saldoIn" label="Кун бошига" rules={[{required: false, message:'Кун бошига суммасини киритинг!'}]}>
                        <InputNumber disabled={true}
                            style={{
                                width: '100%',
                                textAlign: 'end',
                                justifySelf: 'right'
                            }}
                            className='bm-input-number-align-right'
                            defaultValue={0}
                            step={null}
                            controls={false}
                            onFocus={(e)=>e.target.select()}
                            readOnly={true}
                            addonAfter={currencyLabel}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    <Form.Item name="saldoOut" label="Кун охирига" rules={[{required: false, message:'Кун охирига суммасини киритинг!'}]}>
                        <InputNumber  disabled={true}
                            style={{
                                width: '100%',
                                textAlign: 'end'

                            }}
                            className='bm-input-number-align-right'
                            defaultValue={0}
                            step={null}
                            controls={false}
                            readOnly={true}
                            onFocus={(e)=>e.target.select()}
                            addonAfter={currencyLabel}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                </Space>

                <Space>

                    <Form.Item name="debet" label="Дебет" rules={[{required: false, message:'Дебетни киритинг!'}]}>
                        <InputNumber
                            style={{
                                width: '100%',
                                textAlign: 'end'

                            }}
                            className='bm-input-number-align-right'
                            defaultValue={0}
                            step={null}
                            controls={false}
                            onFocus={(e)=>e.target.select()}
                            onChange={calcSaldoOut}
                            addonAfter={currencyLabel}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    <Form.Item name="credit" label="Кредит" rules={[{required: false, message:'Кредитни киритинг!'}]}>
                        <InputNumber
                            style={{
                                width: '100%',
                                textAlign: 'end'

                            }}
                            className='bm-input-number-align-right'
                            defaultValue={0}
                            step={null}
                            controls={false}
                            onFocus={(e)=>e.target.select()}
                            onChange={calcSaldoOut}
                            addonAfter={currencyLabel}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />

                    </Form.Item>

                </Space>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{marginRight:'10px'}}>
                        Саклаш
                    </Button>
                </Form.Item>

            </Form>

        </>
    )
}

export default AccountSaldoAdd;