import {takeEvery, put, call} from 'redux-saga/effects';
import {setAccountTypeLoading,setAccountTypeData,setAccountTypeError} from "../../../slices/references/accountType/accountType";
import {makeQuery} from "../../../apis";
import {ACCOUNT_TYPE} from "../../../types/references/accountType/accountType";
import {setChartQuery} from "../../../slices/chart/chart";


export function* sendAccountTypeSaga({dataAccountRef}) {
    try {
        yield put(setAccountTypeLoading(true));
        const result = yield call(makeQuery, dataAccountRef);
        yield put(setAccountTypeData(result));
        yield put(setChartQuery(dataAccountRef));
        yield put(setAccountTypeLoading(false));
        yield put(setAccountTypeError({}));
    } catch (e) {
        yield put(setAccountTypeError(e.response.data.error));
        yield put(setAccountTypeLoading(false));
    }
}


export function* watchAccountType() {
    yield takeEvery(ACCOUNT_TYPE, sendAccountTypeSaga);
}