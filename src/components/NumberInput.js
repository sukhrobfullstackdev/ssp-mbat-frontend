import React from 'react';
import { Input } from 'antd';

const NumberInputBM = ({ onChange, ...rest }) => {
    const handleChange = (e) => {
        let { value } = e.target;
        value = value.replace(/\D/g, ''); // Remove non-numeric characters
        onChange(value);
    };

    return <Input {...rest} onChange={handleChange} />;
};

export default NumberInputBM;