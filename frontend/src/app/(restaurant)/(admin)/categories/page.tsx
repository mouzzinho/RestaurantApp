'use client';

import React, { useEffect, useState } from 'react';

import styles from './page.module.scss';

import { ICategory } from '@/models/category';
import { useCategory } from '@/hooks/use-category';

import Card from '@/components/molecules/card';
import Loader from '@/components/atoms/loader';
import Button from '@/components/atoms/button';
import SearchBar from '@/components/molecules/search-bar';

const Page = () => {
    const categoryState = useCategory('list');
    const allCategories = categoryState.categories.data;
    const [categories, setCategories] = useState<ICategory[]>();

    const handleChange = (values: { search: string }) => {
        if (allCategories) {
            setCategories(
                allCategories
                    .filter((category) => category.name.toLowerCase().includes(values.search.toLowerCase()))
                    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
            );
        }
    };

    useEffect(() => {
        if (allCategories) {
            const sortedCategories = [...allCategories].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            setCategories(sortedCategories);
        }
    }, [allCategories]);

    return (
        <div className={styles.container}>
            <p className={styles.title}>Kategorie</p>
            <Button as={'link'} to={'/categories/add'} className={styles.button}>
                Dodaj kategorię
            </Button>
            <SearchBar className={styles.search} onChange={handleChange} label={'Wyszukaj kategorię'} />
            <ul className={styles.list}>
                {!categories && <Loader />}
                {categories &&
                    categories.length > 0 &&
                    categories.map((category, i) => {
                        return <Card card={category} key={`category-card-${i}`} url={`/categories/${category.id}`} />;
                    })}
                {categories && categories.length === 0 && <p className={styles.empty}>Lista kategorii jest pusta</p>}
            </ul>
        </div>
    );
};

export default Page;
