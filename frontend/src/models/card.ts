import { IImage } from '@/models/image';

export interface ICard {
    name: string;
    image: IImage | null;
    quantity?: number;
    price?: number;
    unit?: string;
    id?: number;
    isAvailable?: boolean;
}
