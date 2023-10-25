import axios from "../../axios";
import {message} from "antd";

const QUERY_URL = '/api/public/query';

const dataFilials = {
    "query": {
        "id": "FILIAL_REF",
        "source": "FILIAL_REF",
        "fields": [
            {   "column": "code", "format": "text", "type": "text" },
            {   "column": "name", "format": "text", "type": "text" },
        ],
    }
}

const getFilials = async () => {

    try {
        const headers = {'Content-Type':'application/json;charset=utf-8',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Credentials':'true',
            'withCredentials': true
        }
        const response = await axios.post(QUERY_URL,
            JSON.stringify(dataFilials),
            {
                headers: headers,
                crossDomain: true,
                withCredentials: false
            });
        //setLoading(false);
        return response?.data

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

export default getFilials