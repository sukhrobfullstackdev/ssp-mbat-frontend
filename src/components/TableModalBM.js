import {Button, Divider, Form, Input, Modal, Pagination, Space, Table} from "antd";
import {DashOutlined} from '@ant-design/icons';
import React, {useState,useContext, useEffect, useRef} from "react";
import axios from "../api/axios";
import {AuthContext} from "../context/AuthContext";
import Draggable from 'react-draggable';
import FilterModal from "./FilterModalBM";
import {useFilter} from "../context/FilterContext";

const QUERY_URL = '/api/public/query';

const TableModal = (props) => {

    const auth = useContext(AuthContext);

    let tableData   = isEmpty(props.modalDataTab)?[]:props.modalDataTab,
        columnsData = isEmpty(props.modalColumnTab)?[]:props.modalColumnTab,
        filterData  = isEmpty(props.modalFilterTab)?[]:props.modalFilterTab,
        modalTitle  = isEmpty(props.modalTitleTab)?[]:props.modalTitleTab,
        condition   = props?.condition,
        filterKey   = props?.filterKey,
        defFilter   = (!props.defFilter)?[]:props.defFilter;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalForm] = Form.useForm()
    const [loading, setLoading] = useState(true);
    const [stateTab, setStateTab] = useState([]);
    const [filterTab, setFilterTab] = useState("");

    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [disabled, setDisabled] = useState(false);
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    });
    const draggleRef = useRef(null);

    const { filterValues } = useFilter();
    const filterDataGlobal = filterValues[filterKey] || '';

    const showModal = () => {
        console.log(condition,'condition')
        console.log(typeof condition,'condition')
        if (!condition) {
            setIsModalOpen(true);
            return
        }
        let cond = condition();
        if (cond) setIsModalOpen(true);
    };

    const handleCancel = () => {
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

    const headers = {
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const getTabData = async (filter = '') => {

        let filters = [];
        if (filter!=='' && filter!== '{}') filters = filter
        //console.log(tableData.query.filters,'beforeFilter')
        //if (tableData.query?.filters && filters.length !== 0) tableData.query.filters.push(filters);

        console.log(filterDataGlobal,'filterDataGlobal')
        console.log(filters,'filtersbefore')

        if (filterDataGlobal && filters.length === 0) {
            filters = [...filters, ...filterDataGlobal];
        }
        console.log(filters,'filtersafter')

        tableData.query['filters'] = filters;

        const queryParams = new URLSearchParams({
            linesPerPage: pageSize,
            pageNum: currentPage,
        });

        console.log(defFilter,'defFilter')

        if (defFilter && defFilter[0] !== undefined && defFilter.length !== 0 ) tableData.query.filters.push(...defFilter)
        //console.log(tableData.query.filters,'afterFilter')
        setLoading(true);
        const { data } = await axios.post(`/api/public/query/paging?${queryParams.toString()}`,
            ( tableData ),
            {
                headers: headers,
                //crossDomain: true,
                withCredentials: false
            });
        setLoading(false);

        setStateTab(data.data);
        setTotalRows(data.totalRowCount);

        setFilterTab( filterData );

    };

    useEffect(() => {
        if (isModalOpen) {
            getTabData();
        }
    }, [isModalOpen, currentPage, pageSize]);



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

    const handleSelectRow = (rec) => {
        props.onSubmit(rec);
        setConfirmLoading(false);
        setIsModalOpen(false);
    }

    const tableHeader = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>
                <FilterModal filterTab={filterTab} onSubmit={getTabData}/>
            </div>
        );
    }

    const onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const pagination = {
        total: stateTab.length,
        showTotal: (total, range) => (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, width: '100%' }}>
                <div>
                    <FilterModal filterKey={filterKey} filterTab={filterTab} onSubmit={getTabData}/>
                </div>

                <div>
                    <strong>{total}</strong> катордан {range[0]}-{range[1]} гача
                </div>
            </div>
        ),
        defaultPageSize: '10',
        onShowSizeChange:onShowSizeChange,
        size: 'small',
        defaultCurrent: 1,
        position: ['topRight'],
        hideOnSinglePage:false,
    };

    return (
        <>
            <Button type="primary" onClick={showModal} shape="default" size="middle" style={{fontSize:"20px", lineHeight:"16px", padding:"0", width:'34px'}}>
                ...
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

                {isModalOpen &&
                    <>
                    <Space direction="horizontal" style={{width: '100%', justifyContent: 'right', margin: '16px 0'}}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={totalRows}
                            onChange={handlePageChange}
                            onShowSizeChange={onShowSizeChange}
                            size='small'
                            defaultCurrent='1'
                            hideOnSinglePage={false}
                            showTotal={(total, range) => (
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, width: '100%' }}>
                                    <div>
                                        <FilterModal filterKey={filterKey} filterTab={filterTab} onSubmit={getTabData}/>
                                    </div>

                                    <div>
                                        <strong>{total}</strong> катордан {range[0]}-{range[1]} гача
                                    </div>
                                </div>
                            )}
                        />
                    </Space>

                    <Table columns={columnsData}
                           dataSource={stateTab}
                           rowKey="id"
                           loading={loading}
                           size="small"
                        //footer={() => 'Footer'}
                        //scroll={{x: 300, y:'calc(100vh - 345px)'}}
                           scroll={{x: 300,}}
                           style={{cursor: "pointer"}}

                           pagination={false}
                           onRow={(record, rowIndex) => {
                               return {
                                   onDoubleClick: (event) => {
                                       handleSelectRow(record)
                                   }, // double click row
                               };
                           }}

                    />
                    </>
                }




            </Modal>
        </>
    )

}

export default TableModal