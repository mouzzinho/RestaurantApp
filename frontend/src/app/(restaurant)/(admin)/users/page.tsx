'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './page.module.scss';

import { IUser } from '@/models/user';
import { useUser } from '@/hooks/use-user';

import Loader from '@/components/atoms/loader';
import Card from '@/components/molecules/card';
import Button from '@/components/atoms/button';
import SearchBar from '@/components/molecules/search-bar';

const Page = () => {
    const userState = useUser('list');
    const allUsers = userState.users.data;
    const [users, setUsers] = useState<IUser[]>();
    const router = useRouter();

    const handleChange = (values: { search: string }) => {
        if (allUsers) {
            setUsers(
                allUsers
                    .filter((user) => user.name.toLowerCase().includes(values.search.toLowerCase()))
                    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
            );
        }
    };

    useEffect(() => {
        if (allUsers) {
            const sortedUsers = [...allUsers].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            setUsers(sortedUsers);
        }
    }, [allUsers]);

    useEffect(() => {
        if (userState && userState.data && userState.data.role === 'USER') {
            router.replace('/dashboard');
        }
    }, [userState]);

    if (userState && userState.data && userState.data.role === 'USER') return null;

    return (
        <div className={styles.container}>
            <p className={styles.title}>Pracownicy</p>
            <Button as={'link'} to={'/users/add'} className={styles.button}>
                Dodaj pracownika
            </Button>
            <SearchBar className={styles.search} onChange={handleChange} label={'Wyszukaj pracownika'} />
            <ul className={styles.list}>
                {!users && <Loader />}
                {users &&
                    users.length > 0 &&
                    users.map((user, i) => {
                        return <Card card={user} key={`user-card-${i}`} url={`/users/${user.id}`} />;
                    })}
                {users && users.length === 0 && <p className={styles.empty}>Lista pracowników jest pusta</p>}
            </ul>
        </div>
    );
};

export default Page;
