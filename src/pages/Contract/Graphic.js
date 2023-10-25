import {Button, Input, InputNumber, Select, Table, Typography} from "antd";
import React, {useCallback, useContext, useEffect, useState} from "react";
import "../../custombm.css";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import {dataSmetaUsedSumExp} from "./ContractData";
import NumberInputBM from "../../components/NumberInput";

const QUERY_URL = '/api/public/query';

const {Column, ColumnGroup} = Table;
const { Text } = Typography;

const dataMonth = [
    {'jan':'Янв'},{'feb':'Фев'},{'mar':'Мар'},
    {'apr':'Апр'},{'may':'Май'},{'jun':'Июн'},
    {'jul':'Июл'},{'aug':'Авг'},{'sep':'Сен'},
    {'oct':'Окт'},{'nov':'Ноя'},{'dec':'Дек'}
];

const CNGraphic = ({graphics, setGraphData, expense, expArr, expGrpSum, setGenSumPay, accCode}) => {

    const auth = useContext(AuthContext);

    const stateTab = [
        {id: 1,  month:'jan',  smetaSum: 0, notUseSmetaSum: 0, sumPay: 0, expTotal: 0 },
        {id: 2,  month:'feb',  smetaSum: 0, notUseSmetaSum: 0, sumPay: 0, expTotal: 0 },
        {id: 3,  month:'mar',  smetaSum: 0, notUseSmetaSum: 0, sumPay: 0, expTotal: 0 },
        {id: 4,  month:'apr',  smetaSum: 0, notUseSmetaSum: 0, sumPay: 0, expTotal: 0 },
        {id: 5,  month:'may',  smetaSum: 0, notUseSmetaSum: 0, sumPay: 0, expTotal: 0 },
        {id: 6,  month:'jun',  smetaSum: 0, notUseSmetaSum: 0, sumPay: 0, expTotal: 0 },
        {id: 7,  month:'jul',  smetaSum: 0, notUseSmetaSum: 0, sumPay: 0, expTotal: 0 },
        {id: 8,  month:'aug',  smetaSum: 0, notUseSmetaSum: 0, sumPay: 0, expTotal: 0 },
        {id: 9,  month:'sep',  smetaSum: 0, notUseSmetaSum: 0, sumPay: 0, expTotal: 0 },
        {id: 10, month:'oct',  smetaSum: 0, notUseSmetaSum: 0, sumPay: 0, expTotal: 0 },
        {id: 11, month:'nov',  smetaSum: 0, notUseSmetaSum: 0, sumPay: 0, expTotal: 0 },
        {id: 12, month:'dec',  smetaSum: 0, notUseSmetaSum: 0, sumPay: 0, expTotal: 0 }
    ]

    const [dataTab, setDataTab] = useState([])
    const [mainDataTab, setMainDataTab] = useState([])
    const [key, setKey] = useState(0)
    const uniqExpArr = [...new Set(expArr)]
    const [selectedExp, setSelectedExp] = useState(uniqExpArr[0])
    const [selExpGrpSum, setSelExpGrpSum] = useState(0)

    const handleSumPayChange = (event, index, key) => {

        const updData = [...dataTab];
        updData[index][key] = event;
        updData[index]['expTotal'] = dataTab[index][key];
        setDataTab(updData)

        let updMainData = !mainDataTab?[]:mainDataTab;
        if (!mainDataTab || mainDataTab.find(item => item.expense === selectedExp)) {
            updMainData = [...mainDataTab];
            let expInd = updMainData.findIndex(item => item.expense === selectedExp)
            updMainData[expInd]['dataGraph'] = updData.filter(item => item.sumPay !== 0 && item.sumPay != null )
        }
        else updMainData.push({ expense: selectedExp, dataGraph: updData.filter(item => item.sumPay !==0 && item.sumPay != null  )})
        setMainDataTab(updMainData)
        setGraphData(updMainData)
        console.log(mainDataTab,'mainDataTab')
        console.log(updMainData,'updMainData')

        const sum = updMainData.reduce((acc, curr) => {
            return acc + curr.dataGraph.reduce((innerAcc, innerItem) => {
                return innerAcc + innerItem.sumPay;
            }, 0);
        }, 0);

        setGenSumPay(sum)
        formRaspSum(sum)
    };

    const setGraphicData = async () => {

        console.log(mainDataTab,'mainDataTabusefe');
        console.log(uniqExpArr,'uniqueabusefe');

        if (graphics?.length > 0) {
            graphics.forEach(graphic => {
                if (graphic.expense === selectedExp) {
                    stateTab[graphic.month - 1].sumPay = graphic.sumPay
                    stateTab[graphic.month - 1].expTotal = graphic.sumPay
                }
            })
        }

        //Ishlatilmagan summalani chiqarish

        const tt = await querySmetaSum()
        console.log(tt,'ttttt')
        console.log(mainDataTab,'mainDataTab')

        const currDataTab = [...stateTab];

        currDataTab.forEach(item => {
            item.smetaSum = 0
            item.notUseSmetaSum = 0
            const match = tt.find(updItem => updItem.month === item.id);
            if (match) {
                const s_sum = parseInt(match.smeta, 10)
                const calc_sum = parseInt(match.smeta || 0) + parseInt(match.paysum || 0)
                currDataTab[match.month - 1]["smetaSum"] = s_sum
                currDataTab[match.month - 1]["notUseSmetaSum"] = calc_sum
            }
        })

        let expInd = mainDataTab.findIndex(item => item.expense === selectedExp)
        if (expInd === -1) {

            setDataTab(currDataTab);
            setKey(key + 1);
        }
        else {
            let onLoadData = [...currDataTab]
            let updLoadData = onLoadData.map((item,index) => {
                return mainDataTab[expInd].dataGraph.find(elem => elem.id === item.id) || item
            })
            setDataTab(updLoadData)
            setKey(key + 1);
        }

        const dd = expGrpSum.find(elem => elem.expense === selectedExp)
        console.log(dd.allSum,'tt.allSum')
        setSelExpGrpSum(
            parseFloat(dd.allSum).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        )

    }

    const formRaspSum = (sum) => {
        console.log(selExpGrpSum)
        console.log(sum)

    }

    useEffect(() => {

        setGraphicData()
        //formRaspSum()

    }, [selectedExp, graphics]);

    //Ishlatilmagan summalar
    const querySmetaSum = async () => {

        dataSmetaUsedSumExp.query['filters'] = [
            {"column":"acc", "value": accCode, "operator":"=", "dataType":"text"},
            {"column":"expense", "value": selectedExp, "operator":"=", "dataType":"text"}
        ];

        try {
            const { data } = await axios.post(QUERY_URL,
                ( dataSmetaUsedSumExp ),
                {
                    headers: headers,
                    withCredentials: false
                });

            /*const currDataTab = [...dataTab];

            currDataTab.forEach(item => {
                item.smetaSum = 0
                item.notUseSmetaSum = 0
                const match = data.find(updItem => updItem.month === item.id);
                if (match) {
                    const s_sum = parseInt(match.smeta, 10)
                    const calc_sum = parseInt(match.smeta || 0) + parseInt(match.paysum || 0)
                    currDataTab[match.month - 1]["smetaSum"] = s_sum
                    currDataTab[match.month - 1]["notUseSmetaSum"] = calc_sum
                }
            })*/

            //console.log(currDataTab)
            //console.log(updatedData,'rrr')
            return data
            //setDataTab(currDataTab)

        } catch (e) {
            alert('Oshibka: '+e)
            return false;
        }

    }

    const tableHeader = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>
                <Input.Group compact>
                    <Input style={{ width: '30%', backgroundColor:'#fafafa' }} readOnly='readOnly' value="Харажат моддаси" />
                    <Select
                        defaultValue={selectedExp}
                        style={{
                            width: 120,
                        }}
                        onChange={handleChangeExpense}
                        options={ uniqExpArr.map(value => ({ value, label: value })) }

                    />
                </Input.Group>

                <NumberInputBM style={{ width: '50%', textAlign: 'end' }}
                               readOnly='readOnly'
                               value={selExpGrpSum}
                               addonBefore='Таксимланган пул'
                />

            </div>
        );
    }

    const headers = {
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const handleChangeExpense = (value) => {
        console.log(value,'expvalue')
        setSelectedExp(value)
        const tt = expGrpSum.find(elem => elem.expense === value)
        console.log(tt.allSum,'tt.allSum')
        setSelExpGrpSum(tt.allSum)
    }


    return (
        <>
            <Table dataSource={dataTab}
                   className='table-striped-rows'
                   rowKey="month"
                   key={key}
                   title={tableHeader}
                   scroll={{x: 300, }}
                   tableLayout="auto"
                   bordered={true}
                   size='small'
                   pagination={false}
                   summary={(pageData) => {
                       let  totalSmetaSum = 0,
                            totalNotUseSmetaSum = 0,
                            totalSumPay = 0,
                            totalExpTotal = 0;
                       pageData.forEach(({ smetaSum, notUseSmetaSum, sumPay, expTotal }) => {
                           totalSmetaSum += smetaSum;
                           totalNotUseSmetaSum += notUseSmetaSum;
                           totalSumPay += sumPay;
                           totalExpTotal += expTotal;
                       });
                       return (
                           <>
                               <Table.Summary.Row>
                                   <Table.Summary.Cell colSpan={2} index={0}>
                                       <Text style={{fontWeight:'bold'}}>Жами</Text>
                                   </Table.Summary.Cell>
                                   <Table.Summary.Cell index={1}>
                                       <Text style={{fontWeight:'bold', textAlign:'right', display:"block", paddingRight:'11px'}}>{
                                           parseFloat(totalSmetaSum).toLocaleString(undefined, {
                                               minimumFractionDigits: 2,
                                               maximumFractionDigits: 2,
                                           })
                                       }
                                       </Text>
                                   </Table.Summary.Cell>
                                   <Table.Summary.Cell index={2}>
                                       <Text style={{fontWeight:'bold', textAlign:'right', display:"block", paddingRight:'11px'}}>{
                                           parseFloat(totalNotUseSmetaSum).toLocaleString(undefined, {
                                               minimumFractionDigits: 2,
                                               maximumFractionDigits: 2,
                                           })
                                       }
                                       </Text>
                                   </Table.Summary.Cell>
                                   <Table.Summary.Cell index={3} >
                                       <Text style={{fontWeight:'bold', textAlign:'right', display:"block", paddingRight:'11px'}}>{
                                           parseFloat(totalSumPay).toLocaleString(undefined, {
                                               minimumFractionDigits: 2,
                                               maximumFractionDigits: 2,
                                           })
                                       }
                                       </Text>
                                   </Table.Summary.Cell>
                                   <Table.Summary.Cell index={4}>
                                       <Text style={{fontWeight:'bold', textAlign:'right', display:"block", paddingRight:'11px'}}>{
                                           parseFloat(totalExpTotal).toLocaleString(undefined, {
                                               minimumFractionDigits: 2,
                                               maximumFractionDigits: 2,
                                           })
                                       }
                                       </Text>
                                   </Table.Summary.Cell>
                               </Table.Summary.Row>
                               {/*<Table.Summary.Row>
                                   <Table.Summary.Cell index={0} colSpan={2}>Баланс</Table.Summary.Cell>
                                   <Table.Summary.Cell index={1} colSpan={4}>
                                       <Text type="danger">{totalNotUseSmetaSum - totalSumPay}</Text>
                                   </Table.Summary.Cell>
                               </Table.Summary.Row>*/}
                           </>
                       );
                   }}
            >
                <Column title="№" dataIndex="id" key="id"></Column>
                {/*<Column title="Ой" dataIndex="month" key="month" render={(value, record) => dataMonth.find(item => item[record.month])}></Column>*/}
                <Column title="Ой" dataIndex="month" key="month"
                        render={(value, record) => {
                                let mObj = dataMonth.find((obj) => obj.hasOwnProperty(value))
                                return mObj[value]
                            }
                        }
                ></Column>
                <ColumnGroup title={"Харажат моддаси: "+selectedExp} dataIndex="expense" key="expense">
                    <Column title="Смета суммаси" dataIndex="smetaSum" key="smetaSum" align='right' width={150}
                            render={(text, record, index) => (

                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'

                                    }}
                                    className='bm-input-number-align-right'
                                    value={text}
                                    disabled={true}
                                    step={null}
                                    controls={false}
                                    //prefix="$"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />

                            )}
                    ></Column>
                    <Column title="Смета буйича ишлатилмаган сумма" dataIndex="notUseSmetaSum" key="notUseSmetaSum" align='right' width={150}

                            render={(text, record, index) => (

                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'

                                    }}
                                    className='bm-input-number-align-right'
                                    value={text}
                                    step={null}
                                    disabled={true}
                                    controls={false}
                                    //prefix="$"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />

                            )}
                    ></Column>
                    <Column title="Сумма" dataIndex="sumPay" key="sumPay" align='right' width={180}
                            render={(text, record, index) => (

                                <InputNumber
                                    style={{
                                        width: '100%',
                                        textAlign: 'end'

                                    }}
                                    className='bm-input-number-align-right'
                                    value={text}
                                    step={null}
                                    controls={false}
                                    onChange={(event) => {handleSumPayChange(event, index, "sumPay"); }}
                                    //prefix="$"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />

                            )}
                    ></Column>
                </ColumnGroup>
                <Column title="Жами (Харажат моддалари буйича)" dataIndex="expTotal" key="expTotal" align='right' width={180}
                        render={(text, record, index) => (

                            <InputNumber
                                style={{
                                    width: '100%',
                                    textAlign: 'end'

                                }}
                                className='bm-input-number-align-right'
                                value={text}
                                disabled={true}
                                step={null}
                                controls={false}
                                //prefix="$"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            />

                        )}
                ></Column>


            </Table>
        </>
    )
}

export default CNGraphic;