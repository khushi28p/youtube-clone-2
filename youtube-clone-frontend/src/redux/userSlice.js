import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
    loading: false,
    error: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true,
            state.error = false;
        },
        loginSuccess: (state, action) => {
            state.loading = false,
            state.currentUser = action.payload,
            state.error = false,
            localStorage.setItem("currentUser", JSON.stringify(action.payload))
        },
        loginFailure: (state) => {
            state.loading = false,
            state.error = true,
            state.currentUser = null
        },
        logout: (state) =>{
            state.currentUser = null,
            state.loading = false,
            state.error = false,
            localStorage.removeItem("currentUser");
        },
        subscription: (state, action) => {
            if(state.currentUser.subscribedUsers.includes(action.payload)){
                state.currentUser.subscribedUsers.splice(
                    state.currentUser.subscribedUsers.findIndex(
                        (channelId) => channelId === action.payload
                    ), 1
                )
            } else{
                state.currentUser.subscribedUsers.push(action.payload);
            }
        }
    }
})

export const {loginStart, loginSuccess, loginFailure, logout, subscription} = userSlice.actions;

export default userSlice.reducer;