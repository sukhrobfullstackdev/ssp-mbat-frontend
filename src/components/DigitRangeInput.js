import React from 'react';
import {Input, InputNumber} from 'antd';

const DigitRangeInput = ({ label, value  = [0, 0], onChange }) => {
    /*console.log(value,'okokokoko')
    console.log(onChange,'onChange')*/
    return (
        <Input.Group compact>
            <InputNumber
                style={{ width: '50%' }}
                step={null}
                controls={false}
                placeholder="Мин"
                value={value[0]}
                onChange={(elValue) => onChange([elValue, value[1]])}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
            <InputNumber
                style={{ width: '50%' }}
                step={null}
                controls={false}
                placeholder="Макс"
                value={value[1]}
                onChange={(elValue) => onChange([value[0], elValue])}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
        </Input.Group>
    );
};

export default DigitRangeInput;