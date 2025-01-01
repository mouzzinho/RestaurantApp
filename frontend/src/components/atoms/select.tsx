'use client';

import React, { useId } from 'react';
import ReactSelect, { ActionMeta, OnChangeValue, MultiValue } from 'react-select';
import { useField } from 'formik';

import styles from './select.module.scss';

import { IOption } from '@/models/option.model';
import { getSelectValue } from '@/utils/get-select-value';

interface ISelectProps {
    className?: string;
    label?: string;
    name: string;
    options: IOption[];
    isMulti?: boolean;
    placeholder?: string;
    isSearchable?: boolean;
    isClearable?: boolean;
    icon?: React.SVGFactory;
    closeMenuOnSelect?: boolean;
    isDisabled?: boolean;
    hideSelectedOptions?: boolean;
    imageWithLabel?: boolean;
}

const Select: React.FC<ISelectProps> = ({
    className = '',
    name,
    options,
    label,
    placeholder,
    icon,
    closeMenuOnSelect,
    isMulti = false,
    isSearchable = false,
    isClearable = false,
    isDisabled = false,
    hideSelectedOptions = false,
}) => {
    const [, meta, helpers] = useField(name);
    const hasError = !!(meta.error && meta.touched);
    const Icon = icon;

    const handleChange = (option: OnChangeValue<IOption, typeof isMulti> | null, actionMeta: ActionMeta<IOption>) => {
        const { action } = actionMeta;
        if (action === 'clear') {
            const newValue = isMulti ? [] : '';
            helpers.setValue(newValue);
            return;
        }
        if (action === 'select-option' && option) {
            const newValue = assertIsMultiValue(option) ? option.map(({ value }) => value) : option.value;
            helpers.setValue(newValue);
            return;
        }
        if ((action === 'remove-value' || action === 'deselect-option') && assertIsMultiValue(option)) {
            const newValue = option.map(({ value }) => value);
            helpers.setValue(newValue);
            return;
        }
    };

    return (
        <div
            className={`
            ${styles.container} 
            ${className} 
            ${isDisabled ? styles.disabled : ''}
            ${hasError ? styles.error : ''}`}
        >
            {label && <p className={styles.label}>{label}</p>}
            <div className={`${styles.selectBox} ${icon ? styles.hasIcon : ''} select__container`}>
                {Icon && (
                    <div className={`${styles.iconBox} select__icon-box`}>
                        <Icon className={`${styles.iconSvg} select__icon`} />
                    </div>
                )}
                <ReactSelect
                    className={`${styles.select} select__select`}
                    options={options}
                    classNamePrefix="react-select"
                    onChange={handleChange}
                    value={getSelectValue(meta.value, options, isMulti)}
                    isClearable={isClearable}
                    isMulti={isMulti}
                    isDisabled={isDisabled}
                    placeholder={placeholder}
                    hideSelectedOptions={hideSelectedOptions}
                    isSearchable={isSearchable}
                    closeMenuOnSelect={closeMenuOnSelect}
                    noOptionsMessage={() => 'Brak opcji'}
                    instanceId={useId()}
                    isOptionDisabled={(option) => !option.isEnabled}
                />
            </div>
            {hasError && <p className={styles.errorText}>{meta.error}</p>}
        </div>
    );
};

function assertIsMultiValue(value: unknown): value is MultiValue<IOption> {
    return Array.isArray(value);
}

export default Select;
