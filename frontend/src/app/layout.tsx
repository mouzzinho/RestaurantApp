import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

import '../styles/global.scss';
import 'react-toastify/dist/ReactToastify.css';

import ClientLayout from '@/components/layouts/client-layout';

export const metadata: Metadata = {
    title: 'Panel restauracyjny',
    description: 'Panel do obsługi stolików i zarządzania zamówieniami',
};

const inter = Inter({
    weight: ['200', '400', '500', '700', '900'],
    style: ['normal'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

export interface ILayoutProps {
    children?: React.ReactNode;
}

const RootLayout: React.FC<ILayoutProps> = ({ children }) => {
    return (
        <html lang="pl">
            <body className={inter.variable}>
                <ClientLayout>
                    <main>{children}</main>
                    <ToastContainer position="bottom-left" autoClose={5000} closeOnClick pauseOnHover />
                </ClientLayout>
            </body>
        </html>
    );
};

export default RootLayout;
