import React from 'react';
import { Field, FieldProps, useField } from 'formik';

import styles from './input-file.module.scss';

import UploadIcon from '../../../public/upload.svg';
import TrashIcon from '../../../public/delete.svg';

import { IFileBase64 } from '@/models/file-base-64.model';
import { assertPromiseIsFulfilled, assertPromiseIsRejected } from '@/utils/assertions';

import Error from '../atoms/error';

interface IInputFileProps {
    className?: string;
    label?: string;
    name: string;
    maxFileSize?: number;
    isDisabled?: boolean;
    isImageInput?: boolean;
    acceptedTypes?: string[] | 'images';
}

const IMAGE_TYPES = ['image/*'];

const InputFile: React.FC<IInputFileProps> = ({ className = '', name, maxFileSize = 5120000, label, isDisabled, acceptedTypes, isImageInput }) => {
    const [, meta, helpers] = useField(name);
    const hasError = !!(meta.error && meta.touched);
    const localAcceptedTypes = (isImageInput && !acceptedTypes) || acceptedTypes === 'images' ? IMAGE_TYPES : acceptedTypes;

    const handleFiles = async (newFiles: File[]) => {
        const { validFiles, validationErrors } = validateFile({
            files: newFiles,
            maxFileSize,
            acceptedTypes,
            currentFileCount: meta.value ? 1 : 0,
        });

        const data = await Promise.allSettled(validFiles.map((file) => getBase64(file)));

        const filesBase64 = data.filter(assertPromiseIsFulfilled).map((result) => result.value);
        const readErrors = data.filter(assertPromiseIsRejected).map((result) => result.reason);
        helpers.setValue(filesBase64[0]);

        // To add errors to formik field and at the same time setting valid value
        // setError has to be wrapped in setTimeout
        setTimeout(() => {
            helpers.setError([...readErrors, ...validationErrors].join(' '));
        }, 0);
    };

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files && Array.from(event.target.files);
        event.target.value = '';

        helpers.setTouched(true);

        return await handleFiles(files || []);
    };

    const handleDelete = () => {
        return () => {
            helpers.setValue(null);
            helpers.setError('');
        };
    };

    return (
        <Field name={name}>
            {({ field }: FieldProps) => {
                return (
                    <div className={`${styles.container} ${className} ${hasError ? styles.error : ''} ${isDisabled ? styles.disabled : ''}`}>
                        {label && <p className={styles.labelBox}>{label}</p>}
                        {!meta.value && (
                            <label htmlFor={name} className={styles.dropzone}>
                                <input
                                    className={styles.input}
                                    type="file"
                                    id={name}
                                    name={name}
                                    onChange={handleChange}
                                    onBlur={field.onBlur}
                                    accept={localAcceptedTypes && localAcceptedTypes.join(',')}
                                />
                                <div className={styles.dropzoneContent}>
                                    <UploadIcon className={styles.upload} />
                                    <span className={styles.dropzoneText}>{'Załącz plik'}</span>
                                </div>
                            </label>
                        )}
                        <Error name={name} />
                        {meta.value && (
                            <ul className={isImageInput ? styles.gallery : styles.list}>
                                {[meta.value].map((file, index) => {
                                    const src = file.content || file.url;
                                    if (!src) return null;
                                    if (isImageInput) {
                                        return (
                                            <li className={styles.imageBox} key={`file-item-${index}`}>
                                                <img className={styles.image} src={src as string} alt="" />
                                                <button onClick={handleDelete()} className={styles.buttonDelete}>
                                                    <TrashIcon className={styles.trash} />
                                                </button>
                                            </li>
                                        );
                                    }
                                    return (
                                        <li className={styles.fileBox} key={`file-item-${index}`}>
                                            <p className={styles.fileName}>{file.name}</p>
                                            <button onClick={handleDelete()} className={styles.buttonDelete}>
                                                <TrashIcon className={styles.trash} />
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                );
            }}
        </Field>
    );
};

async function getBase64(file: File) {
    return new Promise<IFileBase64>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () =>
            resolve({
                name: file.name,
                content: reader.result,
                mimeType: file.type,
            });
        reader.onerror = () => reject(`Nie udało się wczytać pliku`);
    });
}

interface IFilesValidationResult {
    validFiles: File[];
    validationErrors: string[];
}

interface IValidateFilesConfig {
    files: File[];
    currentFileCount: number;
    maxFileSize: number;
    acceptedTypes: IInputFileProps['acceptedTypes'];
}

function validateFile({ files, maxFileSize, currentFileCount, acceptedTypes }: IValidateFilesConfig): IFilesValidationResult {
    const validFiles: File[] = [];
    const validationErrors: string[] = [];
    let count = currentFileCount;

    files.forEach((file) => {
        if (count === 1) {
            validationErrors.push('Możesz wgrać maksymalnie 1 plik');
            count++;
        } else if (file.size > maxFileSize) {
            validationErrors.push('Maksymalny rozmiar pliku nie może przekraczać' + Math.round(maxFileSize / 1024 / 1000) + 'MB');
        } else if (
            (Array.isArray(acceptedTypes) && !acceptedTypes.includes(file.type)) ||
            (acceptedTypes === 'images' && !file.type.startsWith('image/'))
        ) {
            validationErrors.push('Typ pliku jest niepoprawny');
        } else {
            validFiles.push(file);
            count++;
        }
    });

    return {
        validFiles,
        validationErrors,
    };
}

export default InputFile;
