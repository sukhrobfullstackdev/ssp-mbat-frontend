import React, {useState} from 'react';
import { Form, InputNumber, Row, Col } from 'antd';

const PriceRangeInput = ({ label, name, onChange }) => {
    const [value, setValue] = useState([null, null]); // Initial value for the range

    // Handle changes in the input values
    const handleValueChange = (values) => {
        setValue(values);

        // Pass the selected values to the parent component
        if (onChange) {
            onChange(name, values);
        }
    };
    return (

            <Row gutter={16}>
                <Col span={12}>
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Min Price"
                        onChange={handleValueChange}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                </Col>
                <Col span={12}>
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Max Price"
                        onChange={handleValueChange}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                </Col>
            </Row>

    );
};

export default PriceRangeInput;