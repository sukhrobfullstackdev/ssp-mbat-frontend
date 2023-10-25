import {
    LaptopOutlined, NotificationOutlined, UserOutlined, BoldOutlined,
    AreaChartOutlined, ContainerOutlined, MenuFoldOutlined, ProjectOutlined, MailOutlined, LogoutOutlined, BankOutlined
} from '@ant-design/icons';
import {Breadcrumb, Calendar, Col, Layout, Menu, Row, Radio, Button, Descriptions, Alert, message} from 'antd';
import React, {useState} from 'react';
import {useNavigate, Outlet} from "react-router-dom";
import './layout.css';
import {lvl1, lvl2} from './MenuData'
import {useEffect, useCallback,useContext } from "react";
import axios from "../api/axios";
import {useAuth} from "../hooks/auth.hook";

import {AuthContext} from "../context/AuthContext";

const { Content, Sider } = Layout;
const MENU_URL = '/api/public/query';

//const items1 = ['1', '2', '3'].map((key) => ({
/*const items1 = lvl1.map((key) => ({
    id: key.id,
    label: key.name,
}));*/


function isDef(ev){
    if (ev!=undefined) return ev; else return [];
}
let keyMenu = 0;

export const LayoutBM = () => {

    let navigate = useNavigate();
    //const handleMenuClick = useCallback((args) => navigate('employeeTab', {replace: true}), [navigate]);

    const [menu, setMenu] = useState('');
    const [stateTab, setStateTab] = useState([]);
    const [topMenu, setTopMenu] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [menus, setMenus] = useState([]);

    const auth = useContext(AuthContext);
    const {empId, empName} = useAuth();

    useEffect(() => {
        if (empId) {
            getDataMenu();
        }
    }, [empId]);

    const getDataMenu = async () => {
        try {

            const headers = {'Content-Type':'application/json;charset=utf-8',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Credentials':'true',
                'withCredentials': true
            }

            const response = await axios.post(MENU_URL,
                JSON.stringify({
                    "query": {
                        "id": "MENU_SSP_HIERARCHY_V",
                        "source": "MENU_SSP_HIERARCHY_V",
                        "fields": [
                            {
                                "column": "id",
                                "format": "number",
                                "type": "number"
                            },
                            {
                                "column": "parent_id",
                                "format": "number",
                                "type": "number"
                            },
                            {
                                "column": "name",
                                "format": "text",
                                "type": "text"
                            },
                            {
                                "column": "url",
                                "format": "text",
                                "type": "text"
                            }
                        ],
                        "filters": [
                            {
                                "column": "emp",
                                "value": empId,
                                "operator": "=",
                                "dataType": "number"
                            },
                        ]
                    }
                }),
                {
                    headers: headers,
                    crossDomain: true,
                    withCredentials: false
                });
            //setLoading(false);
            setStateTab(response?.data.map(row => ({
                menuId: row.id,
                parentId: row.parent_id,
                name: row.name,
                url: row.url,
            })));

            setTopMenu( response?.data.filter(row => (row.parent_id === null)) )

        //setFilials(data);
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


    useEffect(() => {
        //FILTER MENU BEG
        let lvl3 =[];
        let isB = true;
        let lvl4 = stateTab;
        //console.log(lvl4, 'lvl4')
        //const navigate = useNavigate(Router);
        let result = stateTab.filter(function(el) {
            return el.parentId == null?el.menuId:'';
        });

        //console.log(result, 'res')
        for (let key in result){
            lvl3.push(
                stateTab.filter(function(el){
                    return el.parentId == result[key].menuId?el:'';
                })
            );
        }

        setMenus(lvl3)



        //FILTER MENU END
    }, [stateTab])

    useEffect(() => {
        // if (menu != 0) {
        //     navigate('employeeTab');
        // }
    }, [menu])

    const menuIcons = {
        1000: { menuIndex: 0, menuIcon: <UserOutlined /> },
        1500: { menuIndex: 1, menuIcon: <LaptopOutlined /> },
        2000: { menuIndex: 2, menuIcon: <ContainerOutlined /> },
        3000: { menuIndex: 3, menuIcon: <NotificationOutlined /> },
        4000: { menuIndex: 4, menuIcon: <AreaChartOutlined /> },
        5000: { menuIndex: 5, menuIcon: <ProjectOutlined /> },
        4500: { menuIndex: 6, menuIcon: <BankOutlined /> },
    };

    //const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined, AreaChartOutlined, ContainerOutlined].map((icon, index) => {
    const items2 = topMenu.map((elem, index) => {

        const { menuIndex, menuIcon } = menuIcons[elem.id];
        const key = String(index);
        const lvl1Name = lvl1[menuIndex].name;

        //const lvl1Name = lvl1.find(item => item.id === elem.id);

        // for (let key in stateTab) {
        //     if (stateTab[key].parentId == null ) {
        //         lvl3.push(stateTab[key].menuId)
        //     }
        //     //console.error(key + ' - ' + stateTab[key].menuId);
        //
        // }

        //console.error('menus',menus)

        return {
            key: `sub${key}`,
            //icon: React.createElement(menuIcon),
            icon: menuIcon,
            label: lvl1Name,
            size: 'lg',
            children: isDef(menus[key]).map((_, j) => {

                //children: new Array(4).fill(null).map((_, j) => {
                return {
                    key: _.url,
                    label: _.name,
                    menuid: _.menuId,
                    menuparent: _.parentId,
                    /*icon: <MenuFoldOutlined/>*/
                };
            }),
        };
    });

    function clickbb(ev){
        //keyMenu++;
       // console.warn(ev)
       //  handleChangeRecentComeMenus(ev);
        setCollapsed(true);

        ev.key.substring(0,3)!=='tmp'?navigate(ev.key):message.warning('Ривожланишда')
        setMenu(ev.key);
    }

    const hh = '48px';

    return (
        <Layout style={{width:'100%', height:'100%', overflow:"hidden" }}>
            {/*<Header className="header">*/}
            {/*    <div className="logo">eDarslik</div>*/}
            {/*    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} />*/}
            {/*</Header>*/}
            <Layout style={{height:'100%'}}>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value) }
                    width={300} className="site-layout-background">

                    <Menu
                        mode="inline"
                        defaultSelectedKeys={[]}
                        defaultOpenKeys={[]}
                        style={{
                            height: '100%',
                            borderRight: 0,
                            overflowY: 'auto'
                        }}
                        onClick={clickbb}
                        items={items2}

                    />

                </Sider>

                <Layout
                    style={{
                        padding: '0 24px 24px'
                    }}
                >

                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 0,
                            margin: 0,
                            /*height:`calc(100% - ${hh})`,*/
                            minHeight:'100%',
                            overflow: 'auto'
                        }}
                    >

                        <Outlet/>

                    </Content>
                </Layout>
            </Layout>
        </Layout>
    )
};



