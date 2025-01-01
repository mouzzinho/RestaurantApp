import { IImage } from '@/models/image';

export interface ICategory {
    id?: number;
    name: string;
    image: IImage | null;
}
