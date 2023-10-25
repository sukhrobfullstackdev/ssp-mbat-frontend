import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    data: [],
    loading: false,
    error: {},
    totalItems: 0
};
const smetaTab = createSlice({
    name: 'smetaTab',
    initialState,
    reducers: {
        setSmetaTabData: (state, action) => {
            state.totalItems = action.payload.length;
            state.data = action.payload;
            return state;
        },
        setSmetaTabLoading: (state, action) => {
            state.loading = action.payload;
            return state;
        },
        setSmetaTabError: (state, action) => {
            state.error = action.payload;
            return state;
        }
    }
});
export const {setSmetaTabData, setSmetaTabLoading, setSmetaTabError} = smetaTab.actions;
export default smetaTab.reducer;