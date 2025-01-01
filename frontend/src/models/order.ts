import { IDish } from '@/models/dish';

export interface IOrder {
    id: number | string;
    order_date: string;
    tableId: number | string;
    status: number;
    dishes: IOrderDish[];
}

export interface IOrderDish extends IDish {
    quantity: number;
    preparedQuantity: number;
}

export interface IOrderDishMutation {
    dishes: {
        dishId: number;
        quantity: number;
        preparedQuantity: number;
    }[];
}

export interface IOrderMutation {
    tableId: number | string;
    status: number;
    order_date?: string;
    dishes?: IOrderDishMutation['dishes'];
}

export interface IOrderDishState {
    dish: IDish;
    quantity: number;
}
