import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    data: [],
    loading: false,
    error: {},
    totalItems: 0
};
const bank = createSlice({
    name: 'bank',
    initialState,
    reducers: {
        setBankData: (state, action) => {
            state.totalItems = action.payload.length;
            state.data = action.payload;
            return state;
        },
        setBankLoading: (state, action) => {
            state.loading = action.payload;
            return state;
        },
        setBankError: (state, action) => {
            state.error = action.payload;
            return state;
        }
    }
});
export const {setBankData, setBankLoading, setBankError} = bank.actions;
export default bank.reducer;