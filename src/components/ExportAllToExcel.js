import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';
import axios from "../api/axios";
import {dataTab} from "../pages/Paydoc/PaydocData";
import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";



const QUERY_URL = '/api/public/query';


const exportAllToExcel = async (query, auth) => {

    const headers = {'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const { data: dataTable } = await axios.post(QUERY_URL,
        ( query ),
        {
            headers: headers,
            withCredentials: false
        });
    console.log(dataTable,'kikikiki')
    /* Convert tableData to worksheet */
    const worksheet = XLSX.utils.json_to_sheet(dataTable);

    /* Create workbook and add the worksheet */
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    /* Generate Excel file buffer */
    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
    });

    /* Save the file */
    const excelBlob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'tableData.xlsx');
};

export default exportAllToExcel;