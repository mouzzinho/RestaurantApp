import * as Yup from 'yup';

export const userAddFormSchema = () => {
    return Yup.object().shape({
        image: Yup.object()
            .shape({
                name: Yup.string().required(),
                mimeType: Yup.string().required(),
                content: Yup.string().required(),
            })
            .required('Dodaj zdjęcie pracownika'),
        name: Yup.string().required('Podaj i nazwisko pracownika'),
        email: Yup.string().email('Podaj poprawny adres email').required('Podaj email pracownika'),
        phone: Yup.string().required('Podaj numer telefonu pracownika'),
        role: Yup.string().required('Wybierz rolę pracownika'),
        username: Yup.string().required('Podaj nazwę użytkownika'),
        password: Yup.string().required('Podaj hasło użytkownika'),
    });
};

export const userUpdateFormSchema = () => {
    return Yup.object().shape({
        image: Yup.object()
            .shape({
                name: Yup.string().required(),
                mimeType: Yup.string().required(),
                content: Yup.string().required(),
            })
            .required('Dodaj zdjęcie pracownika'),
        name: Yup.string().required('Podaj i nazwisko pracownika'),
        email: Yup.string().email('Podaj poprawny adres email').required('Podaj email pracownika'),
        phone: Yup.string().required('Podaj numer telefonu pracownika'),
        role: Yup.string().required('Wybierz rolę pracownika'),
        username: Yup.string().required('Podaj nazwę użytkownika'),
    });
};

export const userChangePasswordFormSchema = () => {
    return Yup.object().shape({
        oldPassword: Yup.string().required('Podaj Twoje obence hasło'),
        newPassword: Yup.string().required('Podaj nowe hasło'),
        confirmPassword: Yup.string()
            .required('Potwiedź nowe hasło')
            .oneOf([Yup.ref('newPassword')], 'Hasło nie jest zgodne'),
    });
};
