import React, {useContext, useEffect, useState} from 'react';
import {Button, message, Space, Tag, Transfer} from 'antd';
import {LeftOutlined} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "../../api/axios";
import {dataTab, roleTransferTab} from "./AccessRoleData";
import {AuthContext} from "../../context/AuthContext";

const SAVE_URL = '/admin/access-roles/saveAll';
const DELETE_URL = '/admin/access-menu/deleteAccessToRoleFromEmployer';
const QUERY_URL = '/api/public/query';

const AccessRole = () => {

    const navigate = useNavigate();

    const auth = useContext(AuthContext);
    const [mockData, setMockData] = useState([]);
    const [targetKeys, setTargetKeys] = useState([]);

    const headers = {'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }


    let location = useLocation();
    const empId = location.state.empId;

    const getMock = async () => {
        let tempTargetKeys = []

        const menuData = await axios.post(QUERY_URL,
            ( dataTab ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });

        console.log(menuData,'ttrr')

        const filterMenu = menuData.data.filter(el => el?.id); //REMOVING PARENT_ID IS NULL

        filterMenu.forEach(row => {
            let parent = menuData.data.find(function (el) { return el.id === row.id })
            row.name = parent.name;
            row['chosen'] = 'false';
        });
        console.log(filterMenu,'filterMenu');

        roleTransferTab.query['filters'] = [
            {"column": "empid", "value": empId, "operator": "=", "dataType": "number",},
        ];

        const respData = await axios.post(QUERY_URL,
            ( roleTransferTab ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });

        const filterData = respData.data.filter(el => el?.empid);
        filterMenu.forEach(row => {
            let isChosen = respData.data.find(el => el.id === row.id);
            if (isChosen) row['chosen'] = isChosen?.chosen;
        });

        setMockData(filterMenu.map(row => {
            return ({
                key: row.id,
                name: row.name,
                chosen: row.chosen
            });
        }));


        respData.data.forEach(row => {
            tempTargetKeys.push(row.id);
        });
        setTargetKeys(tempTargetKeys);

    };

    useEffect(() => {
        getMock();
    }, []);

    const handleChange = async (newTargetKeys, direction, moveKeys) => {
        console.log(newTargetKeys, direction, moveKeys);
        setTargetKeys(newTargetKeys);
        let submitStr = []
        moveKeys.forEach(elem =>
            submitStr.push({
                "emp": empId,
                "role": elem,
                "description": "TESTFORM"
            })
        )
        console.log(submitStr,'sdasdasd')
        try {
            if (direction === 'right') {

                const data = await axios.post(SAVE_URL,
                    submitStr,
                    {
                        headers: headers,
                        withCredentials: false
                    }).then(response => {
                    console.log(response, 'response')
                })
                message.success('Муввафакият');

            } else {

                const data = await axios.post(DELETE_URL,
                    submitStr,
                    {
                        headers: headers,
                        withCredentials: false
                    }).then(response => {
                    console.log(response, 'response')
                })
                message.success('Модул учирилди');

            }
        } catch (err) {
            message.error(err.response?.data?.message);
        }
    };

    const renderItem = (item) => {
        const customLabel = (
            <span className="custom-item">
                {item.key} -- {item.name}
            </span>
        );
        return {
            label: customLabel,
            // for displayed item
            value: item.name, // for title and filter matching
        };
    };


    const handleFormSubmit = () => {}
    /*const handleFormSubmit = () => {

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
    }*/

    const handleFormExit = () => {
        //console.log(targetKeys,'asdasd');
        console.log(mockData,'asdasd');
        navigate(-1)
    }

    return (
        <>
            <div style={{display:"flex", flexDirection:"row", gap:"10px", height:"64px", justifyContent: "left", alignItems:"center", padding:"12px"}}>

                {/*<Button type="primary" htmlType="submit" style={{marginRight:'10px'}} onClick={handleFormExit}>*/}
                {/*<LeftCircleFilled onClick={handleFormExit} style={{ fontSize: '34px', color: '#08c', marginRight:'10px', }}/>*/}
                {/*</Button>*/}
                <h2><Button shape="circle" icon={<LeftOutlined />}  style={{fontSize:'14px',marginRight:"10px"}} onClick={handleFormExit}/>Модулларни ролга боглаш</h2>
            </div>

            <Space direction="vertical" size="middle" style={{ width: '100%', height:'100%', padding:"12px" }}>

                <Tag color="blue" style={{fontSize: '14px', padding:'6px 10px'}}>Роль: {location.state.empId} - {(location.state?.empName)}</Tag>

                {/*<Button type="primary" htmlType="submit" style={{marginRight:'10px'}} onClick={handleFormSubmit}>
                    Саклаш
                </Button>*/}

                <Transfer
                    dataSource={mockData}
                    listStyle={{
                        width: '50%',
                        height: '50%',
                    }}
                    titles={['Богланмаганлар', 'Богланганлар']}
                    targetKeys={targetKeys}
                    onChange={handleChange}
                    render={renderItem}
                />
            </Space>
        </>
    );
};
export default AccessRole;