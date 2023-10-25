import { Descriptions, Layout, Table} from 'antd';
import React from 'react';
import useRefBank from "./useRefBank";

const {Column} = Table;


const RefBankTab = ({setTitleNav}) => {
    const {contextHolder, rowSelection, data, loading, pagination, onRow, selectedRow} = useRefBank(setTitleNav);
    return (

        <Layout style={{height: "100%", overflow: "hidden"}}>
            {contextHolder}
            <div>
                {/*<div>
                    <FilterModal filterTab={filterTab} onSubmit={getTabData}/>
                </div>*/}

                <Table rowSelection={rowSelection}
                       dataSource={data}
                       className='table-striped-rows'
                       rowKey="id"
                       loading={loading}
                       size="small"
                       scroll={{x: 300, y: 'calc(100vh - 400px)'}}
                       tableLayout="auto"
                       pagination={pagination}
                    //defaultSelectedRowKeys={defaultSelectedRowKeys}
                       onRow={onRow}
                >
                    <Column title="Коди" dataIndex="code" key="code" width={50}></Column>
                    <Column title="Регион" dataIndex="district" key="district" width={100}></Column>
                    <Column title="Номи" dataIndex="name" key="name" width={200}></Column>
                    <Column title="Адрес" dataIndex="address" key="address" width={100}></Column>
                    <Column title="Банк тури" dataIndex="bank_type" key="bank_type" width={100}></Column>
                    <Column title="Холати" dataIndex="state" key="state" width={50}></Column>

                </Table>

                {selectedRow && (

                    <Descriptions bordered
                                  size='small'
                                  column={{
                                      xxl: 4,
                                      xl: 3,
                                      lg: 3
                                  }}
                    >

                        <Descriptions.Item label="Яратди">{selectedRow.created_by}</Descriptions.Item>
                        <Descriptions.Item label="Яратилган сана">{selectedRow.created_date}</Descriptions.Item>
                        <Descriptions.Item label="Тахрирлади">{selectedRow.modified_by}</Descriptions.Item>
                        <Descriptions.Item label="Тахрирланган сана">{selectedRow.modified_date}</Descriptions.Item>
                    </Descriptions>

                )}

            </div>
        </Layout>

    );

}

export default RefBankTab;