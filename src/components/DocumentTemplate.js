import {Button, Form, Input, List, message, Modal, Select} from "antd";
import {DownloadOutlined, SnippetsOutlined, TableOutlined} from "@ant-design/icons";
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

export const DocumentTemplate = ({documentType, handleLoadDocument}) => {

    const auth = useContext(AuthContext)
    const { t } = useTranslation();

    const [form] = Form.useForm()

    const [messageApi, contextHolder] = message.useMessage();

    const [selectedItem, setSelectedItem] = useState('');
    const [listTemplates, setListTemplates] = useState([]);

    const [selectedDocType, setSelectedDocType] = useState([]);

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

    const getTemplate = async () => {

        if (!selectedItem)  {
            messageApi.open({
                type: 'warning',
                content: 'Намунани танланг',
                duration: 2,
            });
            return false
        };

        try {
            const { data } = await axios.get(`/documentTemplate/loadDocumentTemplateById?id=${selectedItem}`,
                {
                    headers: headers,
                    //crossDomain: true,
                    withCredentials: false
                });
            console.log(data,'dataTemplate')
            handleLoadDocument(data.value)
            handleCancelTemplate()
            messageApi.open({
                type: 'success',
                content: 'Намуна юкланди',
                duration: 2,
            });
        } catch (err) {
            messageApi.open({
                type: 'error',
                content: err.response?.data?.message,
                duration: 6,
            });
            //message.error(err.response?.data);
        }

    };

    const dataDocTemplates = {
        "query": {
            "ID": "DOCUMENT_TEMPLATES",
            "source": "DOCUMENT_TEMPLATES",
            "fields": [
                {   "column": "id", "format": "number", "type": "number" },
                {   "column": "name", "format": "text", "type": "text" },
            ]
        }
    }
    const getTemplatesByDoctype = async (v_docType) => {

        const defFilterValue = [
            { "column": "doc_type", "value": v_docType, "operator": "=", "dataType": "text" }
        ];
        dataDocTemplates.query['filters'] = [];
        dataDocTemplates.query.filters.push(...defFilterValue)
        const { data } = await axios.post(QUERY_URL,
            ( dataDocTemplates ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        setListTemplates(data);
        console.log(data,'dataDocTemplates')

    };

    let docTypes  = [
        {"code":"CONTRACT"  , "name": t("contract") },
        {"code":"CASH_APP"  , "name": t("application") },
        {"code":"PAYDOC"    , "name": t("paydoc") },
        {"code":"INVOICE"   , "name": t("invoice") }
    ]

    useEffect(() => {
        console.log(documentType,'llll')
        if (documentType) setSelectedDocType(docTypes.filter(elem => elem.code === documentType))
        getTemplatesByDoctype(documentType)
    }, []);


    //const docTypes  = [{"code":"CONTRACT", "name":"Шартнома"}, {"code":"PAYDOC", "name":"Тулов хужжати"}]


    const onFinish = (values) => {
        console.warn(values);
    }



    const handleItemClick = (item) => {
        setSelectedItem(item.id);
    };

    return (

        <>
            {contextHolder}
            <Button type="default" onClick={showModalTemplate} icon={<SnippetsOutlined />}>
                Намуналар
            </Button>

            <Modal
                title="Хужжат намуналари"
                open={openModalTemplate}
                onOk={handleOkTemplate}
                footer={(
                    <Button type="primary" onClick={() => getTemplate()} icon={<DownloadOutlined />}>
                        Маълумотларни юклаш
                    </Button>
                )}
                confirmLoading={confirmLoadingTemplate}
                onCancel={handleCancelTemplate}
            >


                <Form name="templateForm" style={{maxHeight:'500px', overflowY: 'auto'}} layout='vertical' form={form} scrollToFirstError initialValues={{"docType":selectedDocType?selectedDocType[0]?.code.toString():""}} onFinish={onFinish} >

                    <Form.Item name="docType" label="Хужжат тури" rules={[{ required: true, message:'Хужжат турини танланг!'}]}>

                        <Select onChange={(value) => getTemplatesByDoctype(value)}>
                            {selectedDocType &&
                                selectedDocType.map((doctype) => {
                                    return (
                                        <Option key={doctype.code}>{doctype.name}</Option>
                                    )
                                })
                            }
                        </Select>

                    </Form.Item>

                    <Form.Item>

                        <List
                            size="medium"
                            bordered
                            dataSource={listTemplates}
                            renderItem={(item) =>
                                <List.Item onClick={() => handleItemClick(item)}
                                           style={{
                                               cursor: 'pointer',
                                               backgroundColor: selectedItem === item.id ? '#eeecdf' : 'white',
                                           }}
                                >
                                    {item.name}
                                </List.Item>
                            }
                        />

                    </Form.Item>

                </Form>

            </Modal>
        </>

    )
}





