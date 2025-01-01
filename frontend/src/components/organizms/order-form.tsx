import React, { useEffect, useRef, useState } from 'react';
import { Form, Formik, FormikProps } from 'formik';
import { useRouter } from 'next/navigation';

import styles from './order-form.module.scss';

import { IOrderDishMutation, IOrderDishState } from '@/models/order';
import { ITable } from '@/models/table';
import { useOrder } from '@/hooks/use-order';
import { useTable } from '@/hooks/use-table';

import { toast } from 'react-toastify';
import Button from '@/components/atoms/button';
import OrderDishField from '@/components/molecules/order-dish-field';

interface IOrderFormProps {
    table?: ITable;
    className?: string;
    isMainPage?: boolean;
}

const OrderForm: React.FC<IOrderFormProps> = ({ className = '', table, isMainPage }) => {
    const router = useRouter();
    const dishesFromTable = getOrderDishes(table);
    const tableState = useTable();
    const orderState = useOrder();
    const orderDishes = orderState.dishes;
    const formikRef = useRef<FormikProps<IOrderDishMutation>>(null);
    const [sumValue, setSumValue] = useState(0);

    const handleSubmit = (values: IOrderDishMutation) => {
        if (table) {
            const body = {
                orderDate: new Date().getTime().toString(),
                tableId: parseInt(table.id.toString()),
                status: 1,
                dishes: values.dishes,
            };

            if (table.order) {
                orderState.update
                    .fetch({ data: body, id: table.order.id })
                    .unwrap()
                    .then(() => {
                        tableState.update
                            .fetch({ id: table.id, data: { name: table.name, status: 'ordered' } })
                            .then(() => {
                                toast('Pomyślnie edytowano zamówienie', { type: 'success' });
                                router.replace(`/`);
                            })
                            .catch(() => {
                                toast('Nie udało się zaktualizować statusu stolika', { type: 'error' });
                            });
                    })
                    .catch(() => {
                        toast('Nie udało się edytować zamówienia', { type: 'error' });
                    });
            } else {
                orderState.create
                    .fetch(body)
                    .unwrap()
                    .then(() => {
                        toast('Pomyślnie złożono zamówienie', { type: 'success' });
                        router.replace(`/`);
                    })
                    .catch(() => {
                        toast('Nie udało się złożyć zamówienia', { type: 'error' });
                    });
            }
        }
    };

    const handleDeleteAll = () => {
        orderState.setOrderDishes([]);
    };

    useEffect(() => {
        if (orderState) {
            formikRef.current?.setValues(getInitialValues(orderDishes));
            setSumValue(getSumValue(orderDishes));
        }
    }, [orderDishes]);

    useEffect(() => {
        if (table) {
            orderState.setOrderDishes(dishesFromTable);
        }
    }, [table]);

    if (!orderDishes) return null;

    return (
        <Formik initialValues={{ dishes: [] }} onSubmit={handleSubmit} innerRef={formikRef}>
            {() => {
                return (
                    <Form className={`${className} ${styles.form}`}>
                        {orderDishes.map((item, i) => {
                            return (
                                <OrderDishField
                                    key={`order-dish-field-${i}`}
                                    dishState={item}
                                    index={i}
                                    isMainPage={isMainPage}
                                    minValue={dishesFromTable?.find((dish) => dish.dish.id === item.dish.id)?.quantity}
                                />
                            );
                        })}
                        {orderDishes.length > 0 && (
                            <>
                                <p className={styles.sum}>
                                    Suma: <span>{sumValue} zł</span>
                                </p>
                                {table && table.status === 'new' && !isMainPage && (
                                    <Button className={styles.order} type={'submit'}>
                                        Złóż zamówienie
                                    </Button>
                                )}
                                {table && (table.status === 'ordered' || table.status === 'prepared' || table.status === 'busy') && !isMainPage && (
                                    <Button className={styles.edit} type={'submit'}>
                                        Edytuj zamówienie
                                    </Button>
                                )}
                                {table && (table.status === 'empty' || table.status === 'new') && !isMainPage && (
                                    <Button className={styles.deleteAll} type={'button'} onClick={handleDeleteAll}>
                                        Skasuj wszystko
                                    </Button>
                                )}
                            </>
                        )}
                    </Form>
                );
            }}
        </Formik>
    );
};

function getInitialValues(orderDishes: IOrderDishState[] | null) {
    if (orderDishes && orderDishes.length > 0) {
        return {
            dishes: orderDishes.map((item) => {
                return { dishId: item.dish.id, quantity: item.quantity, preparedQuantity: item.dish.preparedQuantity };
            }),
        };
    }

    return { dishes: [] };
}

function getSumValue(orderDishes: IOrderDishState[] | null) {
    if (orderDishes) {
        let sumValue = 0;

        orderDishes.forEach((item) => {
            const price = item.dish.price * item.quantity;
            sumValue += price;
        });

        return sumValue;
    }

    return 0;
}

function getOrderDishes(table: ITable | undefined) {
    if (table && table.order) {
        return table.order.dishes.map((dish) => {
            return {
                dish: dish,
                quantity: dish.quantity,
                preparedQuantity: dish.preparedQuantity,
            };
        });
    }
    return [];
}

export default OrderForm;
