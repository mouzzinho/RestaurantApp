'use client';

import React from 'react';

import styles from './page.module.scss';

import DishesList from '@/components/organizms/dishes-list';
import TableMenu from '@/components/molecules/table-menu';

const Page = () => {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <p className={styles.title}>Złóż zamówienie</p>
                <DishesList isOrder={true} />
            </div>
            <TableMenu />
        </div>
    );
};

export default Page;
