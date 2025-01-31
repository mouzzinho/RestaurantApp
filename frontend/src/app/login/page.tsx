'use client';

import React, { useRef } from 'react';
import { Form, Formik, FormikProps } from 'formik';

import styles from './page.module.scss';

import { loginFormInitialValues, loginFormSchema, TLoginFormValues } from '@/forms/login.form';
import { useUser } from '@/hooks/use-user';

import { toast } from 'react-toastify';
import Input from '@/components/atoms/input';
import Button from '@/components/atoms/button';

const Page = () => {
    const formikRef = useRef<FormikProps<TLoginFormValues> | null>(null);

    const userState = useUser();

    const handleSubmit = (values: TLoginFormValues) => {
        userState.login
            .fetch(values)
            .unwrap()
            .catch((error) => {
                if (error.data.error) {
                    toast(error.data.error, { type: 'error' });
                }
            });
    };

    return (
        <div className={styles.container}>
            <h1>Panel logowania</h1>
            <Formik initialValues={loginFormInitialValues} onSubmit={handleSubmit} innerRef={formikRef} validationSchema={loginFormSchema}>
                {({}) => (
                    <Form className={styles.form}>
                        <Input name={'username'} label={'Login'} placeholder={'Wpisz login...'} />
                        <Input name={'password'} label={'Hasło'} type={'password'} placeholder={'Wpisz hasło...'} />
                        <Button type={'submit'} isLoading={userState.login.isLoading}>
                            Zaloguj się
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Page;
