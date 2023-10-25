import {combineReducers, configureStore} from "@reduxjs/toolkit";

import createSagaMiddleware from 'redux-saga';
import {rootSaga} from "./sagas";
import accountType from "./slices/references/accountType/accountType";
import bank from "./slices/references/bank/bank";
import bankType from "./slices/references/bankType/bankType";
import filial from "./slices/references/filial/filial";
import chart from "./slices/chart/chart";
import smetaTab from "./slices/smeta/smetaTab/smetaTab";

const sagaMiddleware = createSagaMiddleware();
const reducer = combineReducers({
    accountType,
    bank,
    bankType,
    filial,
    chart,
    smetaTab
});

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({thunk: false}).concat(sagaMiddleware)
});
sagaMiddleware.run(rootSaga);