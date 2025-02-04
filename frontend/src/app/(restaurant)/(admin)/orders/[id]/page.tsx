'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import styles from './page.module.scss';

import BackIcon from '../../../../../../public/back.svg';
import { useOrder } from '@/hooks/use-order';
import { useUser } from '@/hooks/use-user';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/button';

const Page = () => {
    const router = useRouter();
    const orderState = useOrder('single');
    const userState = useUser();
    const orderData = orderState.get.data;
    const date = orderData ? new Date(orderData.order_date) : new Date();

    const handleDelete = () => {
        if (orderData) {
            orderState.deleteOrder
                .fetch({ id: orderData.id })
                .unwrap()
                .then(() => {
                    toast('Pomyślnie usunięto zamówienie', { type: 'success' });
                    router.replace(`/orders`);
                })
                .catch(() => {
                    toast('Wystąpił błąd podczas usuwania zamówienia', { type: 'error' });
                });
        }
    };

    useEffect(() => {
        if (userState.data.role === 'USER') {
            router.replace('/dashboard');
        }
    }, [userState]);

    if (!orderData || userState.data.role === 'USER') return null;

    return (
        <div className={styles.container}>
            <Link href={'/orders'} className={styles.link}>
                <BackIcon className={styles.icon} /> Wróć do listy dań
            </Link>
            <div className={styles.wrapper}>
                <div>
                    <p className={styles.title}>Zamówienie #{orderData.id}</p>
                    <div className={styles.column}>
                        <p className={styles.label}>Data złożenia zamówienia</p>
                        <p className={styles.value}>{date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}</p>
                    </div>
                    <div className={styles.column}>
                        <p className={styles.label}>Status</p>
                        <p className={`${styles.value} ${orderData.status === 1 ? styles.active : ''}`}>
                            {orderData.status === 1 ? 'Aktywne' : 'Zakończone'}
                        </p>
                    </div>
                </div>
                <Button type={'button'} className={styles.button} onClick={handleDelete}>
                    Usuń zamówienie
                </Button>
            </div>
            <div className={styles.column}>
                <p className={styles.label}>Dania</p>
                <div className={styles.dishes}>
                    {orderData.dishes.map((dish) => {
                        return (
                            <div key={`dish-${dish.id}`} className={styles.dish}>
                                <img className={styles.dishImage} src={dish.image.content} alt={dish.image.name} />
                                <div>
                                    <div className={styles.column}>
                                        <div className={styles.label}>Nazwa dania:</div>
                                        <p className={styles.value}>{dish.name}</p>
                                    </div>
                                    <div className={styles.dishWrapper}>
                                        <div className={styles.column}>
                                            <div className={styles.label}>Cena:</div>
                                            <p className={styles.value}>{dish.price} zł</p>
                                        </div>
                                        <div className={styles.column}>
                                            <div className={styles.label}>Ilość:</div>
                                            <p className={styles.value}>{dish.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Page;
