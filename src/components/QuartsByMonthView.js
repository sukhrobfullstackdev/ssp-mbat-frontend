import React, {useEffect, useState} from "react";
import {Card, Col, Form, Input, Row} from "antd";
import {forwardRef, useImperativeHandle} from "react";


let formSum = [];
let quartSum = {};

const QuartsByMonthView = forwardRef(({quartsData, expCode, handleChangeQuart, selectedRowKeys, expObj, setExpCode}, ref) => {
    const [form] = Form.useForm()
    const [sumExp, setSumExp] = useState();
    const [formDisabled, setFormDisabled] = useState(true);

    useEffect(() => {
        if (selectedRowKeys.length !== 0) {
            setFormDisabled(false)
        }
    }, [selectedRowKeys]);

    useEffect(() => {
        //console.log(expObj,'expobjnn')
        //console.log(quartsData,'quartsDatajasdnn')
        console.log(expObj,'asdasds')
        formSum = Object.keys(expObj).map(key => ({month: key, sumpay: expObj[key]}));
        quartSum = quartsData;
        return

    }, [expCode]);

    const quarters = [{'Q1':['jan','feb','mar']},
                      {'Q2':['apr','may','jun']},
                      {'Q3':['jul','aug','sep']},
                      {'Q4':['oct','nov','dec']}]

    const quartLabel = [{'jan':'Янв'},{'feb':'Фев'},{'mar':'Мар'},
                        {'apr':'Апр'},{'may':'Май'},{'jun':'Июн'},
                        {'jul':'Июл'},{'aug':'Авг'},{'sep':'Сен'},
                        {'oct':'Окт'},{'nov':'Ноя'},{'dec':'Дек'}];

    //form.setFieldValue('JAN',qdata.exp);
    //if (props.props[0].code !== undefined)  setSumExp(props.props[0].code)

    //console.log(quartsData,'quartsData');
    //console.log(expCode,'expCode');

    const handleSumView = (rec) => {
        //rec.forEach((elem) => {
            setExpCode(rec.expense)

            const getValueKey = (value) => {
                for (let i = 0; i < quarters.length; i++) {
                    const obj = quarters[i];
                    const keys = Object.keys(obj);
                    const values = obj[keys[0]];
                    if (values.indexOf(value) >= 0) {
                        return keys[0];
                    }
                }
            };

            let targetId = rec.month,
                targetSum = +rec.sumpay,
                targetQrt = getValueKey(rec.month),
                targetExp = rec.expense;
           // console.log(targetId)
           // console.log(targetSum)
           // console.log(targetQrt)
          //  console.log(targetExp)


            const monthInx = formSum.findIndex(item => item.month === targetId)
        //console.log(monthInx,'monthInx')

            if (monthInx === -1) {
                formSum.push({'month':targetId, 'sumpay': targetSum})
            } else {
                formSum[monthInx].sumpay = targetSum
            }

            let newObjMonth = {}
            for (let i = 0; i < formSum.length; i++) {
                const obj = formSum[i];
                newObjMonth[obj.month] = obj.sumpay;
            }

            sumTotalQuartView(targetQrt, targetSum, newObjMonth, targetExp);

        //})

        return false;

    }

    useImperativeHandle(ref, () => ({
        handleSumView
    }));

    const handleSum = (e) => {

        let qrt = ['Q1','Q2','Q3','Q4'].findIndex(item => item === e.target.id)
        if (qrt !== -1) return false;

        let targetId = e.target.id,
            targetSum = +e.target.value,
            targetQrt = e.target.dataset.quart;

        const monthInx = formSum.findIndex(item => item.month === targetId)
        if (monthInx === -1) {
            formSum.push({'month':targetId, 'sumpay': targetSum})
        } else {
            formSum[monthInx].sumpay = targetSum
        }

        let newObjMonth = {}
        for (let i = 0; i < formSum.length; i++) {
            const obj = formSum[i];
            newObjMonth[obj.month] = obj.sumpay;
        }

        sumTotalQuart(targetQrt, targetSum, newObjMonth);
        return false;

    }

    const sumTotalQuartView = ( quart, sumpay, newObjMonth, targetExp ) => {
        console.info(quarters,'quarters')
        console.info(quart,'quart')
        console.info(formSum,'formSum')

        let newArrM = quarters.find(item => item[quart]),
            newArr = formSum.map(item => {
                if (newArrM[quart].includes(item.month)) return item.sumpay;
                else return 0;
            });
        console.info(newArrM,'newArrM')
        return
        let totalPrice = newArr.reduce((total,sumpay) => total + +sumpay, 0 )
        form.setFieldValue(quart, totalPrice)


        formSum = Object.keys(expObj).map(key => ({month: key, sumpay: expObj[key]}));

        quartSum = quartsData;
        quartSum[quart] = totalPrice

        let arrQuart = formSum.map(item => item.sumpay)
        let allQuartSum = arrQuart.reduce((total,sumpay) => total + +sumpay, 0 )

        formSum = Object.keys(expObj).map(key => ({month: key, sumpay: expObj[key]}));
        quartSum = quartsData;
        let hh = {expCode: targetExp, allQuartSum, formSum, quartSum, newObjMonth}
            console.info(hh,'hhtt')
            return
        handleChangeQuart(hh)


    }


    const sumTotalQuart = ( quart, sumpay, newObjMonth ) => {
        let newArrM = quarters.find(item => item[quart]),
            newArr = formSum.map(item => {
            if (newArrM[quart].includes(item.month)) return item.sumpay;
            else return 0;
        });

        //console.log(newArr, 'newArr2222');
        let totalPrice = newArr.reduce((total,sumpay) => total + +sumpay, 0 )
        form.setFieldValue(quart, totalPrice)

        quartSum[quart] = totalPrice

        let arrQuart = formSum.map(item => item.sumpay)
        let allQuartSum = arrQuart.reduce((total,sumpay) => total + +sumpay, 0 )
        //console.log(allQuartSum, 'allQuartSum')
        //console.log(expCode,'expCode')
        let hh = {expCode, allQuartSum, formSum, quartSum, newObjMonth}

        //console.log(formSum,'formSum')
        //console.error(hh,'hhtt222')

        handleChangeQuart(hh)

    }

    useEffect(() => {
        //console.log(expObj,'expObj')
        //console.log(quartsData, 'quartsData')
        form.setFieldsValue(expObj)
        form.setFieldsValue(quartsData)
        //console.log(expObj,'aasdasdasd')
        //console.log(quartsData,'aasdasdasd')
    }, [expObj]);


    return (
        <>
            <Form form={form} initialValues={expObj} onBlur={handleSum} disabled={formDisabled}>

                <Row gutter={[10,10]}>

                    <Col span={6}>

                        <Card style={{
                                  width: 300,
                              }}
                        >
                            <Form.Item key='Q1' name='Q1' style={{marginBottom:'8px'}}>
                                <Input style={{textAlign:"right",}} readOnly={true} addonBefore="1 Кв." />
                            </Form.Item>

                            {quarters &&
                                quarters[0]['Q1'].map((field) => {
                                    let monthLabel = quartLabel.find(item => item[field]);
                                    monthLabel = monthLabel[field];

                                    return (

                                        <Form.Item key={field} fieldId={field} name={field} initialValue={sumExp} style={{marginBottom:'8px'}}>
                                            <Input style={{textAlign:"right"}} data-quart='Q1'
                                                   addonBefore={monthLabel} />
                                        </Form.Item>
                                    )
                                })
                            }

                        </Card>

                    </Col>

                    <Col span={6}>

                        <Card style={{
                            width: 300,
                        }}
                        >
                            <Form.Item key='Q2' name='Q2' style={{marginBottom:'8px'}}>
                                <Input style={{textAlign:"right"}} readOnly={true} addonBefore="2 Кв."/>
                            </Form.Item>

                            {quarters &&
                                quarters[1]['Q2'].map((field) => {
                                    let monthLabel = quartLabel.find(item => item[field]);
                                    monthLabel = monthLabel[field];

                                    return (

                                        <Form.Item key={field} fieldId={field} name={field} initialValue={sumExp} style={{marginBottom:'8px'}}>
                                            <Input style={{textAlign:"right"}} data-quart='Q2'
                                                   addonBefore={monthLabel} />
                                        </Form.Item>

                                    )
                                })
                            }

                        </Card>

                    </Col>

                    <Col span={6}>

                        <Card style={{
                            width: 300,
                        }}
                        >
                            <Form.Item key='Q3' name='Q3' style={{marginBottom:'8px'}}>
                                <Input style={{textAlign:"right"}} readOnly={true} addonBefore="3 Кв."/>
                            </Form.Item>

                            {quarters &&
                                quarters[2]['Q3'].map((field) => {
                                    let monthLabel = quartLabel.find(item => item[field]);
                                    monthLabel = monthLabel[field];

                                    return (

                                        <Form.Item key={field} fieldId={field} name={field} initialValue={sumExp} style={{marginBottom:'8px'}}>
                                            <Input style={{textAlign:"right"}} data-quart='Q3'
                                                   addonBefore={monthLabel} />
                                        </Form.Item>

                                    )
                                })
                            }

                        </Card>

                    </Col>

                    <Col span={6}>

                        <Card style={{
                            width: 300,
                        }}
                        >
                            <Form.Item key='Q4' name='Q4' style={{marginBottom:'8px'}}>
                                <Input style={{textAlign:"right"}} readOnly={true} addonBefore="4 Кв."/>
                            </Form.Item>

                            {quarters &&
                                quarters[3]['Q4'].map((field) => {
                                    let monthLabel = quartLabel.find(item => item[field]);
                                    monthLabel = monthLabel[field];

                                    return (

                                        <Form.Item key={field} fieldId={field} name={field} initialValue={sumExp} style={{marginBottom:'8px'}}>
                                            <Input style={{textAlign:"right"}} data-quart='Q4'
                                                   addonBefore={monthLabel} />
                                        </Form.Item>

                                    )
                                })
                            }

                        </Card>

                    </Col>

                </Row>

            </Form>
        </>
    )

})

export default QuartsByMonthView;