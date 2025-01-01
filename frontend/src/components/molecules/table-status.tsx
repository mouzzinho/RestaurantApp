import React from 'react';
import { Form, Formik } from 'formik';

import styles from './table-status.module.scss';

import { ITable, TTableStatus } from '@/models/table';
import { useTable } from '@/hooks/use-table';
import { useOrder } from '@/hooks/use-order';

import { toast } from 'react-toastify';
import Select from '@/components/atoms/select';
import HandleFormikChange from '@/components/hoc/handle-formik-change';

interface ITableStatusProps {
    table: ITable;
    className?: string;
}

const TableStatus: React.FC<ITableStatusProps> = ({ table, className = '' }) => {
    const tableState = useTable();
    const orderState = useOrder();

    const handleStatusChange = (values: { status: TTableStatus }) => {
        if (table.status !== values.status) {
            tableState.update
                .fetch({ id: table.id, data: { name: table.name, status: values.status } })
                .then(() => {
                    toast('Zaktualizowano status stolika', { type: 'info' });

                    if (values.status === 'dirty' && table.order) {
                        orderState.deactivate
                            .fetch({ id: table.order.id })
                            .then(() => {
                                orderState.setOrderDishes([]);
                            })
                            .catch(() => {
                                toast('Wystąpił błąd podczas zmiany statusu zamówienia', { type: 'error' });
                            });
                    }
                })
                .catch(() => {
                    toast('Nie udało się zaktualizować statusu stolika', { type: 'error' });
                });
        }
    };

    return (
        <Formik initialValues={{ status: table.status }} onSubmit={() => {}}>
            {() => (
                <Form className={`${className} ${styles.form}`}>
                    <HandleFormikChange onChange={handleStatusChange} />
                    <Select name={'status'} label={'Status'} options={getTableStatusOptions(table.status)} />
                </Form>
            )}
        </Formik>
    );
};

function getTableStatusOptions(status: TTableStatus) {
    return [
        {
            label: 'Puste',
            value: 'empty',
            isEnabled: status === 'dirty',
        },
        {
            label: 'Przed zamówieniem',
            value: 'new',
            isEnabled: status === 'empty',
        },
        {
            label: 'Zamówione złożone',
            value: 'ordered',
            isEnabled: false,
        },
        {
            label: 'Zamówienie przygotowane',
            value: 'prepared',
            isEnabled: false,
        },
        {
            label: 'Zajęty',
            value: 'busy',
            isEnabled: status === 'prepared',
        },
        {
            label: 'Do posprzątania',
            value: 'dirty',
            isEnabled: status === 'busy',
        },
    ];
}

export default TableStatus;
