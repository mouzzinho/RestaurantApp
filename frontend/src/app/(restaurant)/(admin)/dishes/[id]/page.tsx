'use client';

import styles from './page.module.scss';

import DishForm from '@/components/organizms/dish-form';

const Page = () => {
    return (
        <div className={styles.container}>
            <DishForm />
        </div>
    );
};

export default Page;
