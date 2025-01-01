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
