import * as Yup from 'yup';

export const ingredientFormSchema = () => {
    return Yup.object().shape({
        image: Yup.object()
            .shape({
                name: Yup.string().required(),
                mimeType: Yup.string().required(),
                content: Yup.string().required(),
            })
            .required('Dodaj zdjęcie składnika'),
        name: Yup.string().required('Podaj nazwę składnika'),
        quantity: Yup.number().required('Podaj stan magazynowy'),
        unit: Yup.string().required('Wybierz jednostkę'),
    });
};
