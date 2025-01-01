'use client';

import styles from './page.module.scss';

import IngredientForm from '@/components/organizms/ingredient-form';

const Page = () => {
    return (
        <div className={styles.container}>
            <IngredientForm />
        </div>
    );
};

export default Page;
