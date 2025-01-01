import React from 'react';
import Image from 'next/image';
import { FieldArray, useField } from 'formik';

import styles from './order-dish-field.module.scss';

import { IOrderDishState } from '@/models/order';
import { useOrder } from '@/hooks/use-order';

import Input from '@/components/atoms/input';
import Button from '@/components/atoms/button';

interface IOrderDishFieldProps {
    dishState: IOrderDishState;
    index: number;
    className?: string;
    isMainPage?: boolean;
    minValue?: number | undefined;
}

const OrderDishField: React.FC<IOrderDishFieldProps> = ({ dishState, index, className, isMainPage, minValue }) => {
    const orderState = useOrder();
    const dish = dishState.dish;
    const [, meta] = useField(`dishes.${index}`);

    const handleChangeQuantity = (operation: string) => {
        const newQuantity = operation === '-' ? meta.value.quantity - 1 : meta.value.quantity + 1;

        if (orderState.dishes) {
            orderState.setOrderDishes(
                orderState.dishes.map((dish) => {
                    return {
                        dish: dish.dish,
                        quantity: dish.dish.id === meta.value.dishId ? newQuantity : dish.quantity,
                        preparedQuantity: dish.dish.preparedQuantity,
                    };
                }),
            );
        }
    };

    const handleDelete = () => {
        if (orderState.dishes) {
            orderState.setOrderDishes(orderState.dishes.filter((dish) => dish.dish.id !== meta.value.dishId));
        }
    };

    return (
        <FieldArray name={'dishes'}>
            {() => (
                <div className={`${className} ${styles.dish}`}>
                    <div className={styles.image}>
                        {dish.image && dish.image.content && <Image src={dish.image.content} alt={''} width={150} height={150} />}
                    </div>
                    <div className={styles.data}>
                        <p className={styles.name}>{dish.name}</p>

                        {dish.price && <p className={styles.price}>{dish.price} zł</p>}
                        <Input
                            className={styles.input}
                            name={`dishes.${index}.quantity`}
                            type={'quantity'}
                            label={'Ilość sztuk'}
                            isDisabled={isMainPage}
                            onClick={handleChangeQuantity}
                            minValue={minValue}
                        />
                    </div>
                    {!dish.preparedQuantity && !isMainPage && (
                        <Button className={styles.delete} type={'button'} onClick={handleDelete}>
                            X
                        </Button>
                    )}
                </div>
            )}
        </FieldArray>
    );
};

export default OrderDishField;
