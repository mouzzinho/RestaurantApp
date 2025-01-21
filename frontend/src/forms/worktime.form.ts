import * as Yup from 'yup';

export const worktimeFormSchema = () => {
    return Yup.object().shape({
        date_start: Yup.string().required('Uzupełnij godzinę rozpoczęcia').nullable(),
        date_end: Yup.string().required('Uzupełnij godzinę zakończenia').nullable(),
    });
};
