import {Button, Form, Input, List, message, Modal, Select} from "antd";
import {DownloadOutlined, PlusCircleOutlined, SnippetsOutlined, TableOutlined, UploadOutlined} from "@ant-design/icons";
import React, {useContext, useEffect, useState} from "react";
import axios from "../api/axios";
import {AuthContext} from "../context/AuthContext";
import {useTranslation} from "react-i18next";

const {Option} = Select;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
};

const QUERY_URL = '/api/public/query';
const SAVE_URL = '/documentTemplate/save';

export const DocumentTemplateSave = ({documentType, documentValues, handleSaveTemplate}) => {

    const auth = useContext(AuthContext)
    const { t } = useTranslation();

    const [form] = Form.useForm()

    const [messageApi, contextHolder] = message.useMessage();

    const [selectedItem, setSelectedItem] = useState('');
    const [listTemplates, setListTemplates] = useState([]);

    const [openModalTemplate, setOpenModalTemplate] = useState(false);
    const [confirmLoadingTemplate, setConfirmLoadingTemplate] = useState(false);
    const showModalTemplate = () => {
        setOpenModalTemplate(true);
    };

    const handleOkTemplate = () => {

        setConfirmLoadingTemplate(true);
        setTimeout(() => {
            setOpenModalTemplate(false);
            setConfirmLoadingTemplate(false);
        }, 2000);
    };

    const handleCancelTemplate = () => {
        setOpenModalTemplate(false);
    };

    const headers = {
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const saveTemplate = async (docValues) => {

        const nameTemplate = form.getFieldValue("nameTemplate")
        if (!nameTemplate) {
            messageApi.open({
                type: 'warning',
                content: 'Намуна номини киритинг',
                duration: 2,
            });
            return
        }

        const formValues = handleSaveTemplate()
        if (formValues === false) return

        const dataTemplate = {
            "docType": documentType,
            "name": nameTemplate,
            "value": formValues
        }

        try {
            const { data } = await axios.post(SAVE_URL,
                ( dataTemplate ),
                {
                    headers: headers,
                    //crossDomain: true,
                    withCredentials: false
                });
            messageApi.open({
                type: 'success',
                content: 'Намуна сакланди',
                duration: 2,
            }).then(()=> handleCancelTemplate());
        } catch (err) {
            messageApi.open({
                type: 'error',
                content: err.response?.data?.message,
                duration: 6,
            });
            //message.error(err.response?.data);
        }


    };

    const onFinish = (values) => {
        console.warn(values);
    }

    return (

        <>
            {contextHolder}
            <Button type="default" onClick={showModalTemplate} icon={<PlusCircleOutlined />}>
                Намунани Сақлаш
            </Button>

            <Modal
                title="Намунани сақлаш"
                open={openModalTemplate}
                onOk={handleOkTemplate}
                footer={(
                    <Button type="primary" onClick={() => saveTemplate()} icon={<UploadOutlined />}>
                        Намунани саклаш
                    </Button>
                )}
                confirmLoading={confirmLoadingTemplate}
                onCancel={handleCancelTemplate}
            >


                <Form name="templateForm" layout='vertical' form={form} scrollToFirstError initialValues={{}} onFinish={onFinish} >

                    <Form.Item
                        name="nameTemplate"
                        label="Намуна номи"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                </Form>

            </Modal>
        </>

    )
}

