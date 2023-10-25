import { Descriptions } from 'antd';

const TableFooter = ({ dataSource }) => {
    const totalRecords = dataSource.length;

    return (
        <div>
            <Descriptions title={`Total Records: ${totalRecords}`}>
                <Descriptions.Item label="Column 1 Total">
                    {dataSource.reduce((sum, record) => sum + record.column1, 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Column 2 Total">
                    {dataSource.reduce((sum, record) => sum + record.column2, 0)}
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default TableFooter;