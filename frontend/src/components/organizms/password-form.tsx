'use client';

import { Form, Formik, FormikProps } from 'formik';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import styles from './password-form.module.scss';

import { useUser } from '@/hooks/use-user';
import { userChangePasswordFormSchema } from '@/forms/user.form';

import Button from '@/components/atoms/button';
import Input from '@/components/atoms/input';

const initialValues = { oldPassword: '', newPassword: '', confirmPassword: '' };

export interface IPasswordChangeValues {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const PasswordForm = () => {
    const userState = useUser();
    const userData = userState.data;
    const formRef = useRef<FormikProps<IPasswordChangeValues>>(null);
    const [isEnabled, setIsEnabled] = useState(false);

    const handleSubmit = (values: IPasswordChangeValues) => {
        if (userData) {
            userState.changePassword
                .fetch(values)
                .unwrap()
                .then(() => {
                    toast('Pomyślnie zmieniono hasło', { type: 'success' });
                    toggleEnabled();
                    formRef.current?.resetForm();
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
            validationSchema={userChangePasswordFormSchema}
        >
            {() => (
                <Form className={styles.form}>
                    <p className={styles.title}>Zmień hasło</p>
                    <Input
                        className={styles.input}
                        name={'oldPassword'}
                        label={'Stare hasło'}
                        placeholder={'Wpisz...'}
                        isDisabled={!isEnabled}
                        type={'password'}
                    />
                    <Input
                        className={styles.input}
                        name={'newPassword'}
                        label={'Nowe hasło'}
                        placeholder={'Wpisz...'}
                        isDisabled={!isEnabled}
                        type={'password'}
                    />
                    <Input
                        className={styles.input}
                        name={'confirmPassword'}
                        label={'Powtórz hasło'}
                        placeholder={'Wpisz...'}
                        isDisabled={!isEnabled}
                        type={'password'}
                    />
                    <Button className={`${styles.button} ${!isEnabled ? styles.disabled : ''}`} type={'submit'}>
                        Zmień hasło
                    </Button>
                    <Button className={`${styles.button} ${styles.edit} ${isEnabled ? styles.disabled : ''}`} type={'button'} onClick={toggleEnabled}>
                        Zmień hasło
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default PasswordForm;
