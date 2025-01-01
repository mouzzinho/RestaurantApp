import { IOption } from '../models/option.model';

export function getSelectValue(formikValue: string | string[] | number[] | number, options: IOption[], isMulti: boolean): IOption | IOption[] | null {
    if (!formikValue && formikValue !== 0) return null;
    if (isMulti && Array.isArray(formikValue)) {
        return options.filter((option) => formikValue.includes(option.value.toString() as never));
    }
    return options.find((option) => option.value.toString() === formikValue.toString()) || null;
}
