import axios from "../api/axios";

const QUERY_URL = '/api/public/query';

export const fetchDocAction = async (doc_type, auth) => {

    const headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': `Bearer ${auth.token}`,
        'withCredentials': true
    }

    try {

        const actionData = {
            "query": {
                "id": "DOC_ACTION_REF",
                "source": "DOC_ACTION_REF",
                "fields": [
                    {"column": "action", "format": "number", "type": "number"},
                    {"column": "name", "format": "text", "type": "text"},
                ],
                "filters": [{
                    "column": "doc_type",
                    "operator": "=",
                    "value": doc_type,
                    "dataType": "text"
                }]
            }
        }

        const {data} = await axios.post(QUERY_URL,
            (actionData),
            {
                headers: headers,
                withCredentials: false
            });

        const dataform = data.map(row => ({
                key: row.action,
                label: row.name
            })
        )
        return dataform

    } catch (error) {
        console.error('Error fetching itemsAction:', error);
    }

}

