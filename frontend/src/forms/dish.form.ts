import * as Yup from 'yup';

export const dishFormSchema = () => {
    return Yup.object().shape({
        image: Yup.object()
            .shape({
                name: Yup.string().required(),
                mimeType: Yup.string().required(),
                content: Yup.string().required(),
            })
            .required('Dodaj zdjęcie dania'),
        name: Yup.string().required('Podaj nazwę dania'),
        price: Yup.number().required('Podaj cenę dania'),
        ingredients: Yup.array()
            .of(
                Yup.object().shape({
                    id: Yup.number().required('Wybierz składnik'),
                    quantity: Yup.number().required('Podaj ilość składnika'),
                }),
            )
            .min(1, 'Dodaj wymagane składniki'),
        categories: Yup.array().of(Yup.number().required()).min(1, 'Wybierz kategorię dania'),
    });
};
