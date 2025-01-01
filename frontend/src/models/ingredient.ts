import { IImage } from '@/models/image';

export interface IIngredient {
    id?: number;
    name: string;
    image: IImage | null;
    quantity: number | undefined;
    unit: string;
}
