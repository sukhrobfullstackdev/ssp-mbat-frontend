import React, {useContext, useEffect, useState} from "react";
import {Col, Menu, Row, Radio, Avatar, Tag, Drawer, Timeline, Button, Modal, Space, Form, Select, Input} from "antd";
import {
    ClockCircleOutlined,
    HomeOutlined,
    LogoutOutlined,
    MinusCircleOutlined, PlusOutlined,
    ReloadOutlined,
    UserOutlined
} from "@ant-design/icons";

import {Link, useLocation} from "react-router-dom";
import {Header} from "antd/es/layout/layout";
import {AuthContext} from "../context/AuthContext";
import {useTranslation} from 'react-i18next';

import './comp.css'
import {useAuth} from "../hooks/auth.hook";
import UserProfile from "./User/UserProfile";
import dayjs from "dayjs";
import {Dropdown} from 'antd'
import BarChartOutlined from "@ant-design/icons/es/icons/BarChartOutlined";
import {useDispatch, useSelector} from "react-redux";
import {AreaChartCustom, BarChartCustom, LineChartCustom, PieChartCustom} from "./charts";
import {CHART} from "../store/types/chart/chart";
import {AreaChart} from "recharts";
//import 'dayjs/locale/ru';

const NavigationBar = ({titleNav}) => {
    /*const recentComeMenus = JSON.parse(localStorage.getItem('recentComeMenus')) || [];
    const items = recentComeMenus.map((item) => {
        return {
            key: `${item.key}`,
            label: (
                <Link to={`/layout/${item.label}`}>{item.label}</Link>
            )
        };
    }) || [];*/
//    dayjs.locale('ru');
    /* Chart*/
    const dispatch = useDispatch();
    const query = useSelector((state) => state.chart.query);

    const showingTypesAll = [
        {value: 'pie_chart', label: "Pie Chart"},
        {value: 'bar_chart', label: "Bar Chart"},
        {value: 'line_chart', label: "Line Chart"},
        {value: 'area_chart', label: "Area Chart"},
    ];
    const [operators, setOperators] = useState([
        {value: '=', label: '=', disabled: false},
        {value: 'like', label: 'like', disabled: false},
        {value: 'in', label: 'in', disabled: false},
    ]);
    const [content, setContent] = useState(null);
    const [openModal, setOpenModal] = useState(null);
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useState([]);
    const [showingType, setShowingType] = useState('');

    const onClose = () => {
        setOpen(false);
    };
    const onFinish = (values) => {
        console.log('values', values);
        let filters = [];
        if (values.filters && values.filters.length > 0) {
            for (let fil of values.filters) {
                filters.push({column: fil.column, operator: fil.operator, value: fil.value, dataType: "text"});
            }
        }
        const data = {
            query: {
                id: query.query.id,
                source: query.query.source,
                fields: query.query.fields,
                filters
            }
        };
        dispatch({type: CHART, data});

        if (values.showType === 'line_chart') {
            const res = new LineChartCustom(values.comparing_columns, values.comparing_by);
            setContent(res.draw());
            setOpen(false);
            setOpenModal(true);
        } else if (values.showType === 'area_chart') {
            const res = new AreaChartCustom(values.comparing_columns, values.comparing_by);
            setContent(res.draw());
            setOpen(false);
            setOpenModal(true);
        } else if (values.showType === 'bar_chart') {
            const res = new BarChartCustom(values.comparing_columns, values.comparing_by);
            setContent(res.draw());
            setOpen(false);
            setOpenModal(true);
        } else if (values.showType === 'pie_chart') {
            const res = new PieChartCustom(values.comparing_columns, values.comparing_by);
            setContent(res.draw());
            setOpen(false);
            setOpenModal(true);
        }
    };
    const onChangeShowType = (value) => {
        setShowingType(value);
    };
    const notify = (text) => {
        /*toast.error(text, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });*/
    };
    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };
    const onFinishFailed = (errorInfo) => {
        for (let error of errorInfo.errorFields) {
            notify(error.errors[0]);
        }
    };
    /* Chart*/
    const location = useLocation();

    const auth = useContext(AuthContext);
    const isAuthenticated = !!auth.token;

    const {empId, empName} = useAuth();
    const {t, i18n} = useTranslation();

    const [openProfile, setOpenProfile] = useState(false)
    const [currentTime, setCurrentTime] = useState(dayjs());

    const showProfile = () => {
        setOpenProfile(true)
    }
    const closeProfile = () => {
        setOpenProfile(false)
    }

    const handleLogOut = () => {
        auth.logout()
    };
    const handleLangClick = (event) => {

        return false
        //event.preventDefault();
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleEmpClick = (event) => {
        showProfile()
        return false
        //console.log(event)
        //console.log(event.domEvent)
        //event.domEvent.preventDefault();
    }

    if (!isAuthenticated || location.pathname === '/') {
        return null;
    }

    const handleExtraButtonClick = () => {
        window.onbeforeunload = null;

        window.location.reload(true);
    }

    return (
        <Header className="header" theme="light" style={{backgroundColor: "#262626"}}>
            <Row>
                <Col span={4}>
                    <h2 style={{color: '#fff'}} className="logonav"><span className="logoSavdo"/> <span>SSP-MBAT</span>
                    </h2>
                </Col>

                <Col span={5}>

                    {/*<Dropdown
                        menu={{
                            items,
                        }}
                        trigger={['contextMenu']}
                    >*/}
                    <h3 style={{color: 'rgb(206, 194, 158)', paddingLeft: '10px'}}>{titleNav}</h3>
                    {/*</Dropdown>*/}
                </Col>
                <Col span={15} style={{float: 'right'}}>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['welcome']} selectable={false}
                          style={{justifyContent: 'flex-end', backgroundColor: "#262626"}}>

                        {/*<Menu.Item key="welcome" icon={<MailOutlined />}>*/}
                        {/*    <Link to="/">Welcome</Link>*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="home" icon={<MailOutlined />}>*/}
                        {/*    <Link to="/home">Home</Link>*/}
                        {/*</Menu.Item>*/}

                        <Menu.Item key="dateTime" icon={<ClockCircleOutlined/>}>
                            {currentTime.format('DD MMM YYYY HH:mm:ss')}
                        </Menu.Item>

                        <Menu.Item key="lang" onClick={handleLangClick}>
                            <Radio.Group buttonStyle='solid' defaultValue="uz"
                                         size='small' onChange={(e) => i18n.changeLanguage(e.target.value)}>
                                <Radio.Button value="uz" defaultChecked={true}>Узб</Radio.Button>
                                <Radio.Button value="ru">Рус</Radio.Button>
                            </Radio.Group>
                        </Menu.Item>

                        <Menu.Item key="employee" onClick={handleEmpClick}>

                            <Tag color="#a49110" style={{
                                padding: '4px 10px',
                                color: 'inherit',
                                fontSize: '14px',
                                backgroundColor: "transparent",
                                borderColor: "#796a09"
                            }}>
                                <UserOutlined style={{marginRight: '6px'}}/> {empId} - {empName}
                            </Tag>

                        </Menu.Item>

                        <Menu.Item key="reload" icon={<ReloadOutlined/>}>
                            {/*<Button
                                type="default"
                                onClick={handleExtraButtonClick}
                            >
                                Refresh
                            </Button>*/}
                            <a href="#"
                               onClick={(e) => {
                                   e.preventDefault(); // Prevent the default behavior of the anchor tag
                                   handleExtraButtonClick();
                               }}
                            >
                                {t('refresh')}
                            </a>
                        </Menu.Item>
                        <Menu.Item key="charts" icon={<BarChartOutlined/>} onClick={() => setOpen(true)}/>


                        <Menu.Item key="login" icon={<LogoutOutlined/>}>
                            <Link to="/" onClick={handleLogOut}>{t('exit')}</Link>
                        </Menu.Item>

                    </Menu>
                    <Drawer
                        title="Формирование данных"
                        placement={"right"}
                        closable={false}
                        onClose={onClose}
                        open={open}
                        key={"left"}
                        size={"large"}
                        extra={
                            <Space>
                                <Button danger onClick={onClose}>
                                    Выход
                                </Button>
                            </Space>
                        }
                    >
                        <Row gutter={[8, 24]} style={{marginLeft: 0, marginRight: 0}}>
                            <Col span={24}>
                                <Form
                                    name="basic"
                                    initialValues={{remember: true}}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    style={{marginTop: 30}}
                                    autoComplete="off"
                                >
                                    <Form.Item label="Тип показа" name="showType"
                                               rules={[{required: true, message: 'Пожалуйста, выберите тип показа!'}]}>
                                        <Select
                                            showSearch
                                            placeholder="Выберите тип показа!"
                                            onChange={onChangeShowType}
                                            options={showingTypesAll.map((item) => ({
                                                value: item.value,
                                                label: item.label,
                                            }))}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Сравниваемые столбцы" name="comparing_columns" rules={[{
                                        required: true,
                                        message: 'Пожалуйста, выберите cравниваемые столбцы!'
                                    }]}>
                                        <Select
                                            showSearch
                                            mode="multiple"
                                            placeholder="Выберите столбцы источника!"
                                            onChange={handleChange}
                                            options={query?.query?.fields?.map((item) => ({
                                                value: item.column,
                                                label: item.column,
                                            }))}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Cравнение по" name="comparing_by" rules={[{
                                        required: true,
                                        message: 'Пожалуйста, выберите сравнение по!'
                                    }]}>
                                        <Select placeholder="Select a comparing_by column"
                                                options={query?.query?.fields?.map((item) => ({
                                                    value: item.column,
                                                    label: item.column,
                                                }))}/>
                                    </Form.Item>

                                    <Form.List name="filters">
                                        {(fields, {add, remove}) => (
                                            <>
                                                {fields.map(({key, name, ...restField}) => (
                                                    <div key={key} style={{display: 'flex', gap: 10}}>
                                                        <Form.Item {...restField} name={[name, 'column']} rules={[{
                                                            required: true,
                                                            message: 'Пожалуйста, выберите столбец!'
                                                        }]}>
                                                            <Select style={{width: 150}} options={query?.query?.fields?.map((item) => ({
                                                                value: item.column,
                                                                label: item.column,
                                                            }))}
                                                                    placeholder="Выберите столбец!"/>
                                                        </Form.Item>
                                                        <Form.Item {...restField} name={[name, 'operator']} rules={[{
                                                            required: true,
                                                            message: 'Пожалуйста, выберите оператора!'
                                                        }]}>
                                                            <Select style={{width: 150}} options={operators}
                                                                    placeholder="Выберите оператора!"/>
                                                        </Form.Item>
                                                        <Form.Item {...restField} name={[name, 'value']} rules={[{
                                                            required: true,
                                                            message: 'Пожалуйста, введите значение!'
                                                        }]}>
                                                            <Input placeholder="Введите значение"/>
                                                        </Form.Item>
                                                        <MinusCircleOutlined style={{marginTop: 8}}
                                                                             onClick={() => remove(name)}/>
                                                    </div>
                                                ))}
                                                <Form.Item>
                                                    <Button type="dashed" onClick={() => add()} block
                                                            icon={<PlusOutlined/>}>
                                                        Добавить строку в фильтр
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
                                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                                        <Button ghost type="primary" htmlType="submit">
                                            Сформировать
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Drawer>
                    <Modal
                        title="Результат"
                        centered
                        open={openModal}
                        onOk={() => setOpenModal(false)}
                        onCancel={() => setOpenModal(false)}
                        width={window.innerWidth / 100 * 95}
                        height={window.innerHeight / 100 * 85}
                    >
                        {content}
                    </Modal>
                    <Drawer
                        title="Фойдаланувчи"
                        width={500}
                        placement='right'
                        onClose={closeProfile}
                        open={openProfile}
                        bodyStyle={{
                            paddingBottom: 80,
                        }}
                    >
                        <UserProfile empId={empId}/>

                    </Drawer>

                </Col>

            </Row>
        </Header>
    )
}

export default NavigationBar;