import React, {useState, useContext, useEffect} from 'react'
import {render} from 'react-dom'
import {DatePicker, Layout, message, ConfigProvider, theme} from 'antd'
import logo from './logo.svg'
import 'antd/dist/reset.css'
import './i18n';
import './index.css'
import NavigationBar from "./components/NavigationBar";
import {useRoutes} from "./routes/routes"
import {useAuth} from "./hooks/auth.hook"
import {AuthContext} from "./context/AuthContext";
import { Link } from "react-router-dom";
import {BrowserRouter as Router, useNavigate} from 'react-router-dom';

import locale from "antd/es/locale/ru_RU";
import dayjs from "dayjs";
import 'dayjs/locale/uz';
import {ErrorBoundary} from "react-error-boundary";
import FallbackComponent from "./components/ErrorBoundary/FallbackComponent";

function App() {
    // const navigate = useNavigate();
    /*function fallbackRender({ error, resetErrorBoundary }) {
    debugger;
        if (error?.response?.status === 401) {
            localStorage.removeItem('userData');
            navigate("/");
        }
    }*/
    /*const handleChangeRecentComeMenus = (menu) => {
        let currentMenus = JSON.parse(localStorage.getItem('recentComeMenus')) || [];
        let id = Math.round(Math.random() * 100000);
        const item = {key: id.toString(), label: menu.keyPath[0]};
        if (!currentMenus.includes(item)) currentMenus.push(item);
        localStorage.setItem('recentComeMenus', JSON.stringify(currentMenus));
    };*/
    dayjs.locale('uz');

    window.onbeforeunload = (event) => {
        const e = event || window.event;
        e.preventDefault();
        if (e) {
            e.returnValue = "";
        }
        return "";
    };


    const [titleNav, setTitleNav] = useState('Асосий ойна');
    const [date, setDate] = useState(null);
    const handleChange = value => {
        message.info(`Selected Date: ${value ? value.format('YYYY-MM-DD') : 'None'}`);
        setDate(value);
    };

    const {token, login, logout, userId, ready, empId, empFilial, empName} = useAuth();
    const isAuthenticated = !!token;
    const routes = useRoutes(isAuthenticated, setTitleNav);

    /*const navigate = useNavigate();

    useEffect(() => {
        // called when the component is unmounted
        const cleanup = () => {
            logout().then(() => {
                // clear any authentication data
                // redirect to index page
                navigate('/');
            });
        };

        // called when the user navigates away or closes the browser
        window.addEventListener('beforeunload', cleanup);

        return () => {
            window.removeEventListener('beforeunload', cleanup);
        };
    }, [navigate]);*/
useEffect(() => {
    window.addEventListener('error', (event) => {
        // Prevent default browser error display
        event.preventDefault();
    });

},[])

    return (

        <Layout style={{width: '100vw', height: '100vh'}}>
            <AuthContext.Provider value={{
                token, login, logout, userId, isAuthenticated, empId, empFilial, empName
            }}>
                <ConfigProvider
                    theme={{
                        algorithm: theme.defaultAlgorithm,
                        "token": {
                            "wireframe": false,
                            "colorPrimary": "#a49110"
                        }
                    }}
                    locale={locale}
                >

                    <Router>
                        <ErrorBoundary
                            //fallbackRender={fallbackRender}
                            //onReset={(details) => {
                                //Reset the state of your app so the error doesn't happen again
                            //}}
                            FallbackComponent={FallbackComponent}
                        >
                            {isAuthenticated && ready && <NavigationBar titleNav={titleNav} style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'red'
                            }}/>}

                            <Layout style={{width: '100%', height: '100%', backgroundColor: '#c6c6c6'}}>

                                <div style={{width: '100%', height: '100%', backgroundColor: '#c6c6c6'}}>
                                    {routes}
                                </div>

                            </Layout>
                        </ErrorBoundary>
                    </Router>
                </ConfigProvider>

            </AuthContext.Provider>

        </Layout>

    );
}

export default App;
