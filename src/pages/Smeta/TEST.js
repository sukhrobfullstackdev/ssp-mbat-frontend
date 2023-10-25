import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const blocksData = [
    { items: ['Item 1', 'Item 2', 'Item 3'] },
    { items: ['Item 4', 'Item 5', 'Item 6'] },
    { items: ['Item 7', 'Item 8', 'Item 9'] },
    { items: ['Item 10', 'Item 11', 'Item 12'] },
    { items: ['Item 13', 'Item 14', 'Item 15'] },
    { items: ['Item 16', 'Item 17', 'Item 18'] },
];

const TEST = () => {
    const onFinish = (values) => {
        console.log('Form values:', values);
    };

    return (
        <div className="App">
            <Form
                name="example-form"
                onFinish={onFinish}
                // Add className for custom styling using Ant Design theme
                className="custom-form"
            >
                <Row gutter={16}>
                    {blocksData.map((block, index) => (
                        <Col key={index} xs={24} sm={12} md={8}>
                            <div className="form-block">
                                {block.items.map((item, itemIndex) => (
                                    <Form.Item key={itemIndex} label={`Item ${index * 3 + itemIndex + 1}`} {...formItemLayout}>
                                        <Input />
                                    </Form.Item>
                                ))}
                            </div>
                        </Col>
                    ))}
                </Row>

                <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default TEST;
