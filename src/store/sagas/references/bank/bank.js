import {takeEvery, put, call} from 'redux-saga/effects';
import {setBankData,setBankError,setBankLoading} from "../../../slices/references/bank/bank";
import {makeQuery} from "../../../apis";
import {BANK} from "../../../types/references/bank/bank";
import {setChartQuery} from "../../../slices/chart/chart";


export function* sendBankSaga({dataBankRef}) {
    try {
        yield put(setBankLoading(true));
        const result = yield call(makeQuery, dataBankRef);
        yield put(setBankData(result));
        yield put(setChartQuery(dataBankRef));
        yield put(setBankLoading(false));
        yield put(setBankError({}));
    } catch (e) {
        yield put(setBankError(e.response.data.error));
        yield put(setBankLoading(false));
    }
}


export function* watchBank() {
    yield takeEvery(BANK, sendBankSaga);
}