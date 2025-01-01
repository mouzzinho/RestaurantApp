import React from 'react';
import { FieldArray, useField } from 'formik';

import styles from './ingredients-field.module.scss';

import DeleteIcon from '../../../public/delete.svg';

import { IIngredient } from '@/models/ingredient';
import { IDishIngredient } from '@/models/dish';
import { getOptions } from '@/components/organizms/dish-form';

import Input from '@/components/atoms/input';
import Select from '@/components/atoms/select';

interface IIngredientsFieldProps {
    className?: string;
    ingredients: IIngredient[] | undefined;
    isEnabled?: boolean;
}

const initialValues: IDishIngredient = {
    id: '',
    quantity: '',
    unit: '',
};

const IngredientsField: React.FC<IIngredientsFieldProps> = ({ className = '', ingredients, isEnabled }) => {
    const [, meta, helpers] = useField<IDishIngredient[]>('ingredients');
    const ingredientOptions = getOptions(ingredients);

    const addIngredient = () => {
        helpers.setValue([...meta.value, initialValues]);
    };

    const removeIngredient = (id: string | number) => {
        helpers.setValue([...meta.value.filter((item) => item.id.toString() !== id)]);
    };

    return (
        <FieldArray name={'ingredients'}>
            {({ name }) => {
                return (
                    <>
                        <button
                            className={`${styles.button} ${!isEnabled ? styles.disabled : ''} ingredient-button`}
                            onClick={addIngredient}
                            type={'button'}
                        >
                            Dodaj składnik
                        </button>
                        <div className={`${className} ${styles.container}`}>
                            {ingredientOptions &&
                                meta.value.map((item, i) => {
                                    const unit = ingredients?.find(
                                        (ingredient) => ingredient.id && ingredient.id.toString() === item.id?.toString(),
                                    )?.unit;
                                    const availableUnits = getAvailableUnitsOptions(unit);

                                    return (
                                        <div className={`${className} ${styles.row}`} key={`ingredient-row-${i}`}>
                                            <Select
                                                className={styles.ingredient}
                                                name={`${name}.${i}.id`}
                                                label={'Składnik'}
                                                placeholder={'Wybierz...'}
                                                options={ingredientOptions}
                                                isDisabled={!isEnabled}
                                                isSearchable={true}
                                            />
                                            <Input
                                                className={styles.quantity}
                                                name={`${name}.${i}.quantity`}
                                                label={'Ilość'}
                                                placeholder={'Wpisz...'}
                                                isDisabled={!isEnabled}
                                            />
                                            <Select
                                                className={styles.unit}
                                                name={`${name}.${i}.unit`}
                                                options={availableUnits}
                                                label={'Jednostka'}
                                                isDisabled={!isEnabled}
                                            />
                                            <button
                                                type={'button'}
                                                className={styles.delete}
                                                onClick={() => {
                                                    removeIngredient(item.id);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    );
                                })}
                        </div>
                    </>
                );
            }}
        </FieldArray>
    );
};

function getAvailableUnitsOptions(unit: string | undefined) {
    if (unit === 'kg' || unit === 'g') {
        return [
            { label: 'kg', value: 'kg', isEnabled: true },
            { label: 'g', value: 'g', isEnabled: true },
        ];
    } else if (unit === 'l' || unit === 'ml') {
        return [
            { label: 'l', value: 'l', isEnabled: true },
            { label: 'ml', value: 'ml', isEnabled: true },
        ];
    } else if (unit === 'szt') {
        return [{ label: 'szt', value: 'szt', isEnabled: true }];
    }
    return [];
}

export default IngredientsField;
