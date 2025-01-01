import React, { useState } from 'react';

import styles from './table-menu.module.scss';

import MenuIcon from '../../../public/order.svg';
import BackIcon from '../../../public/back.svg';

import { ITable } from '@/models/table';
import { useTable } from '@/hooks/use-table';

import Button from '@/components/atoms/button';
import OrderForm from '@/components/organizms/order-form';
import TableStatus from '@/components/molecules/table-status';

interface ITableMenuProps {
    className?: string;
    selectedTable?: ITable | null;
    onClose?: () => void;
    isMainPage?: boolean;
}

const TableMenu: React.FC<ITableMenuProps> = ({ className = '', isMainPage, selectedTable, onClose }) => {
    const tableState = useTable('single');
    const table = selectedTable ? selectedTable : tableState.get.data;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        if (onClose) {
            onClose();
        } else {
            setIsMenuOpen(!isMenuOpen);
        }
    };

    return (
        <aside className={`${className} ${styles.container} ${onClose ? styles.mainpage : ''} ${isMenuOpen || !!selectedTable ? styles.open : ''}`}>
            <p className={styles.name}>{table?.name}</p>
            {!isMenuOpen && (
                <Button onClick={toggleMenu} className={`${styles.button} ${styles.toggle}`}>
                    <MenuIcon />
                </Button>
            )}
            {(isMenuOpen || !!selectedTable) && (
                <Button onClick={toggleMenu} className={`${styles.button} ${styles.toggle}`}>
                    <BackIcon />
                </Button>
            )}
            {table && <TableStatus table={table} className={styles.status} />}
            <OrderForm className={styles.wrapper} table={table} isMainPage={isMainPage} />
            {table && table.status !== 'empty' && table.status !== 'dirty' && isMainPage && (
                <Button as={'link'} to={`/order?table=${table.id}`} className={table.order ? styles.edit : styles.order}>
                    {table.order ? 'Edytuj zamówienie' : 'Złóż zamówienie'}
                </Button>
            )}
        </aside>
    );
};

export default TableMenu;
