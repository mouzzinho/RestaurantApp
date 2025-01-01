import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from './card.module.scss';

import { ICard } from '@/models/card';
import { IDish } from '@/models/dish';
import { IOrderDishState } from '@/models/order';
import { useSearchParams } from 'next/navigation';
import { useOrder } from '@/hooks/use-order';

interface ICardProps {
    card: ICard;
    url: string;
    isOrder?: boolean;
}

const Card: React.FC<ICardProps> = ({ card, url, isOrder }) => {
    const tableId = useSearchParams().get('table');
    const order = useOrder();

    const addToOrder = (card?: ICard) => {
        const newDishes = getOrderDishes(order.dishes, card as IDish);
        order.setOrderDishes([...newDishes]);
    };

    return (
        <>
            {isOrder && tableId && (
                <button
                    className={`${styles.container} ${isOrder && !card.isAvailable ? styles.disabled : ''}`}
                    type={'button'}
                    disabled={!card.isAvailable}
                    onClick={() => {
                        addToOrder(card);
                    }}
                >
                    <p className={styles.name}>{card.name}</p>
                    <div className={styles.image}>
                        {card.image && card.image.content && <Image src={card.image.content} alt={''} width={150} height={150} />}
                    </div>
                    {card.price && <p className={styles.price}>{card.price} zł</p>}
                </button>
            )}
            {!isOrder && (
                <Link href={url} className={styles.container}>
                    <p className={styles.name}>{card.name}</p>
                    <div className={styles.image}>
                        {card.image && card.image.content && <Image src={card.image.content} alt={''} width={150} height={150} />}
                    </div>
                    {card.price && <p className={styles.price}>{card.price} zł</p>}
                    {card.quantity && card.unit && (
                        <p className={`${styles.quantity} ${getQuantityStyles(card.quantity, card.unit)}`}>
                            {getSimplifiedQuantity(card.quantity, card.unit)}
                        </p>
                    )}
                </Link>
            )}
        </>
    );
};

function getSimplifiedQuantity(quantity: number, unit: string) {
    if (quantity && unit) {
        if ((unit === 'ml' || unit === 'g') && quantity >= 1000) {
            return `${quantity / 1000} ${unit === 'ml' ? 'l' : 'kg'}`;
        } else if (unit === 'kg' || unit === 'l') {
            return `${quantity / 1000} ${unit}`;
        } else if (quantity <= 0) {
            return `0 ${unit}`;
        }
        return `${quantity} ${unit}`;
    }
    return '';
}

function getQuantityStyles(quantity: number, unit: string) {
    if (unit === 'ml' || unit === 'g') {
        if (quantity <= 100) {
            return styles.low;
        } else if (quantity >= 500) {
            return styles.high;
        }
        return '';
    } else if (unit === 'kg' || unit === 'l') {
        if (quantity <= 10000) {
            return styles.low;
        } else if (quantity >= 30000) {
            return styles.high;
        }
        return '';
    }

    if (quantity <= 10) {
        return styles.low;
    } else if (quantity >= 50) {
        return styles.high;
    }
}

function getOrderDishes(dishes: IOrderDishState[] | null, dish: IDish) {
    const newOrder = [];
    let isAlreadyInOrder = false;

    if (dishes) {
        dishes.forEach((item) => {
            let quantity = item.quantity;
            if (item.dish.id === dish.id) {
                quantity += 1;
                isAlreadyInOrder = true;
            }

            newOrder.push({
                dish: item.dish,
                quantity: quantity,
            });
        });
    }

    if (!isAlreadyInOrder) {
        newOrder.push({ dish: dish, quantity: 1 });
    }

    return newOrder;
}

export default Card;
