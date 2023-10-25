import React from 'react';
import {Form, Table} from "antd";

function PaydocPoints(props) {
    const dataForm = props.dataPoints?.value

    let dataArray = [];
    try {
        dataArray = JSON.parse(dataForm);
    } catch (error) {
        console.error("Error parsing dataForm:", error);
    }

    function formatExpense(number) {
        const numberString = String(number);
        return numberString.replace(/(\d)(?=(\d{2})+\d$)/g, '$1 ');
    }

    const columns = [
        {
            title: 'Модда',
            dataIndex: 'expense',
            key: 'expense',
            width: 120,
            render: (text) => formatExpense(text)
        },
        {
            title: 'Сумма',
            dataIndex: 'sumpay',
            key: 'sumpay',
            render: (text) => parseFloat(text).toLocaleString("en-EN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        },
    ];

    return (
        <Form>
            {Array.isArray(dataArray) ? (
                <div>
                    <Table dataSource={dataArray} columns={columns} />
                </div>
            ) : (
                <div>Data is not in a valid format.</div>
            )}
        </Form>
    );
}

export default PaydocPoints;