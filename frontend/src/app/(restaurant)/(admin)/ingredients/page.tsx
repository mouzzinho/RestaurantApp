'use client';

import React, { useEffect, useState } from 'react';

import styles from './page.module.scss';

import { IIngredient } from '@/models/ingredient';
import { useIngredient } from '@/hooks/use-ingredient';

import Card from '@/components/molecules/card';
import Loader from '@/components/atoms/loader';
import Button from '@/components/atoms/button';
import SearchBar from '@/components/molecules/search-bar';

const Page = () => {
    const ingredientState = useIngredient('list');
    const allIngredients = ingredientState.ingredients.data;
    const [ingredients, setIngredients] = useState<IIngredient[]>();

    const handleChange = (values: { search: string }) => {
        if (allIngredients) {
            setIngredients(
                allIngredients
                    .filter((ingredient) => ingredient.name.toLowerCase().includes(values.search.toLowerCase()))
                    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
            );
        }
    };

    useEffect(() => {
        if (allIngredients) {
            const sortedIngredients = [...allIngredients].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            setIngredients(sortedIngredients);
        }
    }, [allIngredients]);

    return (
        <div className={styles.container}>
            <p className={styles.title}>Składniki</p>
            <Button as={'link'} to={'/ingredients/add'} className={styles.button}>
                Dodaj składnik
            </Button>
            <SearchBar className={styles.search} onChange={handleChange} label={'Wyszukaj składnik'} />
            <ul className={styles.list}>
                {!ingredients && <Loader />}
                {ingredients &&
                    ingredients.length > 0 &&
                    ingredients.map((ingredient, i) => {
                        return <Card card={ingredient} key={`ingredient-card-${i}`} url={`/ingredients/${ingredient.id}`} />;
                    })}
                {ingredients && ingredients.length === 0 && <p className={styles.empty}>Lista składników jest pusta</p>}
            </ul>
        </div>
    );
};

export default Page;
