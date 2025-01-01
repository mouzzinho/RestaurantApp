import * as Yup from 'yup';

export const loginFormInitialValues = {
    username: '',
    password: '',
};

export const loginFormSchema = () => {
    return Yup.object().shape({
        username: Yup.string().required('Proszę wprowadzić login'),
        password: Yup.string().required('Prowszę wprowadzić hasło'),
    });
};

export type TLoginFormValues = typeof loginFormInitialValues;
