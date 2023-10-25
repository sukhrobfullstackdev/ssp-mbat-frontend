import {Descriptions, Layout, Table} from 'antd';
import React from 'react';
import useRefFilial from "./useRefFilial";
const {Column} = Table;


const RefFilialTab = ({setTitleNav}) => {
    const {contextHolder, rowSelection, data, loading, pagination, onRow, selectedRow} = useRefFilial(setTitleNav);
    return (
        <Layout style={{height:"100%", overflow:"hidden"}}>
            {contextHolder}
            <div>
                <Table rowSelection={rowSelection}
                       dataSource={data}
                       className='table-striped-rows'
                       rowKey="id"
                       loading={loading}
                       size="small"
                       scroll={{x: 300, y:'calc(100vh - 400px)'}}
                       tableLayout="auto"
                       pagination={pagination}
                    //defaultSelectedRowKeys={defaultSelectedRowKeys}
                       onRow={onRow}
                >
                    <Column title="Коди" dataIndex="code" key="code" width={50}></Column>
                    <Column title="Номи" dataIndex="name" key="name" width={200}></Column>
                    <Column title="Регион" dataIndex="region" key="region" width={100}></Column>
                    <Column title="Худуд" dataIndex="territory" key="territory" width={100}></Column>

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

export default RefFilialTab