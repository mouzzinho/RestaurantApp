'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import styles from './page.module.scss';

import { useUser } from '@/hooks/use-user';

import UserForm from '@/components/organizms/user-form';

const Page = () => {
    const userState = useUser();
    const router = useRouter();

    useEffect(() => {
        if (userState && userState.data && userState.data.role === 'USER') {
            router.replace('/dashboard');
        }
    }, [userState]);

    if (userState && userState.data && userState.data.role === 'USER') return null;
    return (
        <div className={styles.container}>
            <UserForm />
        </div>
    );
};

export default Page;
