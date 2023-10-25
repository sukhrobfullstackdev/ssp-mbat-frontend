import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    data: [],
    loading: false,
    error: {},
    totalItems: 0
};
const accountType = createSlice({
    name: 'accountType',
    initialState,
    reducers: {
        setAccountTypeData: (state, action) => {
            state.totalItems = action.payload.length;
            state.data = action.payload;
            return state;
        },
        setAccountTypeLoading: (state, action) => {
            state.loading = action.payload;
            return state;
        },
        setAccountTypeError: (state, action) => {
            state.error = action.payload;
            return state;
        }
    }
});
export const {setAccountTypeData,setAccountTypeLoading,setAccountTypeError} = accountType.actions;
export default accountType.reducer;
