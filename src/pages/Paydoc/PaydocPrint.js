import React, { useState } from 'react';
import * as XLSX from "xlsx";
import {Button, message, Modal} from "antd";
import {PrinterOutlined} from "@ant-design/icons";
import * as ExcelJS from "exceljs";
import {CellRichTextValue, RowModel} from "exceljs";
import sumProp from "../../libs/sumProp";

function PaydocPrint({dataPaydoc}) {

    const [open, setOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    /*const exportToExcel = () => {
        //const wb = XLSX.utils.book_new();
        //const ws = XLSX.utils.json_to_sheet(data);

        //XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        //XLSX.writeFile(wb, 'table.xlsx');
    };*/


    const exportToExcel2 = () => {
        const table = document.getElementById('tbl_exporttable_to_xls');
        const workbook = XLSX.utils.table_to_book(table );
        //XLSX.utils.sheet_add_dom(ws, table, { sheet: 'table' });
        XLSX.writeFile(workbook, '12table.xls');
    };

    const printTable = async () => {

        if (!dataPaydoc) {
            messageApi.open({
                type: 'warning',
                content: 'Каторни танланг',
            });

            return false;
        }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Paydoc');

        // Define custom styles
        const titleStyle = {
            font: { bold: true, size: 10 },
            alignment: { horizontal: 'center', vertical: 'middle' },
            border: { bottom: { style: 'medium', color: { argb: '000000' } } },
        };

        const labelStyle = {
            ...titleStyle,
            alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
            border: {
                bottom: { style: 'medium', color: { argb: '000000' } },
                right: { style: 'medium', color: { argb: 'DBDBDB' } },
                left: { style: 'medium', color: { argb: 'DBDBDB' } }
            },
        }

        const amountlabelStyle = {
            font: { bold: true, size: 10 },
            alignment: { vertical: 'middle', horizontal: 'left' },
            border: {
                bottom: { style: 'medium', color: { argb: '000000' } },
                right: { style: 'medium', color: { argb: 'DBDBDB' } },
                left: { style: 'medium', color: { argb: 'DBDBDB' } }
            },
        }

        const dbllabelStyle = {
            font: { bold: true, size: 10 },
            alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
            border: {
                right: { style: 'medium', color: { argb: 'DBDBDB' } },
                left: { style: 'medium', color: { argb: 'DBDBDB' } }
            },
        }

        const cellStyle = {
            font: { size: 10 },
            alignment: { vertical: 'middle', wrapText: true  },
            border: {
                bottom: { style: 'medium', color: { argb: '000000' } },
                right: { style: 'medium', color: { argb: 'DBDBDB' } },
                left: { style: 'medium', color: { argb: 'DBDBDB' } }
            },
        };

        const emptyCellStyle = {
            font: { size: 10 },
            alignment: { vertical: 'middle', wrapText: true  },
            border: {
                top: { style: 'medium', color: { argb: 'AAAAAA' } },
                bottom: { style: 'medium', color: { argb: 'AAAAAA' } },
                right: { style: 'medium', color: { argb: 'AAAAAA' } },
                left: { style: 'medium', color: { argb: 'AAAAAA' } }
            },
        };

        const boldCellStyle = {
            font: { bold: true, size: 10 },
            alignment: { vertical: 'middle', wrapText: true  },
        };

        const signCellStyle = {
            font: { size: 8 },
            alignment: { vertical: 'middle' },
            border: {
                bottom: { style: 'medium', color: { argb: '000000' } },
                right: { style: 'medium', color: { argb: 'DBDBDB' } },
                left: { style: 'medium', color: { argb: 'DBDBDB' } }
            },
        };

        worksheet.columns = [
            { width: 18 }, // Column A
            { width: 32 }, // Column B
            { width: 18 }, // Column C
            { width: 11 }, // Column D

        ];

        worksheet.getRow(1).height = 40
        worksheet.getRow(21).height = 30
        worksheet.getRow(22).height = 30

        // Set cell values and apply the defined styles
        worksheet.getCell('A1').value = 'ОИ';
        worksheet.getCell('A1').style = titleStyle;
        worksheet.mergeCells('B1:D1');
        worksheet.getCell('B1').value = `Электронное Пл.поруч.через сист.дист.обсл. № ${dataPaydoc.doc_numb}`;
        worksheet.getCell('B1').style = titleStyle;
        worksheet.getCell('C1').style = titleStyle;
        worksheet.getCell('D1').style = titleStyle;

        worksheet.mergeCells('B2:D2');
        worksheet.getCell('A2').value = 'ДАТА';
        worksheet.getCell('A2').style = labelStyle;
        worksheet.getCell('B2').value = dataPaydoc.doc_date;
        worksheet.getCell('B2').style = cellStyle;
        worksheet.getCell('C2').style = cellStyle;
        worksheet.getCell('D2').style = cellStyle;

        // Add more data and styles here

        worksheet.mergeCells('B3:D4');

        worksheet.getCell('A3').value = 'Наименование';
        worksheet.getCell('A3').style = dbllabelStyle;
        worksheet.getCell('B3').value = dataPaydoc.cl_name;
        worksheet.getCell('B4').style = cellStyle;
        worksheet.getCell('D4').style = cellStyle;
        worksheet.getCell('C4').style = cellStyle;

        worksheet.getCell('A4').value = 'плательщика';
        worksheet.getCell('A4').style = labelStyle;

        worksheet.mergeCells('B5:B6');
        worksheet.getCell('A5').value = 'ДЕБЕТ';
        worksheet.getCell('A5').style = dbllabelStyle;
        worksheet.getCell('B5').value = dataPaydoc.cl_acc;
        worksheet.getCell('B5').style = cellStyle;
        worksheet.getCell('B6').style = cellStyle;

        worksheet.getCell('A6').value = 'Счет плательщика';
        worksheet.getCell('A6').style = labelStyle;

        worksheet.mergeCells('D5:D6');

        worksheet.getCell('C5').value = 'ИНН';
        worksheet.getCell('C5').style = dbllabelStyle;
        worksheet.getCell('D5').value = dataPaydoc.cl_inn;
        worksheet.getCell('D5').style = cellStyle;

        worksheet.getCell('C6').value = 'плательщика';
        worksheet.getCell('C6').style = labelStyle;

        worksheet.mergeCells('B7:B8');

        worksheet.getCell('A7').value = 'Наименование';
        worksheet.getCell('A7').style = dbllabelStyle;
        worksheet.getCell('B7').value = dataPaydoc.cl_mfo_name;
        worksheet.getCell('B7').style = cellStyle;
        worksheet.getCell('B8').style = cellStyle;

        worksheet.getCell('A8').value = 'банка плательщика';
        worksheet.getCell('A8').style = labelStyle;

        worksheet.mergeCells('D7:D8');

        worksheet.getCell('C7').value = 'Код банка';
        worksheet.getCell('C7').style = dbllabelStyle;
        worksheet.getCell('D7').value = dataPaydoc.cl_mfo;
        worksheet.getCell('D7').style = cellStyle;

        worksheet.getCell('C8').value = 'плательщика';
        worksheet.getCell('C8').style = labelStyle;

        const sumFormat = parseFloat(dataPaydoc.sumpay).toLocaleString("en-EN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })

        worksheet.mergeCells('B9:D9');
        worksheet.getCell('A9').value = 'CУММА';
        worksheet.getCell('A9').style = labelStyle;
        worksheet.getCell('B9').value = sumFormat;
        worksheet.getCell('B9').style = amountlabelStyle;
        worksheet.getCell('C9').style = cellStyle;
        worksheet.getCell('D9').style = cellStyle;

        worksheet.mergeCells('B10:D11');

        worksheet.getCell('A10').value = 'Наименование';
        worksheet.getCell('A10').style = dbllabelStyle;
        worksheet.getCell('B10').value = dataPaydoc.co_name;
        worksheet.getCell('B11').style = cellStyle;
        worksheet.getCell('C11').style = cellStyle;

        worksheet.getCell('A11').value = 'получателя';
        worksheet.getCell('A11').style = labelStyle;

        worksheet.mergeCells('B12:B13');
        worksheet.getCell('A12').value = 'КРЕДИТ';
        worksheet.getCell('A12').style = dbllabelStyle;
        worksheet.getCell('B12').value = dataPaydoc.co_acc;
        worksheet.getCell('B12').style = cellStyle;
        worksheet.getCell('B13').style = cellStyle;

        worksheet.getCell('A13').value = 'Счет получателя';
        worksheet.getCell('A13').style = labelStyle;

        worksheet.mergeCells('D12:D13');

        worksheet.getCell('C12').value = 'ИНН';
        worksheet.getCell('C12').style = dbllabelStyle;
        worksheet.getCell('D12').value = dataPaydoc.co_inn;
        worksheet.getCell('D12').style = cellStyle;

        worksheet.getCell('C13').value = 'получателя';
        worksheet.getCell('C13').style = labelStyle;

        worksheet.mergeCells('B14:B15');

        worksheet.getCell('A14').value = 'Наименование';
        worksheet.getCell('A14').style = dbllabelStyle;
        worksheet.getCell('B14').value = dataPaydoc.co_mfo_name;
        worksheet.getCell('B14').style = cellStyle;
        worksheet.getCell('B15').style = cellStyle;

        worksheet.getCell('A15').value = 'банка получателя';
        worksheet.getCell('A15').style = labelStyle;

        worksheet.mergeCells('D14:D15');

        worksheet.getCell('C14').value = 'Код банка';
        worksheet.getCell('C14').style = dbllabelStyle;
        worksheet.getCell('D14').value = dataPaydoc.co_mfo;
        worksheet.getCell('D14').style = cellStyle;

        worksheet.getCell('C15').value = 'получателя';
        worksheet.getCell('C15').style = labelStyle;


        const sumWord = sumProp(dataPaydoc.sumpay)
        worksheet.mergeCells('B16:D17');
        worksheet.getCell('A17').value = 'Cумма прописью';
        worksheet.getCell('A17').style = labelStyle;
        worksheet.getCell('B16').value = sumWord;
        worksheet.getCell('B16').style = cellStyle;
        worksheet.getCell('B17').style = cellStyle;
        worksheet.getCell('C17').style = cellStyle;
        worksheet.getCell('D17').style = cellStyle;

        worksheet.mergeCells('B18:D20');

        worksheet.getCell('A18').value = 'Детали';
        worksheet.getCell('A18').style = dbllabelStyle;
        worksheet.getCell('B18').value = dataPaydoc.purpose;
        worksheet.getCell('B18').style = cellStyle;

        worksheet.getCell('A19').value = 'платежа';
        worksheet.getCell('A19').style = dbllabelStyle;
        worksheet.getCell('A20').style = labelStyle;
        worksheet.getCell('B20').style = labelStyle;
        worksheet.getCell('C20').style = labelStyle;
        worksheet.getCell('D20').style = labelStyle;

        worksheet.getCell('A21').value = 'Руководитель';
        worksheet.getCell('A21').style = labelStyle;
        worksheet.getCell('B21').value = dataPaydoc.organ_chief;
        worksheet.getCell('B21').style = cellStyle;
        worksheet.getCell('C21').value = '';
        worksheet.getCell('C21').style = labelStyle;
        worksheet.getCell('D21').value = '(подпись)';


        worksheet.getCell('A22').value = 'Главный Бухгалтер';
        worksheet.getCell('A22').style = labelStyle;
        worksheet.getCell('B22').value = dataPaydoc.organ_bookkeeper;
        worksheet.getCell('B22').style = cellStyle;
        worksheet.getCell('C22').value = '';
        worksheet.getCell('C22').style = labelStyle;
        worksheet.getCell('D22').value = '(подпись)';

        worksheet.getCell('A24').value = 'БАНК';
        worksheet.getCell('A24').style = boldCellStyle;
        worksheet.getCell('B24').value = 'Проверен';
        worksheet.getCell('B24').style = boldCellStyle;
        worksheet.getCell('C24').value = 'Одобрен';
        worksheet.getCell('C24').style = boldCellStyle;
        worksheet.getCell('D24').value = 'Проведено банком';


        worksheet.getCell('A25').value = 'M.П.';
        worksheet.getCell('B25').value = '';
        worksheet.getCell('B25').style = emptyCellStyle;
        worksheet.getCell('C25').value = '';
        worksheet.getCell('C25').style = emptyCellStyle;
        worksheet.getCell('D25').value = '';



        worksheet.getColumn('D').eachCell((cell, rowNumber) => {
            if (rowNumber === 1) {
                // Skip the header row if you don't want to apply the style to it
                return;
            }
            cell.style = cellStyle;
        });

        worksheet.getCell('D21').style = signCellStyle;
        worksheet.getCell('D22').style = signCellStyle;
        worksheet.getCell('D24').style = boldCellStyle;
        worksheet.getCell('D25').style = emptyCellStyle;
        // Add more data and styles as needed

        // Save the workbook to a file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'paydoc232.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
    };


    const renderTable = () => {
        return (
            <>
                <Button onClick={printTable}>Print</Button>
                <Button onClick={exportToExcel2}>Print2</Button>

                <table id="tbl_exporttable_to_xls" border='1' style={{padding:10}}>
                    <tbody>
                        <tr>
                            <th width={200}>ОИ</th>
                            <th colSpan='3'>Электронное Пл.поруч.через сист.дист.обсл. № {dataPaydoc.id}</th>
                        </tr>
                        <tr>
                            <th>ДАТА</th>
                            <td colSpan='3'>{dataPaydoc.doc_date}</td>
                        </tr>
                        <tr>
                            <th>Наименование <br/> плательщика</th>
                            <td colSpan='3'>{dataPaydoc.cl_name}</td>
                        </tr>
                        <tr>
                            <th>ДЕБЕТ <br/> Счет плательщика</th>
                            <td>{dataPaydoc.cl_acc}</td>
                            <th>ИНН плательщика</th>
                            <td>{dataPaydoc.cl_inn}</td>
                        </tr>
                        <tr>
                            <th>Наименование <br/> банка плательщика</th>
                            <td>{dataPaydoc.cl_name}</td>
                            <th>Код банка <br/> плательщика</th>
                            <td>{dataPaydoc.cl_mfo}</td>
                        </tr>
                        <tr>
                            <th>CУММА</th>
                            <th colSpan='3' style={{textAlign: 'left'}}>{dataPaydoc.sumpay}</th>
                        </tr>
                        <tr>
                            <th>Наименование <br/> получателя</th>
                            <td colSpan='3'>{dataPaydoc.co_name}</td>
                        </tr>
                        <tr>
                            <th>КРЕДИТ <br/> Счет получателя</th>
                            <td>{dataPaydoc.co_acc}</td>
                            <th>ИНН <br/> получателя</th>
                            <td>{dataPaydoc.co_inn}</td>
                        </tr>
                        <tr>
                            <th>Наименование <br/> банка получателя</th>
                            <td>{dataPaydoc.co_name}</td>
                            <th>Код банка <br/> получателя</th>
                            <td>{dataPaydoc.co_mfo}</td>
                        </tr>
                        <tr>
                            <th>Cумма прописью</th>
                            <td colSpan='3'>{dataPaydoc.sumpay}</td>
                        </tr>
                        <tr>
                            <th>Детали платежа</th>
                            <td colSpan='3'>{dataPaydoc.purpose}</td>
                        </tr>
                        {/*<tr>
                            <th>Руководитель</th>
                            <td></td>
                            <th>Главный Бухгалтер</th>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                {dataPaydoc.id}
                            </td>
                            <td>
                                {dataPaydoc.id}
                            </td>
                        </tr>*/}
                    </tbody>
                </table>
            </>
        );
    };

    const printTable1 = () => {
        // Create a new worksheet
        const ws = XLSX.utils.aoa_to_sheet([
            /*[
                'ОИ',
                `Электронное Пл.поруч.через сист.дист.обсл. № ${dataPaydoc.id}`,
                '',
                '',
            ],*/
            [
                { v: 'ОИ', s: { bold: true, alignment: { horizontal: 'center' } } },
                {
                    v: `Электронное Пл.поруч.через сист.дист.обсл. № ${dataPaydoc.id}`,
                    s: { bold: true, alignment: { horizontal: 'center' } },
                },
                { v: '', s: {} },
                { v: '', s: {} },
            ],
            ['ДАТА', dataPaydoc.doc_date, '', ''],
            ['Наименование плательщика', dataPaydoc.cl_name, '', ''],
            ['ДЕБЕТ Счет плательщика', '', 'ИНН плательщика', dataPaydoc.cl_inn],
            ['Наименование банка плательщика', dataPaydoc.cl_name, 'Код банка плательщика', dataPaydoc.cl_mfo],
            ['CУММА', '', '', dataPaydoc.sumpay],
            ['Наименование получателя', dataPaydoc.co_name, '', ''],
            ['КРЕДИТ Счет получателя', '', 'ИНН получателя', dataPaydoc.co_inn],
            ['Наименование банка получателя', dataPaydoc.co_name, 'Код банка получателя', dataPaydoc.co_mfo],
            ['Cумма прописью', '', '', dataPaydoc.sumpay],
            ['Детали платежа', dataPaydoc.purpose, '', ''],
        ]);

        // Create a new workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Export the workbook to Excel
        XLSX.writeFile(wb, 'paydoc.xlsx');
    };

    const showModal = () => {
        if (!dataPaydoc) {
            alert('Каторни танланг')
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
        <div>
            {contextHolder}
            {/*<button onClick={exportToExcel}>Export to Excel</button>*/}
            <Button type="primary" shape="circle" onClick={() => printTable()}>
                <PrinterOutlined />
            </Button>
            {dataPaydoc &&
                <Modal
                    open={open}
                    title="Печатная форма"
                    width={1000}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={(_, { OkBtn, CancelBtn }) => (
                        <>
                            {/*<Button onClick={printTable1}>Print</Button>
                            <Button>Custom Button</Button>*/}
                            <CancelBtn />
                            <OkBtn />
                        </>
                    )}
                >
                    {renderTable()}
                </Modal>
            }

        </div>
    );
}

export default PaydocPrint;