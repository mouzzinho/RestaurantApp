'use client';

import React from 'react';

import styles from './page.module.scss';

import { ITable } from '@/models/table';
import { useTable } from '@/hooks/use-table';
import useWebSocket from '@/hooks/use-websocket';

import { toast } from 'react-toastify';
import Button from '@/components/atoms/button';
import Loader from '@/components/atoms/loader';

const Kitchen = () => {
    const tableState = useTable('active');
    const tables = tableState.active.data;
    useWebSocket('ws://witrestaurant.my//ws/tables');

    const handleOrder = (table: ITable) => {
        tableState.updateOrder
            .fetch({ id: table.id, data: { name: table.name, user_name: table.user_name, status: 'prepared' } })
            .unwrap()
            .then(() => {
                toast(`Zamówienie #${table.order?.id} zostało wydane`, { type: 'success' });
            })
            .catch(() => {
                toast(`Wystąpił błąd podczas wydawania zamówienia nr #${table.order?.id}`, { type: 'error' });
            });
    };

    return (
        <div className={styles.container}>
            <p className={styles.title}>Zamówienia</p>
            {!tables && <Loader />}
            <div className={styles.orders}>
                {tables &&
                    tables.length > 0 &&
                    tables.map((table) => {
                        return (
                            <div key={`order-${table.order.id}`} className={styles.order}>
                                <p className={styles.name}>{table.name}</p>
                                <p className={styles.time}>{new Date(parseInt(table.order.order_date)).toLocaleTimeString()}</p>
                                <ul className={styles.list}>
                                    {table.order.dishes.map((dish) => {
                                        const preparedQuantity = dish.preparedQuantity || 0;

                                        return preparedQuantity < dish.quantity ? (
                                            <li key={`order-${table.order.id}-dish-${dish.id}`} className={styles.item}>
                                                <p className={styles.dish}>{dish.name}</p>
                                                <p className={styles.quantity}>x{dish.quantity - preparedQuantity}</p>
                                            </li>
                                        ) : null;
                                    })}
                                </ul>
                                <Button
                                    className={styles.button}
                                    type={'button'}
                                    onClick={() => {
                                        handleOrder(table);
                                    }}
                                >
                                    Wydaj zamówienie
                                </Button>
                            </div>
                        );
                    })}
                {tables && tables.length === 0 && <p className={styles.empty}>Brak zamówień</p>}
            </div>
        </div>
    );
};

export default Kitchen;
