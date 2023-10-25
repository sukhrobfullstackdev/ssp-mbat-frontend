import React from 'react';

const useTableActions = (totalItems, selectedRowKeys, setSelectedRow, setSelectedRowKeys) => {
    const onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
    };

    const pagination = {
        total: totalItems,
        showTotal: (total, range) => (
            <span>
                <strong>{total}</strong> катордан {range[0]}-{range[1]} гача
            </span>
        ),
        defaultPageSize: '20',
        onShowSizeChange: onShowSizeChange,
        size: 'small',
        defaultCurrent: 1,
        position: ['topRight'],
        hideOnSinglePage: false,
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
            onClick: () => {
                onSelect(record, rowIndex)
            }
        }
    };
    return {rowSelection, pagination, onRow};
};

export default useTableActions;