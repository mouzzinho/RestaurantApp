'use client';

import React from 'react';

import styles from './page.module.scss';

import Button from '@/components/atoms/button';
import DishesList from '@/components/organizms/dishes-list';

const Page = () => {
    return (
        <div className={styles.container}>
            <p className={styles.title}>Dania</p>
            <Button as={'link'} to={'/dishes/add'} className={styles.button}>
                Dodaj danie
            </Button>
            <DishesList />
        </div>
    );
};

export default Page;
