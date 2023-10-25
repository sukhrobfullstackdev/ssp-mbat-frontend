import {takeEvery, put, call} from 'redux-saga/effects';
import {setBankTypeData, setBankTypeError, setBankTypeLoading} from "../../../slices/references/bankType/bankType";
import {makeQuery} from "../../../apis";
import {BANK_TYPE} from "../../../types/references/bankType/bankType";
import {setChartQuery} from "../../../slices/chart/chart";


export function* sendBankTypeSaga({dataBankTypeRef}) {
    try {
        yield put(setBankTypeLoading(true));
        const result = yield call(makeQuery, dataBankTypeRef);
        yield put(setBankTypeData(result));
        yield put(setChartQuery(dataBankTypeRef));
        yield put(setBankTypeLoading(false));
        yield put(setBankTypeError({}));
    } catch (e) {
        yield put(setBankTypeError(e.response.data.error));
        yield put(setBankTypeLoading(false));
    }
}


export function* watchBankType() {
    yield takeEvery(BANK_TYPE, sendBankTypeSaga);
}