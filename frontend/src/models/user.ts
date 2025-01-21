import { IImage } from '@/models/image';

export interface IUser {
    id?: number;
    image: IImage | null;
    name: string;
    email: string;
    phone: string;
    role: 'ADMIN' | 'USER' | string;
    username: string;
    password?: string;
    token?: string;
    expirationDate?: string;
}

export interface IUserWorktime {
    id?: number | string;
    user_id: number | string;
    date_start: number;
    date_end: number;
}
