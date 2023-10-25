import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';

const exportToExcel = (dataTable) => {

    //format sum
    const dataClone = [...dataTable];

    /* Convert numeric "amount" values to the desired format and alignment */
    dataClone.forEach((item) => {

        if (item.saldo !== undefined) {
            const numericValue = parseFloat(item.saldo.toString().replace(/,/g, '')); // Convert to number
            if (!isNaN(numericValue)) {
                item.saldo = {
                    t: 'n', // 'n' for numeric data type
                    v: numericValue, // Numeric value
                    z: '#,##0.00', // Number format with two decimal places and thousands separator
                    s: { alignment: { horizontal: 'right' } }, // Set alignment to right
                };
            }
        }
    });

    /* Convert tableData to worksheet */
    const worksheet = XLSX.utils.json_to_sheet(dataClone);

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

export default exportToExcel;