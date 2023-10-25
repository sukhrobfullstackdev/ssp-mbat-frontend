import {
    Badge,
    Button,
    Descriptions,
    Layout,
    message,
    Popconfirm,
    Space,
    Table,
    Tooltip
} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import {Link, useNavigate} from "react-router-dom";
import axios from "../../api/axios";
import {AuthContext} from "../../context/AuthContext";
import {dataTab, dataFilter} from "./VendorData";
import FilterModal from "../../components/FilterModalBM";
import {EditOutlined, EyeOutlined, FileAddOutlined, FileExcelOutlined} from "@ant-design/icons";
import exportToExcel from "../../components/ExportToExcel";
import {useFilter} from "../../context/FilterContext";
import exportAllToExcel from "../../components/ExportAllToExcel";
const {Column} = Table;

const QUERY_URL = '/api/public/query';
const EXECUTE_URL = '/vendor/execute';

const VendorTab = ({setTitleNav}) => {

    let navigate = useNavigate();

    const auth = useContext(AuthContext);

    const { filterValues } = useFilter();
    const filterKey = 'vendorTabFilter'; // Set the filterKey for this route
    const filterData = filterValues[filterKey] || '';

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [stateTab, setStateTab] = useState([]);
    const [filterTab, setFilterTab] = useState("");
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        setTitleNav('Таъминотчилар билан ишлаш');
    }, []);

    const headers = {
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    const getTabData = async (filter = '') => {

        //console.log(filter,' FILTERmmm')

        let filters = [];
        if (filter!=='' && filter!== '{}') filters = filter
        //console.log(dataTab.toString(),'dataTab')

        if (filterData && filters.length === 0) {
            filters = [...filters, ...filterData];
        }

        dataTab.query['filters'] = filters;


        const { data } = await axios.post(QUERY_URL,
            ( dataTab ),
            {
                headers: headers,
                withCredentials: false
            });
        setLoading(false);
        //setStateTab(data);
        console.log(data, 'nndata')
        setStateTab(data);

        setSelectedRow(null)
        setSelectedRowKeys([])

        setFilterTab( dataFilter );

    };

    useEffect(() => {
        getTabData();
    }, []);

    const handleAdd = () => {
        navigate("../VendorAdd");
    };

    const handleApprove = (iddoc) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        console.log('iddoc changed: ', iddoc);
        if (selectedRowKeys.length === 0) {
            messageApi.open({
                type: 'warning',
                content: 'Каторни танланг',
            });

            return false;
        }
        messageApi.open({
            type: 'success',
            content: 'Муввафакият',
        });
    }

    const pagination = {
        total: stateTab.length,
        showTotal: (total, range) => (
            <span>
                <strong>{total}</strong> катордан {range[0]}-{range[1]} гача
            </span>
        ),
        pageSize: 20,
        size: 'small',
        defaultCurrent: 1,
        position: ['topRight'],
        hideOnSinglePage:false,
    };

    const rowSelection = {
        type: 'radio',
        selectedRowKeys,
        getCheckboxProps: (record) => ({
            style: {
                visibility: 'hidden',
                position: 'absolute',
            },
        }),
        onChange: (record, selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
        },

    };

    const onSelect = (record, rowIndex) => {
        setSelectedRowKeys([record.id]);
        setSelectedRow(record);
    };

    const onRow = (record, rowIndex) => {
        return {
            onClick: () =>{ onSelect(record, rowIndex) }
        }
    };

    const defaultSelectedRowKeys = [0]

    const handlePageChange = (page, pageSize) => {
        // Handle page change
    };

    const handlePageSizeChange = (current, size) => {
        // Handle page size change
    };

    const tableHeader = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>
                <Button
                    onClick={handleAdd}
                    type="primary"
                    icon={<FileAddOutlined style={{fontSize:'16px'}}/>}
                >
                    Янги таъминотчи
                </Button>
                {/*<Button
                    onClick={handleApprove}
                    type="primary"
                >
                    Тасдиклаш
                </Button>*/}

                <Button type="primary" shape="circle" onClick={() => exportAllToExcel(dataTab, auth)}>
                    <FileExcelOutlined/>
                </Button>

                <FilterModal filterKey={filterKey} filterTab={filterTab} onSubmit={getTabData}/>
            </div>
        );
    }

    return (

        <Layout style={{height:"100%", overflow:"hidden"}}>
            {contextHolder}
            <div style={{position: 'relative', height: '100%'}}>

                <Table rowSelection={rowSelection}
                       dataSource={stateTab}
                       className='table-striped-rows'
                       rowKey="id"
                       loading={loading}
                       size='small'
                       scroll={{x: 300, y:'calc(100vh - 430px)'}}
                       title={tableHeader}
                       pagination={pagination}
                    //defaultSelectedRowKeys={defaultSelectedRowKeys}
                       onRow={onRow}
                >
                    <Column title="ИД" dataIndex="id" key="id" width={50} defaultSortOrder='descend' sorter={(a, b) => a.id - b.id}></Column>
                    <Column title="Номи" dataIndex="name" key="name" width={200} ellipsis={true} sorter={(a, b) => a.name.length - b.name.length}></Column>
                    <Column title="ИНН" dataIndex="inn" key="inn" width={100}></Column>
                    <Column title="Давлат рег. рақами" dataIndex="gov_reg_numb" key="gov_reg_numb" width={100} ellipsis={true} sorter={(a, b) => a.gov_reg_numb - b.gov_reg_numb}></Column>
                    <Column title="Давлат рег. санаси" dataIndex="gov_reg_date" key="gov_reg_date" width={100} ellipsis={true} sorter={(a, b) => new Date(a.gov_reg_date.split('.').reverse().join('-')) - new Date(b.gov_reg_date.split('.').reverse().join('-'))}></Column>
                    <Column title="Бенефициар" dataIndex="beneficiar" key="beneficiar" width={100} ellipsis={true} sorter={(a, b) => a.beneficiar.length - b.beneficiar.length}></Column>
                    <Column title="Бухгалтер" dataIndex="bookkeeper" key="bookkeeper" width={100} ellipsis={true}></Column>
                    <Column title="Директор" dataIndex="chief" key="chief" width={100}></Column>
                    <Column title="Худуд" dataIndex="territory" key="territory" width={100} sorter={(a, b) => a.territory - b.territory}></Column>
                    <Column title="Таъминотчи тури" dataIndex="vendor_type" key="vendor_type" width={100} ellipsis={true}></Column>
                    <Column title="Холат" dataIndex="state_name" key="state" width={100} sorter={(a, b) => a.state_name - b.state_name}
                            render={(text, record) =>
                                (
                                    <Space size="middle">
                                        {
                                              record.state === 2 ? <Badge status="success" text={text} />
                                            : record.state === 3 ? <Badge status="volcano" text={text} />
                                            : <Badge status="default" text={text} />
                                        }
                                    </Space>
                                )}
                    ></Column>
                    {/*<Column title="Амал" key="action" width={100}
                            render={(_, record) =>
                                stateTab.length >= 1 ? (
                                    <Popconfirm title="Ишончингиз комилми?" onConfirm={() => handleApprove(record.id)}>
                                        <a>Тасдиклаш</a>
                                    </Popconfirm>
                                ) : null}>
                    </Column>*/}
                    <Column title="" key="action" width={100}
                            render={(_, record) => {
                                return (
                                    <Space size="middle">
                                    {record.state === 1 ?
                                        <Tooltip title={"Таҳрирлаш"}>
                                            <Link to={`edit/${record.id}`}>
                                            <Button type="default" shape="circle" icon={<EditOutlined />} />
                                            </Link>
                                        </Tooltip> :
                                        <Tooltip title={"Кўриш"}>
                                            <Link to={`edit/${record.id}`}>
                                                <Button type="default" shape="circle" icon={<EyeOutlined />} />
                                            </Link>
                                        </Tooltip>
                                    }
                                </Space>
                                )
                            }}>
                    </Column>
                </Table>

                {selectedRow && (

                    <Descriptions bordered
                                  size='small'
                                  style={{ position: 'absolute', left: 0, bottom: 0, width: '100%' }}
                                  column={{
                                      xxl: 5,
                                      xl: 3,
                                      lg: 3
                                  }}
                    >

                        <Descriptions.Item label="Манзил">{selectedRow.address||''}</Descriptions.Item>
                        <Descriptions.Item label="ОКОНХ">{selectedRow.okonh||''}</Descriptions.Item>
                        <Descriptions.Item label="Тел. рақам">{selectedRow.phones||''}</Descriptions.Item>
                        <Descriptions.Item label="Яратди">{selectedRow.created_by + ' - '+selectedRow.created_by_name}</Descriptions.Item>
                        <Descriptions.Item label="Яратилган сана">{selectedRow.created_date||''}</Descriptions.Item>

                        <Descriptions.Item label="Юридик манзил">{selectedRow.address_jur||''}</Descriptions.Item>
                        <Descriptions.Item label="ПИНФЛ">{selectedRow.pinfl||''}</Descriptions.Item>
                        <Descriptions.Item label="Факс">{selectedRow.fax||''}</Descriptions.Item>
                        <Descriptions.Item label="Тахрирлади">{selectedRow.modified_by + ' - '+selectedRow.modified_by_name||''}</Descriptions.Item>
                        <Descriptions.Item label="Тахрирланган сана">{selectedRow.modified_date||''}</Descriptions.Item>

                        <Descriptions.Item label="Эслатма">{selectedRow.note||''}</Descriptions.Item>
                        <Descriptions.Item label="Резидент">{selectedRow.is_resident||''}</Descriptions.Item>
                        <Descriptions.Item label="Мамлакат">{selectedRow.country||''}</Descriptions.Item>
                        <Descriptions.Item label="Индекс">{selectedRow.post_index||''}</Descriptions.Item>
                        <Descriptions.Item label="Кичик бизнес?">{selectedRow.size_status||''}</Descriptions.Item>

                    </Descriptions>

                )}

            </div>
        </Layout>

    );

}

export default VendorTab