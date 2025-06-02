import { createSlice } from "@reduxjs/toolkit";

const initialState = {

};

export const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers:{

    }
})

export const {loginStart, loginSuccess, loginFailure, logout} = videoSlice.actions;

export default videoSlice.reducer;