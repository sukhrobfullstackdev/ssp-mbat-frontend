import {request} from "../../api/request";


export const makeQuery = async (data) => {
    try {
        const response = await request.post('/api/public/query',(data));
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const makeExecute = async (data, params) => {
    try {
        const response = await request.post('/smeta/execute',(data),{params});
        return response.data;
    } catch (error) {
        throw error;
    }
};