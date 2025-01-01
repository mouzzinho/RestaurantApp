import React from 'react';
import { Form, Formik } from 'formik';

import styles from './search-bar.module.scss';

import Input from '@/components/atoms/input';
import HandleFormikChange from '@/components/hoc/handle-formik-change';

interface ISearchBarProps {
    onChange: (values: { search: string }) => void;
    label: string;
    className?: string;
}

const SearchBar: React.FC<ISearchBarProps> = ({ className = '', onChange, label }) => {
    return (
        <Formik initialValues={{ search: '' }} onSubmit={() => {}}>
            {() => (
                <Form className={`${className} ${styles.container}`}>
                    <HandleFormikChange onChange={onChange} />
                    <Input name={'search'} className={styles.input} label={label} placeholder={'Szukaj...'} />
                </Form>
            )}
        </Formik>
    );
};

export default SearchBar;
