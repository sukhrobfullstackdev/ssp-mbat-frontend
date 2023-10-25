import React, { useEffect } from "react";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {Button, Form, Input, message, Space} from 'antd';
import {columnsAcc, dataSmetaAccFilter, dataSmetaAccTab} from "../Smeta/SmetaData";
import TableModal from "../../components/TableModalBM";
import {useTranslation} from "react-i18next";
import {columnsBank, dataBank, dataBankFilter} from "./VendorData";
import NumberInputBM from "../../components/NumberInput";


const VendorPoints = (props) => {

    const { t } = useTranslation();
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(()=> {
        form.setFieldsValue({bankAcc: props.bankAccounts})
    }, [])

    const changeAccCode = (res, key) => {

        //let bankAcc = form.getFieldValue('bankAcc');
        let bankAcc = form.getFieldsValue('bankAcc').bankAcc;

// Check If `guests` exist & guest is an array & it's not empty
        if (bankAcc /*&& Array.isArray(bankAcc) && bankAcc.length*/) {
            // Check If firstName exists at that `index`
            //if (bankAcc[key]?.acc) {
                bankAcc[key].mfo = res.code;
                bankAcc[key].mfoName = res.name;
                form.setFieldsValue({ bankAcc });
            //}
        }

        console.log(res,'res');
        console.log(key,'index');
        console.log(form,'form');

        /*form.setFieldsValue('acc',res.code)
        form.setFieldsValue('accName',res.name)
        form.setFieldsValue('mfo',res.id)*/
    }

    const onFinish = (values) => {
        console.log('Received values of form:', values);
        delete values.name
        props.setSpecData(values)
        messageApi.open({
            type: 'success',
            content: 'Сакланди',
            duration: 2,
        });
    };

    return (
        <>
        {contextHolder}
        <Form
            name="form"
            form={form}
            onFinish={onFinish}
            style={{
                maxWidth: 750,
            }}
            autoComplete="off"
        >
            <Form.List name="bankAcc">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, index, ...restField }) => (
                            <Space
                                key={key}
                                style={{
                                    display: 'flex',
                                    marginBottom: 8,
                                }}
                                align="baseline"
                            >
                                <Form.Item
                                    {...restField}
                                    name={[name, 'mfo']}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Банк коди',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Банк коди" readOnly='readonly'/>
                                </Form.Item>

                                <Form.Item
                                    {...restField}
                                    name={[name, 'mfoName']}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Missing first name',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Номи" readOnly='readonly'/>
                                </Form.Item>

                                <Form.Item
                                    {...restField}
                                    name={[name, 'account']}
                                    rules={[
                                        { required: true, message: 'Хисоб ракам'},
                                        { min: 20, message: 'Хисоб ракам 20 хонали сон булиши керак!' },
                                        { max: 20, message: 'Хисоб ракам 20 хонали сон булиши керак!' }
                                    ]}
                                >
                                    <NumberInputBM
                                        style={{ width: '100%' }}
                                        maxLength={20}
                                        placeHolder='Хисоб ракам'
                                        showCount={true}
                                    />
                                </Form.Item>

                                <TableModal modalDataTab={dataBank}
                                            modalColumnTab={columnsBank}
                                            modalFilterTab={dataBankFilter}
                                            modalTitleTab={'Банклар руйхати'}
                                            onSubmit={(res) => changeAccCode( res, key )}
                                />

                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Кушиш
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Саклаш
                </Button>
            </Form.Item>
        </Form>
        </>
)};
export default VendorPoints;