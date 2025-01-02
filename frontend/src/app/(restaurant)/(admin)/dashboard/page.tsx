'use client';

import React from 'react';

import styles from './page.module.scss';

import { useUser } from '@/hooks/use-user';

import UserForm from '@/components/organizms/user-form';
import PasswordForm from '@/components/organizms/password-form';
import Stats from '@/components/organizms/stats';

interface IStatisticsProps {
    className?: string;
}

const Page: React.FC<IStatisticsProps> = ({ className = '' }) => {
    const userState = useUser();
    const userData = userState.data;
    const role = userData?.role;

    return (
        <div className={`${styles.container} ${className}`}>
            {role === 'ADMIN' && (
                <>
                    <p className={styles.title}>Statystyki</p>
                    <Stats />
                </>
            )}
            {role === 'USER' && (
                <>
                    <p className={styles.title}>Moje dane</p>
                    <UserForm isDashboard={true} className={styles.user} />
                    <PasswordForm />
                </>
            )}
        </div>
    );
};

export default Page;
