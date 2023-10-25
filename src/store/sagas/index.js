import {all} from 'redux-saga/effects';
import {watchAccountType} from "./references/accountType/accountType";
import {watchBank} from "./references/bank/bank";
import {watchBankType} from "./references/bankType/bankType";
import {watchFilialType} from "./references/filial/filial";
import {watchChart} from "./chart/chart";
import {watchSmetaTab} from "./smeta/smetaTab/smetaTab";

export function* rootSaga() {
    yield all([
        watchAccountType(),
        watchBank(),
        watchBankType(),
        watchFilialType(),
        watchChart(),
        watchSmetaTab()
    ])
}