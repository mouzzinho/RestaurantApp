import { IImage } from '@/models/image';
import { ICategory } from '@/models/category';

export interface IDish {
    id: number;
    name: string;
    image: IImage;
    price: number;
    isAvailable: boolean;
    preparedQuantity: number;
    categories: IDishCategory[];
    ingredients: IDishIngredient[];
}

export interface IDishMutation {
    id?: number | undefined;
    name: string;
    image: IImage | null;
    price: number | string;
    categories: string[];
    ingredients: IDishIngredient[];
}

export interface IDishCategory extends ICategory {
    id: number;
}

export interface IDishIngredient {
    id: number | string;
    quantity: number | string;
    unit: string;
}
