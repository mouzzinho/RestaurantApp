import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { IOrderDishState } from '@/models/order';

export interface IOrderState {
    orderDate: string;
    tableId: string | number;
    status: number;
    dishes: IOrderDishState[];
}

const initialState: IOrderState = {
    orderDate: '',
    tableId: '',
    status: 1,
    dishes: [],
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrderDishes: (state, { payload }: PayloadAction<IOrderDishState[]>) => {
            state.dishes = payload;
        },
    },
});

export default orderSlice.reducer;

export const { setOrderDishes } = orderSlice.actions;

export const selectOrderState = (state: RootState) => state.order;
