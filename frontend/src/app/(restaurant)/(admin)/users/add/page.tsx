'use client';

import styles from './page.module.scss';

import UserForm from '@/components/organizms/user-form';

const Page = () => {
    return (
        <div className={styles.container}>
            <UserForm />
        </div>
    );
};

export default Page;
