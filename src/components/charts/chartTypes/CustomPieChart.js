import React, {useEffect, useState} from 'react';
import {PieChart, Pie, Tooltip, Bar} from "recharts";
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
const CustomPieChart = ({comparing_columns}) => {
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
    const [overAllData,setOverAllData] = useState([]);
    useEffect(()=>{
        const sa = comparing_columns.map((col) => {
            const value = chartData.reduce((acc, row) => acc + Number(row[col]), 0);
            return { name: col, value };
        });
        setOverAllData(sa);
    },[chartData]);
    if (loading) {
        return (
            <StyledSpinContainer><Spin /></StyledSpinContainer>
        )
    }
    return (
        <PieChart width={window.innerWidth / 100 * 85} height={window.innerHeight / 100 * 85}>
                <Pie
                    dataKey={"value"}
                    startAngle={0}
                    endAngle={360}
                    data={overAllData}
                    cx={650}
                    cy={250}
                    outerRadius={120}
                    fill={'#8884d8'}
                    label
                />
            <Tooltip/>
        </PieChart>
    );
};

export default CustomPieChart;