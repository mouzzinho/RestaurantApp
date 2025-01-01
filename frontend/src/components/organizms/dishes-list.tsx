import React, { useEffect, useState } from 'react';

import styles from './dishes-list.module.scss';

import { IDish } from '@/models/dish';
import { useDish } from '@/hooks/use-dish';
import { useCategory } from '@/hooks/use-category';

import Card from '@/components/molecules/card';
import Loader from '@/components/atoms/loader';
import SearchBar from '@/components/molecules/search-bar';

interface IDishesListProps {
    isOrder?: boolean;
}

const DishesList: React.FC<IDishesListProps> = ({ isOrder }) => {
    const dishState = useDish('list');
    const allDishes = dishState.dishes.data;
    const categoriesState = useCategory('list');
    const categories = categoriesState.categories.data;
    const [dishes, setDishes] = useState<IDish[]>();
    const [activeCategory, setActiveCategory] = useState<string>('');

    const handleChange = (values: { search: string }) => {
        if (allDishes) {
            setDishes(
                allDishes
                    .filter((dish) => dish.name.toLowerCase().includes(values.search.toLowerCase()))
                    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
            );
        }
    };

    const handleCategory = (name: string) => {
        setActiveCategory(name);
        if (allDishes) {
            setDishes(allDishes.filter((dish) => dish.categories.find((category) => category.name.toLowerCase().includes(name.toLowerCase()))));
        }
    };

    useEffect(() => {
        if (allDishes) {
            const sortedDishes = [...allDishes].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            setDishes(sortedDishes);
        }
    }, [allDishes]);

    return (
        <>
            <SearchBar className={styles.search} onChange={handleChange} label={'Wyszukaj danie'} />
            <ul className={styles.categories}>
                <li className={`${styles.category} ${activeCategory === '' ? styles.active : ''}`}>
                    <button
                        onClick={() => {
                            handleCategory('');
                        }}
                    >
                        Pokaż wszystko
                    </button>
                </li>
                {categories &&
                    categories.map((category) => {
                        return (
                            <li
                                key={`category-${category.id}`}
                                className={`${styles.category} ${activeCategory === category.name ? styles.active : ''}`}
                            >
                                <button
                                    onClick={() => {
                                        handleCategory(category.name);
                                    }}
                                >
                                    {category.name}
                                </button>
                            </li>
                        );
                    })}
            </ul>
            <ul className={styles.list}>
                {!dishes && <Loader />}
                {dishes &&
                    dishes.length > 0 &&
                    dishes.map((dish, i) => {
                        return <Card card={dish} key={`dish-card-${i}`} url={`/dishes/${dish.id}`} isOrder={isOrder} />;
                    })}
                {dishes && dishes.length === 0 && <p className={styles.empty}>Lista dań jest pusta</p>}
            </ul>
        </>
    );
};

export default DishesList;
