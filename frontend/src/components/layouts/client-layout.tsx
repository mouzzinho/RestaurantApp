'use client';

import React from 'react';
import store from '@/redux/store';
import { Provider } from 'react-redux';

import MainLayout from '@/components/layouts/main-layout';

interface IClientLayoutProps {
    children: React.ReactNode;
}

const ClientLayout: React.FC<IClientLayoutProps> = ({ children }) => {
    return (
        <Provider store={store}>
            <MainLayout>{children}</MainLayout>
        </Provider>
    );
};

export default ClientLayout;
