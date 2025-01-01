'use client';

import { useEffect, useState } from 'react';

import styles from './page.module.scss';

import { ITable } from '@/models/table';
import { useTable } from '@/hooks/use-table';
import useWebSocket from '@/hooks/use-websocket';

import Restaurant from '@/components/organizms/restaurant';
import TableMenu from '@/components/molecules/table-menu';

const Page = () => {
    const tableState = useTable('list');
    const tables = tableState.tables.data;
    useWebSocket('ws://localhost:8080/ws/tables');

    const [selectedTable, setSelectedTable] = useState<ITable | null>(null);

    const openTableMenu = (table: ITable) => {
        setSelectedTable(table);
    };

    const closeTableMenu = () => {
        setSelectedTable(null);
    };

    useEffect(() => {
        const updatedTable = tables?.find((table) => table.id === selectedTable?.id) || null;
        setSelectedTable(updatedTable);
    }, [tables]);

    return (
        <div className={styles.container}>
            <Restaurant handleClick={openTableMenu} tables={tables} />
            <TableMenu selectedTable={selectedTable} onClose={closeTableMenu} isMainPage={true} />
        </div>
    );
};

export default Page;
