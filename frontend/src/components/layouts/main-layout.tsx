'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { getUserTokenData } from '@/utils/getUserTokenData';

interface IMainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<IMainLayoutProps> = ({ children }) => {
    const router = useRouter();
    const tokenData = getUserTokenData();

    useEffect(() => {
        if (!tokenData || !tokenData.token) {
            router.replace('/login');
        }
    }, [router, tokenData]);

    return children;
};

export default MainLayout;
