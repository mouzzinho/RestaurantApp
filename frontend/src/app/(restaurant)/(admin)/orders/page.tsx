'use client';

import React from 'react';

import styles from './page.module.scss';

import { useOrder } from '@/hooks/use-order';

import Loader from '@/components/atoms/loader';
import Link from 'next/link';

const Page = () => {
    const ordersState = useOrder('list');
    const orders = ordersState.orders.data;
    const sortedOrders = orders ? [...orders].sort((a, b) => parseInt(b.id.toString()) - parseInt(a.id.toString())) : [];

    return (
        <div className={styles.container}>
            <p className={styles.title}>Zamówienia</p>
            <ul className={styles.list}>
                {!sortedOrders && <Loader />}
                {sortedOrders &&
                    sortedOrders.length > 0 &&
                    sortedOrders.map((order, i) => {
                        const createdAt = new Date(parseInt(order.order_date));

                        return (
                            <li key={`order-${i}`} className={styles.order}>
                                <div>
                                    <p className={styles.label}>ID Zamówienia</p>
                                    <p className={styles.value}>#{order.id}</p>
                                </div>
                                <div>
                                    <p className={styles.label}>Data zamówienia</p>
                                    <p className={styles.value}>{createdAt.toLocaleDateString() + ' ' + createdAt.toLocaleTimeString()}</p>
                                </div>
                                <div>
                                    <p className={styles.label}>Status</p>
                                    <p className={`${styles.value} ${order.status === 1 ? styles.active : ''}`}>
                                        {order.status === 1 ? 'Aktywne' : 'Zakończone'}
                                    </p>
                                </div>
                                <div>
                                    <p className={styles.label} />
                                    <Link href={`/orders/${order.id}`} className={styles.value}>
                                        Szczegóły
                                    </Link>
                                </div>
                            </li>
                        );
                    })}
                {sortedOrders && sortedOrders.length === 0 && <p className={styles.empty}>Lista zamówień jest pusta</p>}
            </ul>
        </div>
    );
};

export default Page;
