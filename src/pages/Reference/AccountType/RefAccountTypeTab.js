import {Layout, Table} from 'antd';
import React from 'react';
import useRefAccountType from "./useRefAccountType";

const {Column} = Table;

const RefAccountTypeTab = ({setTitleNav}) => {
    const {data, loading, contextHolder, rowSelection, pagination, onRow} = useRefAccountType(setTitleNav);
    return (
        <Layout style={{height: "100%", overflow: "hidden"}}>
            {contextHolder}
            <div>
                <Table rowSelection={rowSelection}
                       dataSource={data}
                       className='table-striped-rows'
                       rowKey="id"
                       loading={loading}
                       size="small"
                       scroll={{x: 300, y: 'calc(100vh - 400px)'}}
                       tableLayout="auto"
                       pagination={pagination}
                       onRow={onRow}
                >
                    <Column title="ИД" dataIndex="id" key="id" width={50}></Column>
                    <Column title="Номи" dataIndex="name" key="name" width={100}></Column>
                </Table>
            </div>
        </Layout>

    );

}

export default RefAccountTypeTab