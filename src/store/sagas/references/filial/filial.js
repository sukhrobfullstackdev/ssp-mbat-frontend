import {takeEvery, put, call} from 'redux-saga/effects';
import {setFilialData, setFilialError, setFilialLoading} from "../../../slices/references/filial/filial";
import {makeQuery} from "../../../apis";
import {FILIAL} from "../../../types/references/filial/filial";
import {setChartQuery} from "../../../slices/chart/chart";


export function* sendFilialSaga({dataFilialRef}) {
    try {
        yield put(setFilialLoading(true));
        const result = yield call(makeQuery, dataFilialRef);
        yield put(setFilialData(result));
        yield put(setChartQuery(dataFilialRef));
        yield put(setFilialLoading(false));
        yield put(setFilialError({}));
    } catch (e) {
        yield put(setFilialError(e.response.data.error));
        yield put(setFilialLoading(false));
    }
}


export function* watchFilialType() {
    yield takeEvery(FILIAL, sendFilialSaga);
}