import {
    Descriptions,
    Layout,
    Table
} from 'antd';
import React from 'react';
import {columns} from "../SmetaData";
import useSmetaTab from "./useSmetaTab";

const SmetaTab = ({setTitleNav}) => {
    const {contextHolder,data,rowSelection,loading,tableHeader,pagination,onRow,selectedRow} = useSmetaTab(setTitleNav);
    return (

        <Layout style={{height:"100%", overflow:"hidden"}}>
            {contextHolder}
            <div style={{position: 'relative', height: '100%'}}>

                <Table columns={columns}
                       dataSource={data}
                       className="table-striped-rows"
                       rowKey="id"
                       rowSelection={rowSelection}
                       loading={loading}
                       title={tableHeader}
                       size='small'
                       scroll={{x: 300, y:'calc(100vh - 350px)'}}
                       tableLayout="auto"
                       pagination={pagination}
                       onRow={onRow}
                    /*style={{width: '100%', height: '100vh'}}*/
                />

                {selectedRow && (

                    <Descriptions bordered
                                  size='small'
                                  style={{ position: 'absolute', left: 0, bottom: 0, width: '100%' }}
                                  column={{
                                      xxl: 3,
                                      xl: 3,
                                      lg: 3
                                  }}>
                        <Descriptions.Item label="Хисоб ракам номи">{selectedRow.acc_name}</Descriptions.Item>
                        <Descriptions.Item label="Яратди">{selectedRow.created_by + ' - '+selectedRow.created_by_name}</Descriptions.Item>
                        <Descriptions.Item label="Яратилган">{selectedRow.created_date}</Descriptions.Item>
                        <Descriptions.Item label="Тафсилотлар">{selectedRow.purpose}</Descriptions.Item>
                        <Descriptions.Item label="Тахрирлади">{selectedRow.modified_by + ' - '+selectedRow.modified_by_name}</Descriptions.Item>
                        <Descriptions.Item label="Тахрирланган сана">{selectedRow.modified_date}</Descriptions.Item>
                    </Descriptions>

                )}

            </div>
        </Layout>

    );

}

export default SmetaTab