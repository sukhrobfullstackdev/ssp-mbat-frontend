import {takeEvery, put, call} from 'redux-saga/effects';
import {makeQuery} from "../../../apis";
import {setChartQuery} from "../../../slices/chart/chart";
import {SMETA_TAB} from "../../../types/smeta/smetaTab/smetaTab";
import {setSmetaTabData, setSmetaTabLoading, setSmetaTabError} from "../../../slices/smeta/smetaTab/smetaTab";


export function* sendSmetaTabSaga({dataTab}) {
    try {
        yield put(setSmetaTabLoading(true));
        debugger;
        const result = yield call(makeQuery, dataTab);
        debugger;
        yield put(setSmetaTabData(result));
        yield put(setChartQuery(dataTab));
        yield put(setSmetaTabLoading(false));
        yield put(setSmetaTabError({}));
    } catch (e) {
        yield put(setSmetaTabError(e.response.data.error));
        yield put(setSmetaTabLoading(false));
    }
}


export function* watchSmetaTab() {
    yield takeEvery(SMETA_TAB, sendSmetaTabSaga);
}