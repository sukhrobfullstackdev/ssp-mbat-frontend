import React, {useState} from 'react';
import * as XLSX from "xlsx";
import {Button, message} from "antd";
import * as ExcelJS from "exceljs";
import axios from "../../api/axios";
import {dataSmetaExcel} from "./SmetaData";

const QUERY_URL = '/api/public/query';

const SmetaPrint = ({dataRow, reqHeader}) => {

    const [open, setOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const printTable = () => {
        // Create a new worksheet
        const ws = XLSX.utils.aoa_to_sheet([["Column 1", "Column 2", "Column 3"]]);

        // Set the width of the first column (A) to 15 characters
        ws['!cols'] = [{ wch: 50 }];

        // Set the alignment of a specific cell (A1) to center
        const cellA1Style = { alignment: { horizontal: 'center' } };
        ws['A1'].s = cellA1Style;

        // Merge cells A1 to C1 (colspan)
        /*ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];*/
        //ws['A2'].v = 'asdasd'
        // Add data to the worksheet
        XLSX.utils.sheet_add_aoa(ws, [["Data 1", "Data 2", "Data 3"]]);
//        XLSX.utils.sheet_add_aoa(ws);


        // Save the workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        XLSX.writeFile(wb, 'smeta.xlsx');

    };


    const getSmetaData = async () => {
        console.log(reqHeader,'reqHeader')

        dataSmetaExcel.query.source = "GET_SMETA_EXPENSES_EXCEL_BY_ID("+dataRow.id+")"

        const { data } = await axios.post(QUERY_URL,
            ( dataSmetaExcel ),
            {
                headers: reqHeader,
                withCredentials: false
            });
        console.log(data,'lololololo')
        return data;


    };

    const printTableExcelJs = async () => {

        const data = await getSmetaData(); // Replace 'YOUR_API_URL' with the actual API endpoint
        console.log(data,'lololololo')

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Paydoc');

        // Define custom styles
        const titleStyle = {
            font: { bold: true, size: 12 },
            alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
            border: {
                top: { style: 'medium', color: { argb: 'AAAAAA' } },
                bottom: { style: 'medium', color: { argb: 'AAAAAA' } },
                right: { style: 'medium', color: { argb: 'AAAAAA' } },
                left: { style: 'medium', color: { argb: 'AAAAAA' } }
            },

        };

        const centeredStyle = {
            font: { bold: true, size: 10 },
            alignment: { horizontal: 'center', vertical: 'middle' },
            border: {
                top: { style: 'medium', color: { argb: 'AAAAAA' } },
                bottom: { style: 'medium', color: { argb: 'AAAAAA' } },
                right: { style: 'medium', color: { argb: 'AAAAAA' } },
                left: { style: 'medium', color: { argb: 'AAAAAA' } }
            },
        };

        const rightenStyle = {
            font: { bold: true, size: 10 },
            alignment: { horizontal: 'right', vertical: 'middle' },
            border: {
                top: { style: 'medium', color: { argb: 'AAAAAA' } },
                bottom: { style: 'medium', color: { argb: 'AAAAAA' } },
                right: { style: 'medium', color: { argb: 'AAAAAA' } },
                left: { style: 'medium', color: { argb: 'AAAAAA' } }
            },
        };

        worksheet.columns = [
            { width: 6 }, // Column A
            { width: 60 }, // Column B
            { width: 17 }, // Column C
            { width: 15 }, // Column D
            { width: 15 }, // Column E
            { width: 15 }, // Column F
            { width: 15 }, // Column G
        ];

        worksheet.getRow(1).height = 170
        worksheet.getRow(2).height = 63


        // Set cell values and apply the defined styles
        worksheet.mergeCells('A1:B1');
        const cellValue = `КЕЛИШИЛДИ\n Ўзбекистон Республикаси\n Савдо-саноат палатаси\n раиси ўринбосари\n _________________\n "____" _____________ 2023й.`;

        // Set the cell value
        worksheet.getCell('A1').value = cellValue;
        worksheet.getCell('A1').style = titleStyle;

        worksheet.mergeCells('D1:G1');
        worksheet.getCell('D1').value = `"ТАСДИКЛАЙМАН"\n Ўзбекистон Республикаси\n Савдо-саноат палатаси\n Жиззах вилоят ҳудудий бошқармаси\n бошлиғи\n _________________\n "____" _____________ 2023й.`;
        worksheet.getCell('D1').style = titleStyle;


        worksheet.mergeCells('A2:G2');
        worksheet.getCell('A2').value = `Ўзбекистон Савдо-саноат палатаси\n Жиззах вилояти бошқармасининг 2023 йил учун\n ХАРАЖАТЛАР ВА ДАРОМАДЛАР СМЕТАСИ`;
        worksheet.getCell('A2').style = titleStyle;

        worksheet.getCell('G3').value = `минг сум`;
        worksheet.getCell('G3').style = titleStyle;

        worksheet.mergeCells('A4:A5');
        worksheet.getCell('A4').value = `№`;
        worksheet.getCell('A4').style = titleStyle;

        worksheet.mergeCells('B4:B5');
        worksheet.getCell('B4').value = `Харажатлар номи`;
        worksheet.getCell('B4').style = titleStyle;

        worksheet.mergeCells('C4:C5');
        worksheet.getCell('C4').value = `Йиллик режа`;
        worksheet.getCell('C4').style = titleStyle;

        worksheet.mergeCells('D4:G4');
        worksheet.getCell('D4').value = `Чораклар бўйича`;
        worksheet.getCell('D4').style = titleStyle;
        worksheet.getCell('D5').value = `I`;
        worksheet.getCell('D5').style = titleStyle;
        worksheet.getCell('E5').value = `II`;
        worksheet.getCell('E5').style = titleStyle;
        worksheet.getCell('F5').value = `III`;
        worksheet.getCell('F5').style = titleStyle;
        worksheet.getCell('G5').value = `IV`;
        worksheet.getCell('G5').style = titleStyle;

        const sumFormat = (sum) => parseFloat(sum).toLocaleString("en-EN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })

        for (let i = 0; i < data.length; i++) {
            const row = worksheet.getRow(i + 6);
            // Assuming data is an array of objects, you can access the data properties accordingly.
            row.getCell('A').value = i + 1;
            row.getCell('B').value = data[i].name;
            row.getCell('C').value = data[i].code;
            row.getCell('D').value = sumFormat(data[i].totalquart1);
            row.getCell('E').value = sumFormat(data[i].totalquart2);
            row.getCell('F').value = sumFormat(data[i].totalquart3);
            row.getCell('G').value = sumFormat(data[i].totalquart4);

            // Center-align cells A, B, and C
            ['C'].forEach(col => {
                row.getCell(col).alignment = { horizontal: 'center', vertical: 'middle' };
            });

            // Right-align cells D, E, F, and G
            ['D', 'E', 'F', 'G'].forEach(col => {
                row.getCell(col).alignment = { horizontal: 'right', vertical: 'middle' };
            });

            if (data[i].istotal === 'Y') {
                // Apply the bold style to cells A, B, C, D, E, F, G
                for (let col of ['A', 'B', 'C', 'D', 'E', 'F', 'G']) {
                    row.getCell(col).style.font = { bold: true };
                }
            }
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'paydoc232.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);



    }

    const showModal = () => {
        if (!dataRow) {
            messageApi.open({
                type: 'warning',
                content: 'Каторни танланг',
            });

            return false;
        }
        setOpen(true);
    };
    const handleOk = () => {
        setOpen(false);
    };
    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            {contextHolder}
            <Button onClick={printTableExcelJs}>Print Smeta</Button>
        </>
    )
}
export default SmetaPrint;