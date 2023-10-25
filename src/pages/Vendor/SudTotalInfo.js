import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Modal, Spin } from 'antd'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from '../../api/axios'
import {AuthContext} from "../../context/AuthContext";

const SudTotalInfo = ({inn}) => {
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
    const handleOpen = async () => {
        setIsModalOpen(true);
        if (Object.keys(info).length === 0) {
            const { data } = await axios.get(`/vendor/info/sudTotalInfo?inn=${inn}`,
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
            setInfo(data)
        }
        setLoading(false)
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    }

    return (
        <>
            <Button type="primary" onClick={handleOpen}>
                <InfoCircleOutlined /> Суд ишлари тугрисида маълумот
            </Button>
            <Modal
                title={t("Суд ишлари тугрисида маълумот")}
                open={isModalOpen}
                cancelText={t("cancel")}
                onCancel={handleCancel}
                width={900}
                okButtonProps={{ style: { display: 'none' } }}
                >
                    <Spin spinning={loading} size='large'>
                        {Object.entries(info).map(item => {
                            console.log(JSON.parse(item[1].data));
                            return (
                                <div className='list'>
                                    <div className='key'>{t(item[0])}</div>
                                    <div  className='value'>{JSON.parse(item[1].data).count}</div>
                                </div>
                            )
                        })}
                    </Spin>
            </Modal >
        </>
    )
}

export default SudTotalInfo