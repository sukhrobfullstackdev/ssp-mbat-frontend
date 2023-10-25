import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine
} from "recharts";
import {useSelector} from "react-redux";
import {Spin} from "antd";
import styled from "styled-components";
import {generateColor} from "../index";
const StyledSpinContainer = styled.div`
  margin: 20px 0;
  padding: 30px 50px;
  text-align: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
`;
const CustomBarChart = ({comparing_columns,comparing_by}) => {
    const chartData  = useSelector((state) => state.chart.data);
    const loading = useSelector((state) => state.chart.loading);
    const convertToNumber = (value) => {
        if (typeof value === 'string') {
            const numberValue = parseFloat(value.replace(/,/g, ''));
            return isNaN(numberValue) ? value : numberValue;
        }
        return value;
    };

    const convertedData = chartData.map((item) => {
        const convertedItem = { ...item };
        comparing_columns.forEach((column) => {
            if (convertedItem.hasOwnProperty(column)) {
                convertedItem[column] = convertToNumber(convertedItem[column]);
            }
        });
        return convertedItem;
    });
    if (loading) {
        return (
            <StyledSpinContainer><Spin /></StyledSpinContainer>
        )
    }
    return (
        <BarChart
            width={window.innerWidth / 100 * 85}
            height={window.innerHeight / 100 * 85}
            data={convertedData}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={comparing_by} />
            <YAxis />
            <Tooltip />
            <Legend />
            <ReferenceLine y={0} stroke="#000" />
            {comparing_columns.map((value) => (
                <Bar dataKey={`${value}`} key={value} fill={generateColor()} />
            ))}
        </BarChart>
    );
};

export default CustomBarChart;