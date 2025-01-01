import React from 'react';
import { Field, FieldProps } from 'formik';

import styles from './input.module.scss';

interface IInputProps {
    className?: string;
    label?: string;
    placeholder?: string;
    name: string;
    type?: string;
    isDisabled?: boolean;
    minValue?: number;
    onClick?: (operation: string) => void;
}

const Input: React.FC<IInputProps> = ({ className = '', name, label, placeholder, type = 'text', isDisabled, onClick, minValue }) => {
    return (
        <>
            {type === 'quantity' && (
                <Field name={name}>
                    {({ field, meta }: FieldProps) => (
                        <div className={`${styles.container} ${className}`}>
                            {label && <p className={styles.label}>{label}</p>}
                            {!isDisabled && (
                                <button
                                    type={'button'}
                                    onClick={() => {
                                        if (onClick) {
                                            onClick('-');
                                        }
                                    }}
                                    disabled={minValue ? meta.value <= minValue : meta.value <= 1}
                                    className={styles.button}
                                >
                                    -
                                </button>
                            )}

                            <input
                                className={`${styles.input} ${meta.touched && meta.error ? styles.hasError : ''}`}
                                type={type}
                                placeholder={placeholder}
                                disabled={isDisabled}
                                {...field}
                                readOnly={true}
                            />
                            {!isDisabled && (
                                <button
                                    type={'button'}
                                    onClick={() => {
                                        if (onClick) {
                                            onClick('+');
                                        }
                                    }}
                                    className={styles.button}
                                >
                                    +
                                </button>
                            )}
                            {meta.touched && meta.error && <p className={styles.error}>{meta.error}</p>}
                        </div>
                    )}
                </Field>
            )}
            {type !== 'quantity' && (
                <Field name={name}>
                    {({ field, meta }: FieldProps) => (
                        <div className={`${styles.container} ${className}`}>
                            {label && <p className={styles.label}>{label}</p>}
                            <input
                                className={`${styles.input} ${meta.touched && meta.error ? styles.hasError : ''}`}
                                type={type}
                                placeholder={placeholder}
                                disabled={isDisabled}
                                {...field}
                            />
                            {meta.touched && meta.error && <p className={styles.error}>{meta.error}</p>}
                        </div>
                    )}
                </Field>
            )}
        </>
    );
};

export default Input;
