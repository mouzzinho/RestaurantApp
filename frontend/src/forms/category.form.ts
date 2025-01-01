import * as Yup from 'yup';

export const categoryFormSchema = () => {
    return Yup.object().shape({
        image: Yup.object()
            .shape({
                name: Yup.string().required(),
                mimeType: Yup.string().required(),
                content: Yup.string().required(),
            })
            .required('Dodaj zdjęcie kategorii'),
        name: Yup.string().required('Podaj nazwę kategorii'),
    });
};
