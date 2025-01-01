'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './header.module.scss';
import UserIcon from '../../../public/user.svg';

import { useUser } from '@/hooks/use-user';

import Button from '@/components/atoms/button';

const Header = () => {
    const pathname = usePathname();
    const userState = useUser();
    const data = userState.data;

    return (
        <header className={styles.container}>
            <nav>
                <ul className={styles.list}>
                    <li className={styles.item}>
                        <Button className={styles.button} as={'link'} to={'/'} isActive={pathname === '/'}>
                            Sala
                        </Button>
                    </li>
                    <li className={styles.item}>
                        <Button className={styles.button} as={'link'} to={'/kitchen'} isActive={pathname === '/kitchen'}>
                            Kuchnia
                        </Button>
                    </li>
                    <li className={styles.item}>
                        <p>{data ? data.name : ''}</p>
                        <Link
                            href={'/dashboard'}
                            className={`${styles.icon} ${pathname !== '/' && !pathname.includes('kitchen') ? styles.active : ''}`}
                        >
                            <UserIcon />
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
