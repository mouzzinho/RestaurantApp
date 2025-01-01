import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

import styles from './menu.module.scss';

import MenuIcon from '../../../public/menu.svg';
import BackIcon from '../../../public/back.svg';
import LogoutIcon from '../../../public/logout.svg';

import { useUser } from '@/hooks/use-user';

import Button from '@/components/atoms/button';
import { toast } from 'react-toastify';

const Menu = () => {
    const pathname = usePathname();
    const userState = useUser();
    const data = userState.data;
    const role = data?.role;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        userState.logout
            .fetch()
            .unwrap()
            .catch(() => {
                toast('Wystąpił błąd podczas próby wylogowania', { type: 'error' });
            });
    };

    return (
        <aside className={`${styles.container} ${isMenuOpen ? styles.open : ''}`}>
            <nav className={styles.navigation}>
                <p className={styles.user}>{data ? data.name : ''}</p>
                {!isMenuOpen && (
                    <Button onClick={toggleMenu} className={`${styles.button} ${styles.toggle}`}>
                        <MenuIcon />
                    </Button>
                )}
                {isMenuOpen && (
                    <Button onClick={toggleMenu} className={`${styles.button} ${styles.toggle}`}>
                        <BackIcon />
                    </Button>
                )}
                <ul className={styles.list}>
                    <li className={styles.item}>
                        <Button as={'link'} to={'/dashboard'} isActive={pathname === '/dashboard'}>
                            {role === 'ADMIN' ? 'Statystyki' : 'Moje dane'}
                        </Button>
                    </li>
                    <li className={styles.item}>
                        <Button as={'link'} to={'/dishes'} isActive={pathname.includes('dishes')}>
                            Dania
                        </Button>
                    </li>
                    <li className={styles.item}>
                        <Button as={'link'} to={'/ingredients'} isActive={pathname.includes('ingredients')}>
                            Składniki
                        </Button>
                    </li>
                    <li className={styles.item}>
                        <Button as={'link'} to={'/categories'} isActive={pathname.includes('categories')}>
                            Kategorie
                        </Button>
                    </li>
                    {role && role === 'ADMIN' && (
                        <>
                            <li className={styles.item}>
                                <Button as={'link'} to={'/users'} isActive={pathname.includes('users')}>
                                    Pracownicy
                                </Button>
                            </li>
                            <li className={styles.item}>
                                <Button as={'link'} to={'/orders'} isActive={pathname.includes('orders')}>
                                    Zamówienia
                                </Button>
                            </li>
                        </>
                    )}
                </ul>
                <Button onClick={handleLogout} className={`${styles.button} ${styles.logout}`}>
                    <LogoutIcon />
                </Button>
            </nav>
        </aside>
    );
};

export default Menu;
