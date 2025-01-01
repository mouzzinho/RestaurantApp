import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import restaurantApi from './api';
import { listener } from './listener';
import userSlice from './slices/user.slice';
import orderSlice from '@/redux/slices/order.slice';

export const store = configureStore({
    reducer: {
        [restaurantApi.reducerPath]: restaurantApi.reducer,
        user: userSlice,
        order: orderSlice,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({}).concat(restaurantApi.middleware).prepend(listener.middleware);
    },
});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
