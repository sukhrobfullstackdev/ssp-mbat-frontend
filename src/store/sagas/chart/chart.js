import {takeEvery, put, call} from 'redux-saga/effects';
import {CHART} from "../../types/chart/chart";
import {setChartLoading, setChartData, setChartError} from "../../slices/chart/chart";
import {makeQuery} from "../../apis";


export function* sendChartSaga({data}) {
    try {
        yield put(setChartLoading(true));
        debugger;
        const result = yield call(makeQuery, data);
        debugger;
        yield put(setChartData(result));
        yield put(setChartLoading(false));
        yield put(setChartError({}));
    } catch (e) {
        yield put(setChartError(e.response.data.error));
        yield put(setChartLoading(false));
    }
}


export function* watchChart() {
    yield takeEvery(CHART, sendChartSaga);
}