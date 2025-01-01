import React from 'react';
import { ErrorMessage } from 'formik';

import styles from './error.module.scss';

export interface IErrorProps {
    className?: string;
    name: string;
}

const Error: React.FC<IErrorProps> = ({ className = '', name }) => {
    return <ErrorMessage className={`${className} ${styles.container} error-message`} name={name} component="p" />;
};

export default Error;
