import {useEffect, useState, React} from "react";
import {Input, Button, Table, InputNumber, Select, Drawer, Space} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import CNGraphic from "./Graphic";
import TableModal from "../../components/TableModalBM";
import {useTranslation} from "react-i18next";
import {dataExpFilter, columnsExp, dataExpTab, dataGoodsTab, columnsGoods, dataGoodsFilter} from "./ContractData";
let indOrdNum = 1;

const CNSpecification = ({setSpecData, setGraphData, smetaData, specifications}) => {
    const [data, setData] = useState([
        // { goodId: "", ordNum: 1, expense: "", name: "", unit: "", amount: 1, price: 0, sumPay: 0/*, akciz: 0, sumakciz: 0 */}
    ]);
    const [childrenDrawer, setChildrenDrawer] = useState(false);
    const [expense, setExpense] = useState()
    const [ordNum, setOrdNum] = useState(1)
    const [defGoodsFilter, setDefGoodsFilter] = useState([])

    const defFilter = smetaData

    const { t } = useTranslation();

    useEffect(()=> {
        if (specifications?.length > 0) {
            setData(specifications)
        }
    }, [specifications])

    const showChildrenDrawer = (record, index) => {
        //let expSpec = data.filter(item => item.expense !== "").map(item => item.expense)
        setExpense(record.expense)
        setChildrenDrawer(true);
    };
    const onChildrenDrawerClose = () => {
        setChildrenDrawer(false);
    };

    const handleAddRow = () => {
        setOrdNum(ordNum+1)
        setData([...data, { goodId: "", ordNum: ordNum+1, expense: "", name: "", unit: "", amount: 1, price: 0, sumPay: 0/*, akciz: 0, sumakciz: 0*/ }]);
    };

    const handleRemoveRow = (index) => {
        setOrdNum(ordNum-1)
        setData([...data.slice(0, index), ...data.slice(index + 1)]);
    };

    useEffect(()=>{
        setSpecData(data)
    },[data])

    const handleExpSet = (rec, index, key) => {
        if (key === "expense") {
            /*setDefGoodsFilter([{
                index: index,
                expFilter:{
                    column: 'expense',
                    value: rec.code,
                    operator: '=',
                    dataType: 'text'
                }
            }]) //good form by expense*/
            console.log(defGoodsFilter, 'llololo')
            const newExp = rec.code;
            const updatedItems = updDefGoodsFilter(index, newExp, defGoodsFilter);
            setDefGoodsFilter(updatedItems)
            console.log(updatedItems,'updateiTEMS')
        }

        setData([
            ...data.slice(0, index),
            {
                ...data[index],
                [key]: rec.code
            },
            ...data.slice(index + 1)
        ]);
    }

    const updDefGoodsFilter = (index, newExp, arr) => {
        const updatedItem = {
            ...arr[index], // copy the item at the specified index
            expFilter: {
                column: 'expense',
                value: newExp,
                operator: '=',
                dataType: 'text'
            }
        };

        const updatedArr = [...arr]; // copy the original array
        updatedArr[index] = updatedItem; // replace the item at the specified index

        return updatedArr;
    }

    const handleGoodSet = (rec, index, key) => {
        /*let jsonb = JSON.parse(rec.name.value) //MULTILANG
        let goodName = jsonb.RU;*/
        let goodName = rec.name
        setData([
            ...data.slice(0, index),
            {
                ...data[index],
                [key]: goodName,
                ["unit"]: rec.unit,
                ["goodId"]: rec.good_id
            },
            ...data.slice(index + 1)
        ]);
    }

    const handleInputChange = (event, index, key) => {
        setData([
            ...data.slice(0, index),
            {
                ...data[index],
                [key]: event.target && event.target.value ? event.target.value : event
            },
            ...data.slice(index + 1)
        ]);

        //if (key === "price" || key === "amount") calcTotalSum(index)
    };

    const handleAmountChange = (event, index, key) => {
        const updData = [...data];
        console.log(event,'amount')
        updData[index][key] = event;
        updData[index]['sumPay'] = data[index][key]*data[index]['price'];
        setData(updData)
    };

    const handlePriceChange = (event, index, key) => {
        const updData = [...data];
        console.log(event,'price')
        updData[index][key] = event;
        let expSum = data[index][key]*data[index]['amount']
        updData[index]['sumPay'] = expSum;
        setData(updData)
        console.log(updData,'kkk')
    };

    const columns = [
        {
            title: "№",
            dataIndex: "ordNum",
            key:"ordNum",
            render: (text, record, index) => (
                index+1
                /*<Input
                    value={index+1}
                    //onChange={(event) => handleInputChange(event, index, "ordNum")}
                    style={{
                        width: 50,
                    }}
                />*/
            )
        },
        {
            title: "ИД",
            dataIndex: "goodId",
            render: (text, record, index) => (
                <Input
                    value={text}
                    readOnly='readonly'
                    onChange={(event) => handleInputChange(event, index, "goodId")}
                />
            )
        },
        {
            title: "Харажат моддаси",
            dataIndex: "expense",
            width: 200,
            render: (text, record, index) => (
                <>
                    <Space.Compact>

                        <Input
                            value={text}
                            style={{width: '80%'}}
                            readOnly='readonly'
                            onChange={(event) => handleInputChange(event, index, "expense")}
                        />

                        <TableModal modalDataTab={dataExpTab}
                                    modalColumnTab={columnsExp(t)}
                                    modalFilterTab={dataExpFilter}
                                    modalTitleTab="Харажат моддалари"
                                    defFilter={defFilter}
                                    onSubmit={ (rec) => handleExpSet(rec, index, "expense") }
                        />

                    </Space.Compact>
                </>
            )
        },
        {
            title: "Товарлар ва хизматларнинг номи",
            dataIndex: "name",
            render: (text, record, index) => (
                <>
                    <Space.Compact>

                        <Input
                            value={text}
                            style={{width: '80%'}}
                            readOnly='readonly'
                            onChange={(event) => handleInputChange(event, index, "name")}
                        />

                        <TableModal modalDataTab={dataGoodsTab}
                                    modalColumnTab={columnsGoods(t)}
                                    modalFilterTab={dataGoodsFilter}
                                    modalTitleTab={t('goods')}
                                    defFilter={[defGoodsFilter[index]?.expFilter]}
                                    onSubmit={ (rec) => handleGoodSet(rec, index, "name") }
                        />

                    </Space.Compact>
                </>
            )
        },
        {
            title: "Улчов бирлиги",
            dataIndex: "unit",
            render: (text, record, index) => (

                <Input
                    value={text}
                    style={{width: '80%'}}
                    onChange={(event) => handleInputChange(event, index, "unit")}
                />

                /*<Select
                    defaultValue="dona"
                    style={{
                        width: 100,
                    }}
                    readonly='readonly'
                    onChange={(event) => handleInputChange(event, index, "unit")}
                    options={[
                        {
                            value: 'dona',
                            label: 'Дона',
                        },
                        {
                            value: 'litr',
                            label: 'Литр',
                        },
                        {
                            value: 'kg',
                            label: 'Кг',
                        },

                    ]}
                />*/

            )
        },
        {
            title: "Микдор",
            dataIndex: "amount",
            render: (text, record, index) => (
                <InputNumber min={1} max={100000} value={text} defaultValue={1}
                    style={{
                        width: 80,
                    }}
                    onChange={(event) => { handleAmountChange(event, index, "amount"); }}
                />
            )
        },
        {
            title: "Нарх",
            dataIndex: "price",
            render: (text, record, index) => (
                /*<Input
                    value={text}
                    placeholder="0" style={{textAlign:'right'}}
                    onChange={(event) => handleInputChange(event, index, "price")}
                />*/

                <InputNumber
                    style={{
                        width: '100%',
                        textAlign: 'end'

                    }}
                    className='bm-input-number-align-right'
                    value={text}
                    defaultValue={0}
                    step={null}
                    controls={false}
                    onChange={(event) => {handlePriceChange(event, index, "price"); }}
                    //prefix="$"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
            )
        },
        {
            title: "Сумма",
            dataIndex: "sumPay",
            render: (text, record, index) => (
                <InputNumber
                    style={{
                        width: '100%',
                        textAlign: 'end'

                    }}
                    className='bm-input-number-align-right'
                    defaultValue={0}
                    value={text}
                    step={null}
                    controls={false}
                    disabled={true}
                    /*onChange={(event) => handleInputChange(event, index, "sumPay")}*/
                    //prefix="$"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
            )
        },
        /*{
            title: "Ставка акциз",
            dataIndex: "akciz",
            render: (text, record, index) => (
                <Input
                    value={text}
                    addonAfter='%'
                    placeholder="0" style={{textAlign:'right'}}
                    onChange={(event) => handleInputChange(event, index, "akciz")}
                />
            )
        },
        {
            title: "Сумма акциз",
            dataIndex: "sumakciz",
            render: (text, record, index) => (
                <Input
                    value={text}
                    placeholder="0" style={{textAlign:'right'}}
                    onChange={(event) => handleInputChange(event, index, "sumakciz")}
                />
            )
        },*/
        {
            title: "",
            dataIndex: "",
            render: (text, record, index) =>
                data.length > 1 ? (
                    <MinusCircleOutlined onClick={() => handleRemoveRow(index)} />
                ) : null
        },
        /*{
            title: "",
            dataIndex: "",
            render: (text, record, index) =>
                data.length >= 1 ? (
                    <Button type="primary" onClick={() => showChildrenDrawer(record, index)}>
                        ...
                    </Button>
                ) : null
        }*/
    ];

    return (
        <>
            {/*<Drawer
                title="График"
                width={800}
                placement='left'
                closable={false}
                onClose={onChildrenDrawerClose}
                open={childrenDrawer}
            >

                <CNGraphic setGraphData={setGraphData} expense={expense}/>

            </Drawer>*/}
            {data.length > 0 && (
                <Table rowKey='ordNum' columns={columns} dataSource={data} pagination={false} size='small'/>
            )}
            <Button type="dashed" onClick={handleAddRow} block icon={<PlusOutlined />}>
                Кушиш
            </Button>
        </>
    );
};

export default CNSpecification;
