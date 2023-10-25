import axios from "axios";

const request = axios.create({
    baseURL: 'https://mbatbackend.chamber.uz',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'withCredentials': true
    },
    withCredentials: false
    //baseURL: 'https://mbat.chamber.uz'
    //baseURL: 'http://217.30.161.190:10006'
    //baseURL: 'http://172.24.255.74:9595'
    //baseURL: 'http://95.181.224.113:9595'
    /*baseURL: 'http://10.50.50.145:9797'*/
    //baseURL: 'http://192.168.44.201:8383'
});
request.interceptors.request.use(
    (config) => {
        const {token} = JSON.parse(localStorage.getItem('userData'));
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {

            }
        }
        return Promise.reject(error);
    }
);
export {request}

