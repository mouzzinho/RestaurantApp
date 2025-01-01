'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { Form, Formik, FormikProps } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import styles from './category-form.module.scss';

import DeleteIcon from '../../../public/delete.svg';
import BackIcon from '../../../public/back.svg';

import { ICategory } from '@/models/category';
import { useCategory } from '@/hooks/use-category';
import { useUser } from '@/hooks/use-user';
import { categoryFormSchema } from '@/forms/category.form';

import Button from '@/components/atoms/button';
import Input from '@/components/atoms/input';
import InputFile from '@/components/atoms/input-file';

const CategoryForm = () => {
    const router = useRouter();
    const params = useParams();
    const id = Object.keys(params).length > 0;

    const categoryState = useCategory('single');
    const categoryData = categoryState.get.data;
    const userState = useUser();
    const userData = userState.data;
    const initialValues = getInitialValues(categoryData);
    const formRef = useRef<FormikProps<ICategory>>(null);
    const [isEnabled, setIsEnabled] = useState(!id);

    const handleSubmit = (values: ICategory) => {
        if (categoryData && categoryData.id) {
            categoryState.update
                .fetch({
                    data: values,
                    id: categoryData.id,
                })
                .unwrap()
                .then(() => {
                    toast('Pomyślnie zaktualizowano kategorię', { type: 'success' });
                    toggleEnabled();
                })
                .catch((error) => {
                    const message = error.data && error.data.error;

                    if (message) {
                        toast(message, { type: 'error' });
                    }
                });
        } else {
            categoryState.create
                .fetch(values)
                .then((response) => {
                    if (response.data) {
                        router.replace(`/categories/${response.data.id}`);
                        toast('Pomyślnie dodano kategorię', { type: 'success' });
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
        if (categoryData && categoryData.id) {
            categoryState.deleteCategory
                .fetch({ id: categoryData.id })
                .unwrap()
                .then(() => {
                    router.replace(`/categories`);
                    toast('Pomyślnie usunięto kategorię', { type: 'success' });
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
            validationSchema={categoryFormSchema}
        >
            {() => (
                <div className={styles.container}>
                    <Link href={'/categories'} className={styles.link}>
                        <BackIcon className={styles.icon} /> Wróć do listy kategorii
                    </Link>
                    <Form className={styles.form}>
                        <InputFile className={styles.file} name={'image'} label={'Zdjęcie kategorii'} isImageInput={true} isDisabled={!isEnabled} />
                        <Input
                            className={styles.name}
                            name={'name'}
                            label={'Nazwa kategorii'}
                            placeholder={'Wpisz nazwę kategorii'}
                            isDisabled={!isEnabled}
                        />
                        <Button className={`${styles.button} ${!isEnabled ? styles.disabled : ''}`} type={'submit'}>
                            {id ? 'Zapisz zmiany' : 'Dodaj kategorię'}
                        </Button>
                        <Button
                            className={`${styles.button} ${styles.edit} ${isEnabled ? styles.disabled : ''}`}
                            type={'button'}
                            onClick={toggleEnabled}
                        >
                            Edytuj kategorię
                        </Button>
                    </Form>
                    {categoryData && userData && userData.role === 'ADMIN' && (
                        <button className={styles.delete} onClick={handleDelete} type={'button'}>
                            <DeleteIcon /> Usuń kategorię
                        </button>
                    )}
                </div>
            )}
        </Formik>
    );
};

function getInitialValues(data: ICategory | undefined) {
    return {
        image: data?.image || null,
        name: data?.name || '',
    };
}

export default CategoryForm;
