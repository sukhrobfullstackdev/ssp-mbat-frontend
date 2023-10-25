import React, {useEffect, useState} from "react";
import {Card, Col, Form, Input, Row, Space, Table, Tag } from "antd";
import QuartsByMonth from "../../components/QuartsByMonth";

const columns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text) => <a>{text}</a>
    },
    {
        title: "Age",
        dataIndex: "age",
        key: "age"
    },
    {
        title: "Address",
        dataIndex: "address",
        key: "address"
    },
    {
        title: "Tags",
        key: "tags",
        dataIndex: "tags",
        /*render: (_, { tags }) => (
            <>
                {tags.map((tag) => {
                    let color = tag.length > 5 ? "geekblue" : "green";
                    if (tag === "loser") {
                        color = "volcano";
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        )*/
    },
    {
        title: "Action",
        key: "action",
        /*render: (_, record) => (
            <Space size="middle">
                <a>Invite {record.name}</a>
                <a>Delete</a>
            </Space>
        )*/
    }
];
const data = [
    {
        key: "1",
        exp: "14111100",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
        tags: ["nice", "developer"]
    },
    {
        key: "2",
        exp: "14111210",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
        tags: ["loser"]
    },
    {
        key: "3",
        exp: "14111220",
        name: "Joe Black",
        age: 32,
        address: "Sydney No. 1 Lake Park",
        tags: ["cool", "teacher"]
    }
];

//const months = {'JAN':0,'FEB':0,'MAR':0,'APR':0,'MAY':0,'JUN':0,'JUL':0,'AUG':0,'SEP':0,'OCT':0,'NOV':0,'DEC':0};
const months = {month:"JAN",sumpay:0};
const TEST = () => {
    const [formExp] = Form.useForm()
    const [monthdata, setMonthData] = useState(months);
    const [expense, setExpense] = useState(months);

    useEffect(()=>{
        formExp.setFieldValue('expense',expense.code);
    },[expense])
    return (
        <Form name="addExp" form={formExp} initialValues={{}}>

            <Table
                columns={columns}
                dataSource={data}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            console.log(record);
                            setExpense({code: record.exp});
                        } // click row
                    };
                }}
                footer={(data) => {
                    console.log(data, 'data');
                    return <QuartsByMonth data={data} monthdata={monthdata} />
                    /*return <>
                        <Form name="addExp" form={formExp} initialValues={{qdata}}>
                            <Form.Item name="exp">
                                <Input />
                            </Form.Item>
                            <Form.Item name="sum">
                                <Input />
                            </Form.Item>
                        </Form>
                    </>;*/
                }}
            />

        </Form>
    );
};

export default TEST