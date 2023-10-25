import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, message, Space, Tag, Tree} from 'antd';
import {LeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "../../api/axios";
import {dataAccFilter, dataAccTab} from "../Account/AccountData";

const QUERY_URL = '/api/public/query';
const SAVE_URL = '/admin/access-role-actions/saveAll';

const docTypes = [
    {'doctype': 'ACCOUNT'   , 'code':'1'},
    {'doctype': 'SMETA'     , 'code':'2'},
    {'doctype': 'CONTRACT'  , 'code':'3'},
    {'doctype': 'CASHAPP'   , 'code':'4'},
    {'doctype': 'PAYDOC'    , 'code':'5'},
]

const codeDocTypes = [
    {'doctype': 'ACCOUNT'   , 'code':'0-1-0-0'},
    {'doctype': 'SMETA'     , 'code':'0-2-0-0'},
    {'doctype': 'CONTRACT'  , 'code':'1-3-1-0'},
    {'doctype': 'CASHAPP'   , 'code':'1-4-1-0'},
    {'doctype': 'PAYDOC'    , 'code':'0-5-0-0'},
]

const treeDataStat = [
    {
        title: 'Хисоб ракамлар',
        key: '0-1-0-0',
        children: [
            {
                title: 'Тасдиклаш',
                key: '0-1-0-2',
            },
            {
                title: 'Тасдикдан ечиш',
                key: '0-1-0-3',
            },
        ],
    },
    {
        title: 'Смета',
        key: '0-2-0-0',
        children: [
            {
                title: 'Тасдиклаш',
                key: '0-2-0-2',
            },
            {
                title: 'Тасдикдан ечиш',
                key: '0-2-0-3',
            },
        ],
    },
    {
        title: 'Юридик мажбуриятлар',
        key: '0-3-0-0',
        children: [
            {
                title: 'Шартномалар билан ишлаш',
                key: '1-3-0-0',
                children: [
                    {
                        title: '"Маққуллаш"',
                        key: '1-3-1-2',
                    },
                    {
                        title: '"Тасдиқлаш"',
                        key: '1-3-1-3',
                    },
                    {
                        title: '"Маъқуллашни бекор қилиш"',
                        key: '1-3-1-5',
                    },
                    {
                        title: '"Тасдиқни бекор қилиш"',
                        key: '1-3-1-6',
                    },
                ],
            },
            {
                title: 'Суровномалар билан ишлаш',
                key: '1-4-0-0',
                children: [
                    {
                        title: 'Тасдиклаш',
                        key: '1-4-1-2',
                    },
                    {
                        title: 'Тасдикдан ечиш',
                        key: '1-4-1-3',
                    },
                ],
            },
        ],
    },
    {
        title: 'Тулов хужжатлари билан ишлаш',
        key: '0-5-0-0',
        children: [
            {
                title: 'Тасдиклаш',
                key: '0-5-0-2',
            },
            {
                title: 'Тасдикдан ечиш',
                key: '0-5-0-4',
            },
        ],
    },
];

const AccessDocAction = (props) => {

    const navigate = useNavigate();

    const auth = useContext(AuthContext);

    const roleId = props.roleData.roleId;

    const [expandedKeys, setExpandedKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [treeData, setTreeData] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);

    const [loading, setLoading] = useState(true);

    const onExpand = (expandedKeysValue) => {
        console.log('onExpand', expandedKeysValue);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    const onCheck = (checkedKeysValue) => {
        console.log('onCheck', checkedKeysValue);
        setCheckedKeys(checkedKeysValue);
    };

    const onSelect = (selectedKeysValue, info) => {
        console.log('onSelect', info);
        setSelectedKeys(selectedKeysValue);
    };

    const dataTree = {
        "query": {
            "id": "DOC_TYPE_REF_V",
            "source": "DOC_TYPE_REF_V",
            "fields": [
                {   "column": "action", "format": "number", "type": "number" },
                {   "column": "action_code", "format": "text", "type": "text" },
                {   "column": "name", "format": "text", "type": "text" },
                {   "column": "doc_type", "format": "text", "type": "text" },
                {   "column": "doc_type_name", "format": "text", "type": "text" },
            ]
        }
    }

    const getTreeData = async () => {

        const { data } = await axios.post(QUERY_URL,
            ( dataTree ),
            {
                headers: headers,
                withCredentials: false
            });

        const tree_Data = data.reduce((acc, { action, action_code, name, doc_type, doc_type_name }) => {
            const parentNode = acc.find(({ title }) => title === doc_type_name);
            if (parentNode) {
                parentNode.children.push({ title: name, key: action_code });
            } else {
                acc.push({ title: doc_type_name, key: doc_type, children: [{ title: name, key: action_code }] });
            }
            return acc;
        }, []);

        setTreeData(tree_Data)
        setLoading(false);

    };

    const dataTab = {
        "query": {
            "id": "ACCESS_ROLE_ACTION",
            "source": "ACCESS_ROLE_ACTION",
            "fields": [
                {   "column": "role", "format": "number", "type": "number" },
                {   "column": "doc_type", "format": "text", "type": "text" },
                {   "column": "doc_action", "format": "number", "type": "number" },
            ],
            "filters": [
                { "column": "role", "value": roleId, "operator": "=", "dataType":"number" },
            ]
        }
    }

    const getActionData = async () => {

        const { data } = await axios.post(QUERY_URL,
            ( dataTab ),
            {
                headers: headers,
                withCredentials: false
            });
        setLoading(false);

        let dataStr = [];
        data.forEach(elem => {
            const docType = elem.doc_type;
            const docAction = elem.doc_action;
            const foundType = codeDocTypes.find(type => type.doctype === elem.doc_type);
            //console.log(elem,'strTree')
            //console.log(foundType.code,'foundType')
            //let tt = foundType.code.split('-');

            //tt[3] = elem.doc_action.toString();
            //dataStr.push(tt.join('-'))
            let actStr = docType.toLowerCase()+'-'+docAction;
            dataStr.push(actStr)

        })

        //console.log(dataStr,'dataStrdataStr')
        setCheckedKeys(dataStr);

    };

    useEffect(() => {
        if (roleId) {
            getTreeData()
            getActionData()
        }
    }, [roleId]);

    const handleSave = async (selectedKeysValue, info) => {
        //console.log('selectedKeys', selectedKeys);
        //console.log('checkedKeys', checkedKeys);
        let submitStr = [],
            isAction = checkedKeys.filter(elem => elem.split('-')[1] !== undefined )
        //console.log('isAction', isAction);
        isAction.forEach(elem => {
            let doc_type = elem.split('-')[0] // tip dokumenta
            let action = elem.split('-')[1] //deystvie

            //const foundType = docTypes.find(type => type.code === doc_type); // find the object with the matching code

            submitStr.push({
                role: roleId,
                docType: doc_type.toUpperCase(),
                docAction: action
            })

            /*if (foundType) { // if an object was found
                const doctype = foundType.doctype; // get the doctype property of the matching object
                submitStr.push({
                    role: roleId,
                    docType: doctype,
                    docAction: action
                })
            } else { // if no object was found
                alert('Object not found.'); // log an error message
            }*/
        })

        try {
            const data = await axios.post(SAVE_URL,
                 JSON.stringify(submitStr),
                {
                    headers: headers,
                    withCredentials: false
                }).then(response => {
                    message.success('Муввафакият');
                    //console.log(response, 'response');
                } )
        } catch (err) {
            if (!err?.response) {
                message.error(err.response?.data);
            } else if (err.response?.status === 400) {
                message.error(err.response?.data ||'Тизим хатоси');
            } else if (err.response?.status === 401) {
                message.error(err.response?.data ||'Авторизациядан утинг');
            } else if (err.response?.status === 404) {
                message.error(err.response?.data ||'Сахифа топилмади');
            } else {
                message.error(err.response?.data ||'Хатолик мавжуд');
            }
        }


    };

    const headers = {
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true',
        'Authorization':`Bearer ${auth.token}`,
        'withCredentials': true
    }

    return (
        <>

            <Space direction="vertical" size="middle" style={{ width: '100%', height:'100%', padding:"20px 40px" }}>

                <Space>

                    <Button
                        onClick={handleSave}
                        type="primary"
                    >
                        Сақлаш
                    </Button>

                    <Tag color="blue" style={{fontSize: '14px', padding:'6px 10px'}}>Роль: {props.roleData.roleId} - {(props.roleData?.roleName)}</Tag>

                </Space>

                <Card bordered='bordered' title='Модулларга тегишли амаллар'>

                    <Tree
                        checkable
                        onExpand={onExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                        onCheck={onCheck}
                        checkedKeys={checkedKeys}
                        onSelect={onSelect}
                        selectedKeys={selectedKeys}
                        treeData={treeData}
                    />

                </Card>

            </Space>
        </>
    );
};
export default AccessDocAction;
