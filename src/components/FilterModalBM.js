import {Badge, Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space} from "antd";
import {SearchOutlined} from '@ant-design/icons';
import React, {useEffect, useRef, useState} from "react";
import { useFilter } from '../context/FilterContext';
import getFilials from "../api/refs/filials";
import getDocState from "../api/refs/states";
import dayjs from "dayjs";
import PriceRangeInput from "./PriceRangeInput";
import DigitRangeInput from "./DigitRangeInput";
import getDirection from "../api/refs/direction";
const {Option} = Select
const { RangePicker } = DatePicker;

const FilterModal = (props) => {


    let filterData = isEmpty(props.filterTab)?[]:props.filterTab;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [showDot, setShowDot] = useState(false);
    const [refFilial, setRefFilial] = useState([]);
    const [refDirection, setRefDirection] = useState([]);
    const [refDocState, setRefDocState] = useState([]);
    const [selectedValues, setSelectedValues] = useState({});
    const [modalForm] = Form.useForm()
    const { filterValues, setFilterValues } = useFilter();

    const hasSMTypes = filterData.some((e) => e.type === "S" || e.type === "M");

    const fetchDataIfNeeded = () => {
        if (hasSMTypes) {
            async function fetchData() {
                try {
                    const filteredArray = filterData.filter(function(item) {
                        // Check if the prop type is S or M
                        if (item.type === "S" || item.type === "M") {
                            return item;
                        }
                    });

                    for (const item of filteredArray) {
                        if ( item.typeRef === "FILIAL" ) {
                            const dataFilial = await getFilials();
                            setRefFilial(dataFilial)
                        }
                        if ( item.typeRef === "FILIAL" ) {
                            const dataDirection = await getDirection();
                            setRefDirection(dataDirection)
                        }
                        if ( item.typeRef === "DOCSTATE" ) {
                            const doctype = item.paramRef
                            const dataDocState = await getDocState(doctype);
                            setRefDocState(dataDocState)
                        }

                    }
                    /*const dataFilial = await getFilials();
                    const dataDocState = await getDocState('PAYDOC');
                    console.log(dataFilial,'dataFilial')
                    console.log(dataDocState,'dataDocState')

                    setRefDocState(dataDocState)*/
                } catch (error) {

                }
            }

            fetchData()
        }
    };


    // Function to initialize form values with context values
    const initializeFormValues = () => {
        const initialValues = filterValues[props.filterKey];
        console.log(initialValues, 'initialValues');
        if (initialValues) {
            const formValues = {};

            initialValues.forEach((filter) => {
                const { column, dataType, value, value2, operator } = filter;

                // Convert the value based on the data type
                let convertedValue = value;
                if (dataType === 'number' && operator !== "in") {
                    convertedValue = parseFloat(value); // or use parseInt if it's an integer
                }

                if (dataType === 'date' && ['range', 'range_new'].includes(operator)) {

                    convertedValue = [
                        dayjs(value  , 'DD.MM.YYYY'),
                        dayjs(value2 , 'DD.MM.YYYY')
                    ]
                }

                if (dataType === 'number' && ['range'].includes(operator)) {

                    convertedValue = [
                        value,
                        value2
                    ]
                }

                // Set the field value in the form
                formValues[column] = convertedValue;
            });
            console.log(formValues,'formValues')
            modalForm.setFieldsValue(formValues);
            setShowDot(true)
        }
    };

    useEffect(() => {
        if (props.filterKey) {
            const initialValues = filterValues[props.filterKey];
            if (initialValues) {
                setShowDot(true)
            }
            if (isModalOpen) {
                initializeFormValues();
            }
        }

        fetchDataIfNeeded()


    }, [isModalOpen]);


    const handleInputNumberChange = (name, value) => {
        modalForm.setFieldsValue({
            [name]: value || [ 0, 0],
        });
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    const onReset = () => {
        modalForm.resetFields();

        // Remove the filter values from the context for the specific filterKey
        const newFilterValues = { ...filterValues };
        delete newFilterValues[props.filterKey];
        setFilterValues(newFilterValues);
    };

    const handleOk = () => {

        let mfilter = []

        setConfirmLoading(true);

        /*Object.keys(modalForm.getFieldsValue()).map((item, i) => {
            if (modalForm.getFieldValue(item) !== undefined && modalForm.getFieldValue(item) !== "") {
                console.log(item)
                console.log(modalForm.getFieldValue(item),'modalForm.getFieldValue(item)')
                console.log(modalForm)
                console.log(modalForm.getFieldInstance(item))
                let itemAttr = modalForm.getFieldInstance(item).input.dataset;
                //let inpValue = itemAttr.type==='text'?modalForm.getFieldValue(item):Number(modalForm.getFieldValue(item))
                let inpValue = '';
                    if (itemAttr.type === 'text' || itemAttr.type === 'date') inpValue = modalForm.getFieldValue(item)
                else inpValue = Number(modalForm.getFieldValue(item))

                mfilter.push({
                    column: item,
                    operator: itemAttr.operator,
                    value: inpValue,
                    dataType: itemAttr.type
                });
            }

        })*/

        let filteredFilter = []
        const existColumn = []
        let existOne = false
        filterData.forEach((e) => {
            const { column, datatype, operator, type } = e;
            const inputValue = modalForm.getFieldValue(column);

            if (inputValue) {
                existOne = true
                existColumn.push(column)
                console.log(inputValue,'aidjioasjdioajsd')
                //console.log(filterValues,'filterValues')
                console.log(existColumn,'existColumn.push(column)')
                console.log(filterValues[props.filterKey],'filterValues[props.filterKey]')
            }

            if (inputValue !== undefined && inputValue !== "" && type === undefined ) {
/*                console.log(column, type ,'sadas')
                console.log(inputValue, 'inputValue')*/
                const itemAttr = modalForm.getFieldInstance(column).input.dataset;

                let inpValue = "";

                if (itemAttr.type === "text" || itemAttr.type === "date") {
                    inpValue = inputValue;
                } else {
                    inpValue = Number(inputValue);
                }

                mfilter.push({
                    column,
                    operator: itemAttr.operator || operator,
                    value: inpValue,
                    dataType: itemAttr.type || datatype,
                });
            }

            if (inputValue !== undefined && inputValue !== "" && ( type === "S" || type === "M" || type === "R") ) {
                let formatValue = inputValue
                if (type === "R" && datatype === "date") {
                    mfilter.push({
                        column,
                        operator: operator,
                        value: dayjs(inputValue[0]).format('DD.MM.YYYY'),
                        value2: dayjs(inputValue[1]).format('DD.MM.YYYY'),
                        dataType: datatype,
                    });
                } else if (type === "R" && datatype === "number") {
                    //formatValue = inputValue.map(elem => dayjs(elem).format('DD.MM.YYYY') )
                    if (inputValue[0] !== null || inputValue[1] !== null)
                    mfilter.push({
                        column,
                        operator: operator,
                        value: inputValue[0],
                        value2: inputValue[1],
                        dataType: datatype,
                    });
                } else {
                    if (formatValue.length !== 0)
                    mfilter.push({
                        column,
                        operator: operator,
                        value: formatValue,
                        dataType: datatype,
                    });
                }
            }
        });

        if (!existOne) {

            clearFilters()
        } else {

            if (filterValues[props.filterKey]){
                filteredFilter = filterValues[props.filterKey].filter(item => existColumn.includes(item.column));
            }

            if ( mfilter.length !== 0 ){
                props.onSubmit(mfilter).then(r => {
                    setIsModalOpen(false);
                    setConfirmLoading(false);
                    //console.log(mfilter, 'mfilter')
                    // Update filter values in the context
                    //console.log(filterValues,'filterValues')
                    //console.log([props.filterKey],'[props.filterKey]')
                    //if (props.filterKey) setFilterValues({ ...filterValues, [props.filterKey]: mfilter });
                    if (props.filterKey) setFilterValues({ ...filteredFilter, [props.filterKey]: mfilter });
                });
                setShowDot(true)
            } else {
                props.onSubmit(mfilter).then(r => {

                    setIsModalOpen(false);
                    setConfirmLoading(false);
                });
                setShowDot(false)
            }

        }

        // setTimeout(() => {
        //
        // }, 2000);

    };

    const clearFilters = () => {
        modalForm.resetFields();

        // Remove the filter values from the context for the specific filterKey
        const newFilterValues = { ...filterValues };
        delete newFilterValues[props.filterKey];
        setFilterValues(newFilterValues);
    }

    useEffect(() => {
        refreshTabData();
    }, [filterValues]);


    const refreshTabData = () => {
        props.onSubmit([]).then(r => {

            setIsModalOpen(false);
            setConfirmLoading(false);
        });
        setShowDot(false)
    }

    const selectChangeHandler = (value, columnName) => {
        setSelectedValues({
            ...selectedValues,
            [columnName]: value,
        });

        // Update the hidden Input value
        modalForm.setFieldsValue({
            [columnName]: value,
        });
    };

    return (
        <>
            <Badge dot={showDot}>
                <Button type="primary" onClick={showModal} shape="circle">
                    <SearchOutlined />
                </Button>
            </Badge>

            <Modal
                title="Фильтр"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
                footer={[
                    <Button key="1" danger onClick={onReset}>Тозалаш</Button>,
                    <Button key="2" onClick={handleCancel}>Бекор қилиш</Button>,
                    <Button key="3" type="primary"
                            loading={confirmLoading} onClick={() => handleOk()}>
                        Қўллаш
                    </Button>
                ]}
            >

                <Form name="filterForm" form={modalForm} scrollToFirstError
                      labelCol={{
                          span: 6,
                      }}
                      wrapperCol={{
                          span: 18,
                      }}
                      style={{
                          maxWidth: 450,
                      }}
                >

                    {
                        filterData && filterData.map((e)=> {
                            if (e.type === "S" || e.type === "M")
                                return (

                                    <Form.Item key={e.column}
                                               name={e.column}
                                               label={e.label}
                                               initialValue={selectedValues[e.column]}
                                               onChange={(value) => selectChangeHandler(value, e.column)}
                                    >
                                        <Select data-operator={e.operator}
                                                data-type={e.datatype}
                                                mode={e.type === "M" ? 'multiple' : 'default'}
                                                value={selectedValues[e.column] || ""}
                                                placeholder={'Каторни танланг'}
                                        >
                                            {e.typeRef === "FILIAL" &&
                                                refFilial &&
                                                refFilial.map((option) => (
                                                    <Option key={option.code} value={option.code}>
                                                        {option.code + ' - ' + option.name}
                                                    </Option>
                                                ))}
                                            {e.typeRef === "DIRECTION" &&
                                                refDirection &&
                                                refDirection.map((option) => (
                                                    <Option key={option.code} value={option.code}>
                                                        {option.name}
                                                    </Option>
                                                ))}
                                            {e.typeRef === "DOCSTATE" &&
                                                refDocState &&
                                                refDocState.map((option) => (
                                                    <Option key={option.state} value={option.state}>
                                                        {option.state + ' - ' + option.name}
                                                    </Option>
                                                ))}
                                        </Select>
                                    </Form.Item>
                                )
                            else if (e.type === "R" && e.datatype === "date") {
                                return (
                                    <Form.Item key={e.column}
                                               name={e.column}
                                               label={e.label}
                                               width={100}
                                    >
                                        <RangePicker size="medium" data-operator={e.operator} data-type={e.datatype}
                                                     format="DD.MM.YYYY"
                                        />
                                    </Form.Item>
                                )
                            }
                            else if (e.type === "R" && e.datatype === "number") {
                                return (
                                    <Form.Item key={e.column}
                                               name={e.column}
                                               label={e.label}
                                               width={100}
                                    >
                                        <DigitRangeInput
                                            value={[0, 0]}
                                            onChange={(value) => handleInputNumberChange(e.column, value)}
                                        />
                                    </Form.Item>
                                )
                            }
                            else
                                return (
                                    <Form.Item key={e.column}
                                               name={e.column}
                                               label={e.label}
                                               width={100}
                                               onChange={(event) => {
                                                   modalForm.setFieldsValue({
                                                       [e.column]: event.target.value,
                                                   });
                                               }}
                                    >

                                        <Input data-operator={e.operator} data-type={e.datatype}/>
                                    </Form.Item>
                                )
                        })
                    }

                </Form>
                {/*<Button htmlType="button" onClick={onReset}>
                    Reset
                </Button>*/}
            </Modal>
        </>
    )

}

export default FilterModal