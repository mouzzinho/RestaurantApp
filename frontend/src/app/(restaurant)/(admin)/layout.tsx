'use client';

import React from 'react';

import styles from './layout.module.scss';

import { ILayoutProps } from '@/app/layout';

import Menu from '@/components/molecules/menu';

const Layout: React.FC<ILayoutProps> = ({ children }) => {
    return (
        <div className={styles.container}>
            <Menu />
            <section className={styles.panel}>{children}</section>
        </div>
    );
};

export default Layout;
