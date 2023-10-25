import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    data: [],
    loading: false,
    error: {},
    query: {},
    totalItems: 0
};
const chart = createSlice({
    name: 'chart',
    initialState,
    reducers: {
        setChartData: (state, action) => {
            state.totalItems = action.payload.length;
            state.data = action.payload;
            return state;
        },
        setChartQuery: (state, action) => {
            state.query = action.payload;
            return state;
        },
        setChartLoading: (state, action) => {
            state.loading = action.payload;
            return state;
        },
        setChartError: (state, action) => {
            state.error = action.payload;
            return state;
        }
    }
});
export const {setChartData,setChartLoading,setChartError, setChartQuery} = chart.actions;
export default chart.reducer;
