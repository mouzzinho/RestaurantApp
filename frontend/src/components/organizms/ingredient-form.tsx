'use client';

import Link from 'next/link';
import { Form, Formik, FormikProps } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import styles from './ingredient-form.module.scss';

import DeleteIcon from '../../../public/delete.svg';
import BackIcon from '../../../public/back.svg';

import { IIngredient } from '@/models/ingredient';
import { useIngredient } from '@/hooks/use-ingredient';
import { useUser } from '@/hooks/use-user';
import { ingredientFormSchema } from '@/forms/ingredient.form';

import Button from '@/components/atoms/button';
import Input from '@/components/atoms/input';
import InputFile from '@/components/atoms/input-file';
import Select from '@/components/atoms/select';

const IngredientForm = () => {
    const router = useRouter();
    const params = useParams();
    const id = Object.keys(params).length > 0;

    const ingredientState = useIngredient('single');
    const ingredientData = ingredientState.get.data;
    const userState = useUser();
    const userData = userState.data;
    const initialValues = getInitialValues(ingredientData);
    const formRef = useRef<FormikProps<IIngredient>>(null);
    const [isEnabled, setIsEnabled] = useState(!id);

    const handleSubmit = (values: IIngredient) => {
        const body = {
            ...values,
            quantity: values.quantity && (values.unit === 'kg' || values.unit === 'l') ? values.quantity * 1000 : values.quantity,
        };

        if (ingredientData && ingredientData.id) {
            ingredientState.update
                .fetch({
                    data: body,
                    id: ingredientData.id,
                })
                .unwrap()
                .then(() => {
                    toast('Pomyślnie zaktualizowano składnik', { type: 'success' });
                    toggleEnabled();
                })
                .catch((error) => {
                    const message = error.data && error.data.error;

                    if (message) {
                        toast(message, { type: 'error' });
                    }
                });
        } else {
            ingredientState.create
                .fetch(body)
                .then((response) => {
                    if (response.data) {
                        router.replace(`/ingredients/${response.data.id}`);
                        toast('Pomyślnie dodano składnik', { type: 'success' });
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
        if (ingredientData && ingredientData.id) {
            ingredientState.deleteIngredient
                .fetch({ id: ingredientData.id })
                .unwrap()
                .then(() => {
                    router.replace(`/ingredients`);
                    toast('Pomyślnie usunięto składnik', { type: 'success' });
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
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            enableReinitialize={true}
            innerRef={formRef}
            validationSchema={ingredientFormSchema}
        >
            {() => (
                <div className={styles.container}>
                    <Link href={'/ingredients'} className={styles.link}>
                        <BackIcon className={styles.icon} /> Wróć do listy składników
                    </Link>
                    <Form className={styles.form}>
                        <InputFile className={styles.file} name={'image'} label={'Zdjęcie składnika'} isImageInput={true} isDisabled={!isEnabled} />
                        <Input
                            className={styles.name}
                            name={'name'}
                            label={'Nazwa składnika'}
                            placeholder={'Wpisz nazwę składnika'}
                            isDisabled={!isEnabled}
                        />
                        <Input
                            className={styles.quantity}
                            name={'quantity'}
                            label={'Stan magazynowy'}
                            type={'number'}
                            placeholder={'Wpisz stan magazynowy'}
                            isDisabled={!isEnabled}
                        />
                        <Button className={`${styles.button} ${!isEnabled ? styles.disabled : ''}`} type={'submit'}>
                            {id ? 'Zapisz zmiany' : 'Dodaj składnik'}
                        </Button>
                        <Button
                            className={`${styles.button} ${styles.edit} ${isEnabled ? styles.disabled : ''}`}
                            type={'button'}
                            onClick={toggleEnabled}
                        >
                            Edytuj składnik
                        </Button>
                        <Select
                            name={'unit'}
                            className={styles.unit}
                            placeholder={'Wybierz jednostkę'}
                            label={'Jednostka'}
                            isDisabled={!isEnabled}
                            options={[
                                { label: 'szt', value: 'szt', isEnabled: true },
                                { label: 'g', value: 'g', isEnabled: true },
                                { label: 'kg', value: 'kg', isEnabled: true },
                                { label: 'ml', value: 'ml', isEnabled: true },
                                { label: 'l', value: 'l', isEnabled: true },
                            ]}
                        />
                    </Form>
                    {ingredientData && userData && userData.role === 'ADMIN' && (
                        <button className={styles.delete} onClick={handleDelete} type={'button'}>
                            <DeleteIcon /> Usuń składnik
                        </button>
                    )}
                </div>
            )}
        </Formik>
    );
};

function getInitialValues(data: IIngredient | undefined) {
    function getQuantity() {
        if (data && data.quantity && data.unit) {
            if (data.unit === 'kg' || data.unit === 'l') {
                return parseFloat((data.quantity / 1000).toFixed(2));
            }
            return data.quantity;
        }
        return undefined;
    }

    return {
        image: data?.image || null,
        name: data?.name || '',
        quantity: getQuantity(),
        unit: data?.unit || '',
    };
}

export default IngredientForm;
