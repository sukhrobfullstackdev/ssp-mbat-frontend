import axios from "../api/axios";
import {notification} from "antd";

export const getClone = async (doc_id, doc_type, auth) => {



    const headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': `Bearer ${auth.token}`,
        'withCredentials': true
    }

    try {

        const queryParams = `docId=${doc_id}&docType=${doc_type}`

        console.log(queryParams)

        const response = await axios.get(`/document/clon?${queryParams.toString()}`,
            {
                headers: headers,
                withCredentials: false
            });

        return response

    } catch (error) {


        return error
    }

}

