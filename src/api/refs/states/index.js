import axios from "../../axios";
import {message} from "antd";

const QUERY_URL = '/api/public/query';

const dataDocStates = {
    "query": {
        "id": "DOC_STATE_REF",
        "source": "DOC_STATE_REF",
        "fields": [
            {   "column": "doc_type", "format": "text", "type": "text" },
            {   "column": "state", "format": "number", "type": "number" },
            {   "column": "name", "format": "text", "type": "text" },
        ],
    }
}

const getDocState = async (doctype) => {

    try {
        const headers = {'Content-Type':'application/json;charset=utf-8',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Credentials':'true',
            'withCredentials': true
        }

        const doctypeFilter = [{
            column: 'doc_type',
            operator: '=',
            value: doctype,
            dataType: 'text'
        }]
        dataDocStates.query['filters'] = doctypeFilter
        const response = await axios.post(QUERY_URL,
            JSON.stringify(dataDocStates),
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

export default getDocState