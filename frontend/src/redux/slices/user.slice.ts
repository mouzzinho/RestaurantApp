import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { userApi } from '../api/user';
import { IUser } from '@/models/user';
import { RootState } from '../store';

export interface IUserState {
    data: IUser | null;
}

const initialState: IUserState = {
    data: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(isAnyOf(userApi.endpoints.loginUser.matchFulfilled), (state, action) => {
            const { payload } = action;
            if (payload.token && payload.expireAt) {
                localStorage.setItem('tokenData', JSON.stringify(payload));
                window.location.pathname = '/';
            }
        });
        builder.addMatcher(isAnyOf(userApi.endpoints.getUserAuth.matchFulfilled), (state, action) => {
            const { payload } = action;
            if (payload) {
                state.data = payload;
            }
        });
        builder.addMatcher(isAnyOf(userApi.endpoints.logoutUser.matchFulfilled), () => {
            localStorage.removeItem('tokenData');
            window.location.pathname = '/login';
        });
    },
});

export default userSlice.reducer;

export const selectUserState = (state: RootState) => state.user;
