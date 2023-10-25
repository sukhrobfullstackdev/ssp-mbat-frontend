import { InfoCircleOutlined } from '@ant-design/icons'
import {Button, Form, Input, Modal, notification, Space, Spin} from 'antd'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from '../../api/axios'
import {AuthContext} from "../../context/AuthContext";
import TextArea from "antd/es/input/TextArea";

const TaxRiskAnalyzeInfo = ({inn}) => {
    const { t } = useTranslation();
    const auth = useContext(AuthContext)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState({});
    const headers = {
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const [api, contextHolder] = notification.useNotification();
    const openNotification = () => {
        api.warning({
            message: 'Солик тугрисида маълумот',
            description: `${inn} ИНН буйича маълумот топилмади`,
            placement: 'top',
        });
    };
    const handleOpen = async () => {

        //if (Object.keys(info).length === 0) {
            const { data } = await axios.get(`/vendor/info/taxRiskAnalyzeInfo?inn=${inn}`,
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
            setInfo(data)
        //}

        setLoading(false)
        if (data.success === true) setIsModalOpen(true);
        if (data.success === false) openNotification();
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    }

    return (
        <>
            {contextHolder}
            <Button type="primary" onClick={handleOpen}>
                <InfoCircleOutlined /> Солик тугрисида маълумот
            </Button>
            <Modal
                title={t("Солик тугрисида маълумот")}
                open={isModalOpen}
                cancelText={t("cancel")}
                onCancel={handleCancel}
                width={900}
                footer={[]}
                //okButtonProps={{ style: { display: 'none' } }}
                >
                    <Spin spinning={loading} size='large'>
                        {/*{Object.entries(info).map(item => {*/}
                        { info && info.success === false && isModalOpen &&  (
                            <div>
                                <h4>Маьлумот топилмади</h4>
                            </div>
                        )}
                        { info && info.success === true && isModalOpen &&  (

                                <div className='list'>
                                    {/*<div className='key'>{item[0]}</div>
                                   <div className='value'>{item[1]}</div>}*/}
                                    <Form layout="vertical">

                                        <Space direction="horizontal">

                                            <Form.Item label={t("inn")} style={{width:100}}>
                                                <Input readOnly value={info.data.tin} />
                                            </Form.Item>
                                            <Form.Item label={t('regDate')} style={{width:200}}>
                                                <Input readOnly value={info.data.regDate} />
                                            </Form.Item>
                                            <Form.Item label={t('regNumb')} style={{width:200}}>
                                                <Input readOnly value={info.data.regNum} />
                                            </Form.Item>
                                            <Form.Item label={t('nds')} style={{width:100}}>
                                                <Input readOnly value={info.data.vatState} />
                                            </Form.Item>
                                            <Form.Item label={t('taxGap')} style={{width:100}}>
                                                <Input readOnly value={info.data.taxGap} />
                                            </Form.Item>

                                        </Space>

                                        <Space direction='horizontal'>

                                            <Form.Item label={t('name')} style={{width:250}}>
                                                <TextArea size="medium" value={info.data.name} spellCheck={false} autoSize={{
                                                    minRows: 3,
                                                    maxRows: 5,
                                                }}/>
                                            </Form.Item>
                                            <Form.Item label={t("state")} style={{width:250}}>
                                                <TextArea size="medium" value={info.data.stateName} spellCheck={false} autoSize={{
                                                    minRows: 3,
                                                    maxRows: 5,
                                                }}/>
                                                {/*<Input readOnly value={info.data.stateName} />*/}
                                            </Form.Item>
                                            <Form.Item label={t('address')} style={{width:250}}>
                                                <TextArea size="medium" value={info.data.address} spellCheck={false} autoSize={{
                                                    minRows: 3,
                                                    maxRows: 5,
                                                }}/>
                                                {/*<Input readOnly value={info.data.address} />*/}
                                            </Form.Item>

                                        </Space>

                                        <Space direction='horizontal'>

                                            <Form.Item label="NC1 Name" style={{width:250}}>
                                                <TextArea size="medium" value={info.data.nc1Name} spellCheck={false} autoSize={{
                                                    minRows: 3,
                                                    maxRows: 5,
                                                }}/>
                                                {/*<Input readOnly value={info.data.nc1Name} />*/}
                                            </Form.Item>
                                            <Form.Item label="NC5 Name" style={{width:250}}>
                                                <TextArea size="medium" value={info.data.nc5Name} spellCheck={false} autoSize={{
                                                    minRows: 3,
                                                    maxRows: 5,
                                                }}/>
                                                {/*<Input readOnly value={info.data.nc5Name} />*/}
                                            </Form.Item>
                                            <Form.Item label="NC6 Name" style={{width:250}}>
                                                <TextArea size="medium" value={info.data.nc6Name} spellCheck={false} autoSize={{
                                                    minRows: 3,
                                                    maxRows: 5,
                                                }}/>
                                                {/*<Input readOnly value={info.data.nc6Name} />*/}
                                            </Form.Item>


                                        </Space>

                                    </Form>
                                </div>

                            )
                        }

                    </Spin>
            </Modal >
        </>
    )
}

export default TaxRiskAnalyzeInfo