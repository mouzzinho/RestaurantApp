'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Formik, FormikProps } from 'formik';
import { toast } from 'react-toastify';

import styles from './dish-form.module.scss';

import DeleteIcon from '../../../public/delete.svg';
import BackIcon from '../../../public/back.svg';

import { ICategory } from '@/models/category';
import { IIngredient } from '@/models/ingredient';
import { IDish, IDishMutation } from '@/models/dish';
import { dishFormSchema } from '@/forms/dish.form';
import { useDish } from '@/hooks/use-dish';
import { useCategory } from '@/hooks/use-category';
import { useIngredient } from '@/hooks/use-ingredient';
import { useUser } from '@/hooks/use-user';

import Button from '@/components/atoms/button';
import Input from '@/components/atoms/input';
import InputFile from '@/components/atoms/input-file';
import Select from '@/components/atoms/select';
import IngredientsField from '@/components/molecules/ingredients-field';

const DishForm = () => {
    const router = useRouter();
    const params = useParams();
    const id = Object.keys(params).length > 0;
    const dishState = useDish('single');
    const categoryState = useCategory('list');
    const ingredientState = useIngredient('list');
    const userState = useUser();
    const dishData = dishState.get.data;
    const categories = getOptions(categoryState.categories.data);
    const ingredients = ingredientState.ingredients.data;
    const userData = userState.data;
    const initialValues = getInitialValues(dishData, ingredients);
    const formRef = useRef<FormikProps<IDishMutation>>(null);
    const [isEnabled, setIsEnabled] = useState(!id);

    const handleSubmit = (values: IDishMutation) => {
        if (dishData && dishData.id) {
            dishState.update
                .fetch({
                    data: values,
                    id: dishData.id,
                })
                .unwrap()
                .then(() => {
                    toast('Pomyślnie zaktualizowano danie', { type: 'success' });
                    toggleEnabled();
                })
                .catch((error) => {
                    const message = error.data && error.data.error;

                    if (message) {
                        toast(message, { type: 'error' });
                    }
                });
        } else {
            dishState.create
                .fetch(values)
                .then((response) => {
                    if (response.data) {
                        router.replace(`/dishes/${response.data.id}`);
                        toast('Pomyślnie dodano danie', { type: 'success' });
                        toggleEnabled();
                    }
                })
                .catch((error) => {
                    const message = error.data && error.data.error;

                    if (message) {
                        toast(message, { type: 'error' });
                    }
                });
        }
    };

    const handleDelete = () => {
        if (dishData && dishData.id) {
            dishState.deleteDish
                .fetch({ id: dishData.id })
                .unwrap()
                .then(() => {
                    router.replace(`/dishes`);
                    toast('Pomyślnie usunięto danie', { type: 'success' });
                })
                .catch((error) => {
                    const message = error.data && error.data.error;

                    if (message) {
                        toast(message, { type: 'error' });
                    }
                });
        }
    };

    const toggleEnabled = () => {
        setIsEnabled(!isEnabled);
    };

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize={true} innerRef={formRef} validationSchema={dishFormSchema}>
            {() => (
                <div className={styles.container}>
                    <Link href={'/dishes'} className={styles.link}>
                        <BackIcon className={styles.icon} /> Wróć do listy dań
                    </Link>
                    <Form className={styles.form}>
                        <InputFile className={styles.file} name={'image'} label={'Zdjęcie dania'} isImageInput={true} isDisabled={!isEnabled} />
                        <Input
                            className={styles.name}
                            name={'name'}
                            label={'Nazwa dania'}
                            placeholder={'Wpisz nazwę dania'}
                            isDisabled={!isEnabled}
                        />
                        <Input
                            className={styles.price}
                            name={'price'}
                            label={'Cena dania w zł'}
                            type={'number'}
                            placeholder={'Wpisz cenę dania'}
                            isDisabled={!isEnabled}
                        />
                        <Select
                            className={styles.categories}
                            name={'categories'}
                            label={'Kategorie'}
                            isMulti={true}
                            options={categories}
                            isDisabled={!isEnabled}
                        />
                        <IngredientsField ingredients={ingredientState.ingredients.data} isEnabled={isEnabled} />
                        <Button className={`${styles.button} ${!isEnabled ? styles.disabled : ''}`} type={'submit'}>
                            {id ? 'Zapisz zmiany' : 'Dodaj danie'}
                        </Button>
                        <Button
                            className={`${styles.button} ${styles.edit} ${isEnabled ? styles.disabled : ''}`}
                            type={'button'}
                            onClick={toggleEnabled}
                        >
                            Edytuj danie
                        </Button>
                    </Form>
                    {dishData && userData && userData.role === 'ADMIN' && (
                        <button className={styles.delete} onClick={handleDelete} type={'button'}>
                            <DeleteIcon /> Usuń danie
                        </button>
                    )}
                </div>
            )}
        </Formik>
    );
};

function getInitialValues(data: IDish | undefined, ingredients: IIngredient[] | undefined) {
    const ingredientsValues =
        (data &&
            ingredients &&
            data.ingredients &&
            data.ingredients.map((ingredient) => {
                return {
                    id: ingredient.id,
                    quantity: ingredient.quantity,
                    unit: ingredient.unit,
                };
            })) ||
        [];

    const categories = data?.categories.map((category) => category.id.toString()) || [];

    return {
        image: data?.image || null,
        name: data?.name || '',
        price: data?.price || '',
        ingredients: ingredientsValues,
        categories: categories,
    };
}

export function getOptions(list: ICategory[] | IIngredient[] | undefined) {
    if (list) {
        return list.map((item) => {
            return {
                label: item.name,
                value: item.id?.toString() || '',
                isEnabled: true,
            };
        });
    }
    return [];
}

export default DishForm;
