import {AppstoreOutlined, MailOutlined, SettingOutlined} from '@ant-design/icons';
import {Menu} from 'antd';
import {useState} from 'react';

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
const items = [
    getItem('Navigation One', 'sub1', <MailOutlined />, [
        getItem('Option 1', '1'),
        getItem('Option 2', '2'),
        getItem('Option 3', '3'),
        getItem('Option 4', '4'),
    ]),
    getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
        getItem('Option 5', '5'),
        getItem('Option 6', '6'),
        getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
    ]),
    getItem('Navigation Three', 'sub4', <SettingOutlined />, [
        getItem('Option 9', '9'),
        getItem('Option 10', '10'),
        getItem('Option 11', '11'),
        getItem('Option 12', '12'),
    ]),
];

// submenu keys of first level
const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];
const MenuSSP = ({dataMenu}) => {

    const [openKeys, setOpenKeys] = useState(['sub1']);

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    function getItem(name, id, icon, children) {
        return {
            title: name,
            key: id,
            icon: icon,
            children: children,
        };
    }

    function generateItems(data) {
        const itemMap = {};
        const roots = [];

        // Create a map of items for easy reference
        data.forEach((item) => {
            item.children = [];
            itemMap[item.id] = item;
        });

        // Build the item hierarchy
        data.forEach((item) => {
            if (item.parent_id !== null) {
                const parent = itemMap[item.parent_id];
                if (parent) {
                    parent.children.push(item);
                }
            } else {
                roots.push(item);
            }
        });

        // Convert the hierarchy to the desired format
        return roots.map((item) => convertItem(item));
    }

    function convertItem(item) {
        const newItem = {
            id: item.id,
            parent_id: item.parent_id,
            name: item.name,
            url: item.url,
        };

        if (item.children.length > 0) {
            newItem.children = item.children.map((child) => convertItem(child));
        }

        return newItem;
    }

    const result = generateItems(dataMenu);
    console.log(result);

    return (
        <Menu
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            defaultSelectedKeys={[]}
            defaultOpenKeys={[]}
            style={{
                height: '100%',
                borderRight: 0,
                overflowY: 'auto'
            }}
            items={items}
        />
    );
};
export default MenuSSP;