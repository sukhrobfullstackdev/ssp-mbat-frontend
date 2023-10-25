import {Button, Divider, Form, Input, InputNumber, Modal, Table} from "antd";
import React, {useState,useContext, useEffect, useRef} from "react";
import axios from "../api/axios";
import {AuthContext} from "../context/AuthContext";
import Draggable from 'react-draggable';
import {TableOutlined} from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import { useMemo } from "react";


const QUERY_URL = '/api/public/query';

let bb = {}
export const setExp = (exp,par,sum) => {
    let sexp = par.toString()
    let expObj;
    let tt;
    let curexp;
    let curinx;
    /*console.log(sexp,'sexp')
    console.log(bb[sexp],'bb')*/
    if (bb[sexp] == undefined) {
        bb[sexp] = []
        tt = bb[sexp];
        tt[0] = {"expense":exp, "sumpay":sum}
    } else {

        for(let i = 0; i < bb[sexp].length; i++) {
            if(bb[sexp][i].expense == exp) {
                curinx = i;
                curexp = bb[sexp][i].expense
                break;
            }
        }
        if (curinx == undefined) {
            bb[sexp].push({"expense":exp, "sumpay":sum})
        }
        else {
            if (bb[sexp][curinx].sumpay == sum) return
            else bb[sexp][curinx].sumpay = sum
        }

    }

    //console.log(bb,'bb')
    //sumParent(par)
}

export const sumParent = (parExp) => {
    console.log('PARENT');
    var size = Object.keys(bb).length;
    let parSum = 0;
    console.log(size);
    let parObj = bb[parExp]
    console.log(parObj, 'parObj');
    parObj.forEach((item) => {
        console.log(item.sum);
        parSum += +item.sum
    })
    //parentSum = parSum;
    console.log(parSum);
    console.log(parExp);
    //console.log(document.querySelector('input[data-parent="'+parSum+'"]'));
    document.querySelector('input[data-parent="'+parExp+'"]').value = parSum;

}


//ANTD EDIT TABLE BEG
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          record,
                          handleSave,
                          ...restProps
                      }) => {
    const [editing, setEditing] = useState(false);
    const [number, setNumber] = useState(0);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const onNumberChange = (e) => {
        const newNumber = parseInt(e.target.value || '0', 10);
        if (Number.isNaN(newNumber)) {
            return;
        }
        /*if (!('number' in value)) {
            setNumber(newNumber);
        }*/
        // triggerChange({
        //     number: newNumber,
        // });
    };



    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                /*rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}*/
            >
                <Input ref={inputRef} onPressEnter={save} onFocus={()=> inputRef.current.focus({ cursor: 'all'})}  onBlur={save} style={{textAlign:"right"}} />
                {/*<NumericInput ref={inputRef} onPressEnter={save} onFocus={()=> inputRef.current.focus({ cursor: 'all'})}  onBlur={save} style={{textAlign:"right"}}/>*/}

                {/*<InputNumber ref={inputRef} onPressEnter={save} onFocus={()=> inputRef.current.focus({ cursor: 'all'})}  onBlur={save} style={{textAlign:"right"}}
                       value={number}
                             controls={false}
                       onChange={onNumberChange}
                />*/}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                    border: '1px solid lightgray',
                    borderRadius: '5px',
                    padding: "3px 6px"
                }}
                tabIndex="0"
                onClick={toggleEdit}
                onFocus={toggleEdit}
            >
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};

//ANTD EDIT TABLE END
let drt;
export const getTabExpSum = () =>{
    return drt;
}


const TableExpModal = (props) => {

    const auth = useContext(AuthContext);

    const { t } = useTranslation();

    let tableData = isEmpty(props.modalDataTab)?[]:props.modalDataTab,
        //columnsData = isEmpty(props.modalColumnTab)?[]:props.modalColumnTab,
        //columnsData = columnsExp,
        filterData = isEmpty(props.modalFilterTab)?[]:props.modalFilterTab,
        modalTitle = isEmpty(props.modalTitleTab)?[]:props.modalTitleTab,
        buttonTitle = isEmpty(props.buttonTitleTab)?'...':props.buttonTitleTab;

    const columnsExpBM = [
        {
            title: t('id'),
            dataIndex: 'id',
            width: 100,
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: t('expCode'),
            dataIndex: 'code',
            width: 150,
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.code.length - b.code.length,
            //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            ellipsis: true,
            render: (text, record) =>
                /*{
                    console.log(text,'text');
                    console.log(record,'rec');
                }*/
                record.isleaf === 'Y' ? (
                    text
                ) : (
                    <b>{text}</b>
                ),
        },
        {
            title: t('name'),
            dataIndex: 'name',
            width: 400,
            sorter: (a, b) => a.name.length - b.name.length,
            //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            ellipsis: true,
            render: (text, record) =>
                /*{
                    console.log(text,'text');
                    console.log(record,'rec');
                }*/
                record.isleaf === 'Y' ? (
                    /*<Tooltip placement="bottomRight" title={text}>*/
                    text
                    /*</Tooltip>*/

                ) : (
                    /*<Tooltip placement="bottomRight" title={text}>*/
                    <b>{text}</b>
                    /*</Tooltip>*/
                ),
        },
        {
            title: t('parentExpCode'),
            dataIndex: 'parent',
            width: 150,
            sorter: (a, b) => a.parent.length - b.parent.length,
            //sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            ellipsis: true,
            render: (text, record) =>
                record.isleaf === 'Y' ? (
                    text
                ) : (
                    <b>{text}</b>
                ),
        },
        {
            title: t('sumpay'),
            dataIndex: 'sumpayexp',
            width: 200,
            align: "right",
            editable: true
        },

    ];

    const [dataSource, setDataSource] = useState([])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalForm] = Form.useForm()
    const [loading, setLoading] = useState(true);
    const [stateTab, setStateTab] = useState([]);
    const [filterTab, setFilterTab] = useState("");

    const [disabled, setDisabled] = useState(false);
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    });
    const draggleRef = useRef(null);

    const showModal = () => {
        setIsModalOpen(true);
    };


    const formExpSum = () =>{
        let expObj = dataSource.filter(item => item.sumpayexp !== 0)
        let docSumpay = expObj.reduce((acc, item) => acc+Number(item.sumpayexp),0)
        drt = expObj.map((item)=> {
            return {'expense':item.code,'sumPay':Number(item.sumpayexp)}
        })
        props.setDocSumpay(docSumpay)

        //console.log(drt)
    }

    const handleCancel = () => {
        formExpSum()
        setIsModalOpen(false);
    };

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    const onReset = () => {
        modalForm.resetFields();
    };

    const handleOk = () => {

        let mfilter = []

        //setConfirmLoading(true);

        Object.keys(modalForm.getFieldsValue()).map((item, i) => {
            if (modalForm.getFieldValue(item)!== undefined && modalForm.getFieldValue(item)!== "") {
                let itemAttr = modalForm.getFieldInstance(item).input.dataset;

                mfilter.push({
                    column: item,
                    operator: itemAttr.operator,
                    value: Number(modalForm.getFieldValue(item)),
                    dataType: itemAttr.type
                });
            }

        })

        if (mfilter.length!==0){
            props.onSubmit(mfilter).then(r => {
                setIsModalOpen(false);
                setConfirmLoading(false);
            });
        } else {
            setIsModalOpen(false);
            setConfirmLoading(false);
        }

        // setTimeout(() => {
        //
        // }, 2000);

    };

    const headers = {'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const getTabData = async (filter = '') => {

        /*let filters = [];
        if (filter!=='' && filter!== '{}') filters = filter

        tableData.query['filters'] = filters;*/


        const { data } = await axios.post(QUERY_URL,
            ( tableData ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        setLoading(false);
        //setStateTab(data);
        let newData = data.map(row => ({
            key: row.id,
            id: row.id,
            code: row.code,
            parent: row.parent,
            name: row.name,
            sumpayexp: row.sumpayexp,
            isleaf: row.isleaf
        }))
        // setDataSource(newData);

        setFilterTab( filterData );
        return newData

    };


    useEffect(() => {
        getTabData().then((data => {
            data.forEach(item => {
                props.paydocPoints?.forEach(paydocItem => {;
                    if (item.code === paydocItem.expense) {
                        item.sumpayexp = paydocItem.sumPay
                    }
                })
            })
            setDataSource(data);
        }));
    }, []);

    const onStart = (_event, uiData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const mergedColumns = columnsExpBM.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const pagination = {
        total: dataSource.length,
        showTotal: (total, range) => (
            <span>
                <strong>{total}</strong> катордан {range[0]}-{range[1]} гача
            </span>
        ),
        pageSize: 20,
        defaultCurrent: 1,
    };

    return (
        <>
            <Button type="primary" onClick={showModal} shape="default" size="middle" icon={<TableOutlined />}>
                {buttonTitle}
                {/*<DashOutlined style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }} />*/}
            </Button>
            <Modal
            title={
                <div
                    style={{
                        width: '100%',
                        cursor: 'move',
                    }}
                    onMouseOver={() => {
                        if (disabled) {
                            setDisabled(false);
                        }
                    }}
                    onMouseOut={() => {
                        setDisabled(true);
                    }}
                    // fix eslintjsx-a11y/mouse-events-have-key-events
                    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
                    onFocus={() => {}}
                    onBlur={() => {}}
                    // end
                >
                    {modalTitle}
                </div>
            }
            open={isModalOpen}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            width="70%"
            footer={[]}
            modalRender={(modal) => (
                <Draggable
                    disabled={disabled}
                    bounds={bounds}
                    onStart={(event, uiData) => onStart(event, uiData)}
                >
                    <div ref={draggleRef}>{modal}</div>
                </Draggable>
            )}
        >
            {/*<hr style={{color:"#f3ecaf"}}></hr>*/}
            <Divider />

            <Table components={components}
                    columns={mergedColumns}
                    dataSource={dataSource}
                    className="table-striped-rows"
                    rowKey="id"
                    rowClassName={() => 'editable-row'}
                    loading={loading}
                    size="small"
                //footer={() => 'Footer'}
                //scroll={{x: 300, y:'calc(100vh - 345px)'}}
                    scroll={{x: 300, y:'calc(100vh - 345px)'}}
                    pagination={pagination}

            />




            </Modal>
        </>
    )

}

export default TableExpModal
