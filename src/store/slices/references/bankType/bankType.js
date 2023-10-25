import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    data: [],
    loading: false,
    error: {},
    totalItems: 0
};
const bankType = createSlice({
    name: 'bankType',
    initialState,
    reducers: {
        setBankTypeData: (state, action) => {
            state.totalItems = action.payload.length;
            state.data = action.payload;
            return state;
        },
        setBankTypeLoading: (state, action) => {
            state.loading = action.payload;
            return state;
        },
        setBankTypeError: (state, action) => {
            state.error = action.payload;
            return state;
        }
    }
});
export const {setBankTypeData, setBankTypeLoading, setBankTypeError} = bankType.actions;
export default bankType.reducer;