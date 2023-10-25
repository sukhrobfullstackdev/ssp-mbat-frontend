import React from 'react';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
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
const CustomAreaChart = ({comparing_by,comparing_columns}) => {
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
            <AreaChart
                width={window.innerWidth / 100 * 85}
                height={window.innerHeight / 100 * 85}
                data={convertedData}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={comparing_by} />
                <YAxis />
                <Tooltip />
                {comparing_columns.map((value) => (
                    <Area type="monotone" key={value} dataKey={`${value}`} stackId="1" stroke={generateColor()} fill={generateColor()} />
                ))}
            </AreaChart>
    );
};

export default CustomAreaChart;