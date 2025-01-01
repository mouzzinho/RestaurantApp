'use client';

import React from 'react';

import styles from './layout.module.scss';
import LoaderIcon from '../../../public/loader.svg';

import { ILayoutProps } from '@/app/layout';
import { useUser } from '@/hooks/use-user';

import Header from '@/components/molecules/header';

const Layout: React.FC<ILayoutProps> = ({ children }) => {
    const userState = useUser('auth');
    const data = userState.data;

    return (
        <>
            {!data ? (
                <div className={styles.container}>
                    <LoaderIcon className={styles.loader} />
                </div>
            ) : (
                <div className={styles.main}>
                    <Header />
                    {children}
                </div>
            )}
        </>
    );
};

export default Layout;
