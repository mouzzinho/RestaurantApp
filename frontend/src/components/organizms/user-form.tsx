'use client';

import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Formik, FormikProps } from 'formik';
import { toast } from 'react-toastify';

import styles from './user-form.module.scss';

import DeleteIcon from '../../../public/delete.svg';
import BackIcon from '../../../public/back.svg';

import { IUser } from '@/models/user';
import { useUser } from '@/hooks/use-user';
import { userAddFormSchema, userUpdateFormSchema } from '@/forms/user.form';

import Button from '@/components/atoms/button';
import Input from '@/components/atoms/input';
import InputFile from '@/components/atoms/input-file';
import Select from '@/components/atoms/select';

interface IUserForm {
    isDashboard?: boolean;
    className?: string;
}

const UserForm: React.FC<IUserForm> = ({ isDashboard, className }) => {
    const router = useRouter();
    const params = useParams();
    const isEditMode = Object.keys(params).length > 0 || isDashboard;

    const userState = useUser('single');
    const workerData = userState.get.data;
    const userData = userState.data;

    const initialValues = getInitialValues(isDashboard ? userData : workerData, isEditMode);
    const formRef = useRef<FormikProps<IUser>>(null);
    const [isEnabled, setIsEnabled] = useState(!isEditMode);

    const handleSubmit = (values: IUser) => {
        const workerId = workerData && workerData.id;
        const userId = userData && userData.id;

        if (workerId) {
            userState.update
                .fetch({
                    data: values,
                    id: workerId,
                })
                .unwrap()
                .then(() => {
                    toast('Pomyślnie zaktualizowano pracownika', { type: 'success' });
                    toggleEnabled();
                })
                .catch((error) => {
                    const message = error.data && error.data.error;

                    if (message) {
                        toast(message, { type: 'error' });
                    }
                });
        } else if (userId && isDashboard) {
            userState.update
                .fetch({
                    data: values,
                    id: userId,
                })
                .unwrap()
                .then(() => {
                    toast('Pomyślnie zaktualizowano Twoje dane', { type: 'success' });
                    toggleEnabled();
                })
                .catch((error) => {
                    const message = error.data && error.data.error;

                    if (message) {
                        toast(message, { type: 'error' });
                    }
                });
        } else {
            userState.create
                .fetch(values)
                .then((response) => {
                    if (response.data) {
                        router.replace(`/users/${response.data.id}`);
                        toast('Pomyślnie dodano pracownika', { type: 'success' });
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
        if (workerData && workerData.id) {
            userState.deleteUser
                .fetch({ id: workerData.id })
                .unwrap()
                .then(() => {
                    router.replace(`/users`);
                    toast('Pomyślnie usunięto pracownika', { type: 'success' });
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
            validationSchema={isEditMode ? userUpdateFormSchema : userAddFormSchema}
        >
            {() => (
                <div className={`${className} ${styles.container}`}>
                    {!isDashboard && (
                        <Link href={'/users'} className={styles.link}>
                            <BackIcon className={styles.icon} /> Wróć do listy pracowników
                        </Link>
                    )}
                    <Button
                        as={'link'}
                        to={`/users/worktime?id=${workerData ? workerData?.id : userData && userData.id ? userData.id : ''}`}
                        className={styles.worktime}
                    >
                        Zobacz grafik
                    </Button>
                    <Form className={styles.form}>
                        <InputFile
                            className={`${styles.input} ${styles.file}`}
                            name={'image'}
                            label={'Zdjęcie'}
                            isImageInput={true}
                            isDisabled={!isEnabled}
                        />
                        <div className={styles.inputs}>
                            {isDashboard && (
                                <Input
                                    className={styles.input}
                                    name={'username'}
                                    label={'Nazwa użytkownika'}
                                    placeholder={'Wpisz...'}
                                    isDisabled={!isEnabled}
                                />
                            )}
                            <Input
                                className={styles.input}
                                name={'name'}
                                label={'Imię i nazwisko'}
                                placeholder={'Wpisz...'}
                                isDisabled={!isEnabled}
                            />
                            {!isDashboard && (
                                <Select
                                    className={styles.input}
                                    label={'Rola'}
                                    name={'role'}
                                    isDisabled={!isEnabled}
                                    options={[
                                        { label: 'Admin', value: 'ADMIN', isEnabled: true },
                                        { label: 'User', value: 'USER', isEnabled: true },
                                    ]}
                                />
                            )}
                        </div>
                        <Input
                            className={styles.input}
                            name={'email'}
                            label={'Email'}
                            placeholder={'Wpisz...'}
                            isDisabled={!isEnabled}
                            type={'email'}
                        />
                        <Input
                            className={styles.input}
                            name={'phone'}
                            label={'Numer telefonu'}
                            placeholder={'Wpisz...'}
                            type={'phone'}
                            isDisabled={!isEnabled}
                        />
                        {!isDashboard && (
                            <Input
                                className={styles.input}
                                name={'username'}
                                label={'Nazwa użytkownika'}
                                placeholder={'Wpisz...'}
                                isDisabled={!isEnabled}
                            />
                        )}
                        {!isEditMode && (
                            <Input
                                className={styles.input}
                                name={'password'}
                                type={'password'}
                                label={'Hasło'}
                                placeholder={'Wpisz...'}
                                isDisabled={!isEnabled}
                            />
                        )}
                        <div className={styles.buttonContainer}>
                            <Button className={`${styles.button} ${!isEnabled ? styles.disabled : ''}`} type={'submit'}>
                                {isEditMode ? 'Zapisz zmiany' : isDashboard ? 'Zapisz' : 'Dodaj pracownika'}
                            </Button>
                            <Button
                                className={`${styles.button} ${styles.edit} ${isEnabled ? styles.disabled : ''}`}
                                type={'button'}
                                onClick={toggleEnabled}
                            >
                                {isDashboard ? 'Edytuj swoje dane' : 'Edytuj pracownika'}
                            </Button>
                        </div>
                    </Form>
                    {workerData &&
                        userData &&
                        userData.role === 'ADMIN' &&
                        userData &&
                        userData.id &&
                        workerData.id !== userData.id &&
                        workerData.id !== 1 && (
                            <button className={styles.delete} onClick={handleDelete} type={'button'}>
                                <DeleteIcon /> Usuń pracownika
                            </button>
                        )}
                </div>
            )}
        </Formik>
    );
};

function getInitialValues(data: IUser | null | undefined, isEditMode?: boolean) {
    if (isEditMode && data) {
        return {
            image: data.image,
            name: data.name,
            username: data.username,
            email: data.email,
            phone: data.phone,
            role: data.role,
        };
    }

    return {
        image: null,
        name: '',
        username: '',
        email: '',
        phone: '',
        role: 'USER',
        password: '',
    };
}

export default UserForm;
