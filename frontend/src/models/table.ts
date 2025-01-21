import { IOrder } from '@/models/order';

export type TTableStatus = 'empty' | 'new' | 'ordered' | 'prepared' | 'busy' | 'dirty';

export interface ITable extends ITableMutation {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface ITableWithOrder extends ITable {
    order: IOrder;
}

export interface ITableMutation {
    name: string;
    user_name: string | null;
    status: TTableStatus;
    order?: IOrder;
}
