import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    data: [],
    loading: false,
    error: {},
    totalItems: 0
};
const filial = createSlice({
    name: 'filial',
    initialState,
    reducers: {
        setFilialData: (state, action) => {
            state.totalItems = action.payload.length;
            state.data = action.payload;
            return state;
        },
        setFilialLoading: (state, action) => {
            state.loading = action.payload;
            return state;
        },
        setFilialError: (state, action) => {
            state.error = action.payload;
            return state;
        }
    }
});
export const {setFilialData, setFilialLoading, setFilialError} = filial.actions;
export default filial.reducer;