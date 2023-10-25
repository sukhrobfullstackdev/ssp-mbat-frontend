import axios from "../../axios";
import {message} from "antd";

const QUERY_URL = '/api/public/query';

const dataNdsType = {
    "query": {
        "id": "NDS_TYPE_REF",
        "source": "NDS_TYPE_REF",
        "fields": [
            {   "column": "id", "format": "number", "type": "number" },
            {   "column": "value", "format": "number", "type": "number" },
            {   "column": "description", "format": "text", "type": "text" },
        ],
    }
}

const getNdsType = async () => {

    try {
        const headers = {'Content-Type':'application/json;charset=utf-8',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Credentials':'true',
            'withCredentials': true
        }
        const response = await axios.post(QUERY_URL,
            JSON.stringify(dataNdsType),
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

export default getNdsType