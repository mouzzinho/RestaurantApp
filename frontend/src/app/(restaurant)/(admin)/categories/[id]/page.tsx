'use client';

import styles from './page.module.scss';

import CategoryForm from '@/components/organizms/category-form';

const Page = () => {
    return (
        <div className={styles.container}>
            <CategoryForm />
        </div>
    );
};

export default Page;
