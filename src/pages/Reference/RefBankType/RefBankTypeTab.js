import {Layout, Table} from 'antd';
import React from 'react';
import useRefBankType from "./useRefBankType";
const {Column} = Table;

const RefBankTypeTab = ({setTitleNav}) => {
    const {contextHolder, rowSelection, data, loading, pagination, onRow} = useRefBankType(setTitleNav);
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
                    <Column title="Мамлакат" dataIndex="country" key="country" width={100}></Column>
                    <Column title="Номи" dataIndex="name" key="name" width={200}></Column>
                    <Column title="Қисқа номи" dataIndex="short_name" key="short_name" width={100}></Column>
                    <Column title="Х.Р. тури" dataIndex="account_type" key="account_type" width={100}></Column>
                    <Column title="Холати" dataIndex="state" key="state" width={50}></Column>

                </Table>

            </div>
        </Layout>

    );

}

export default RefBankTypeTab