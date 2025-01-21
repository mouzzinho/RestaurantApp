import React, { useRef } from 'react';
import { Form, Formik, FormikProps } from 'formik';

import styles from './table-status.module.scss';

import { ITable, TTableStatus } from '@/models/table';
import { IUser } from '@/models/user';
import { useTable } from '@/hooks/use-table';
import { useOrder } from '@/hooks/use-order';
import { useUser } from '@/hooks/use-user';

import { toast } from 'react-toastify';
import HandleFormikChange from '@/components/hoc/handle-formik-change';
import Select from '@/components/atoms/select';

interface ITableStatusProps {
    table: ITable;
    className?: string;
}

interface ITableValues {
    status: TTableStatus;
    user_name: string | null;
}

const TableStatus: React.FC<ITableStatusProps> = ({ table, className = '' }) => {
    const tableState = useTable();
    const orderState = useOrder();
    const userState = useUser('list');
    const users = userState.users.data;
    const formRef = useRef<FormikProps<ITableValues>>(null);

    const handleTableChange = (values: ITableValues) => {
        if (table.status !== values.status || values.user_name !== table.user_name) {
            tableState.update
                .fetch({
                    id: table.id,
                    data: { name: table.name, status: values.status, user_name: values.status === 'dirty' ? null : values.user_name },
                })
                .then(() => {
                    toast('Stolik został zaktualizowany', { type: 'info' });

                    if (values.status === 'dirty' && table.order) {
                        formRef.current?.setFieldValue('user_name', null);
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
                    toast('Wystąpił błąd poczas próby zaktualizowania stolika', { type: 'error' });
                });
        }
    };

    return (
        <Formik innerRef={formRef} initialValues={{ status: table.status, user_name: table.user_name }} onSubmit={() => {}}>
            {() => (
                <Form className={`${className} ${styles.form}`}>
                    <HandleFormikChange onChange={handleTableChange} />
                    <Select name={'status'} label={'Status'} options={getTableStatusOptions(table.status)} />
                    <Select name={'user_name'} label={'Pracownik'} options={getUsersOptions(users)} />
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

function getUsersOptions(users?: IUser[]) {
    if (users) {
        return users.map((user) => {
            return { label: user.name, value: user.name, isEnabled: true };
        });
    }

    return [];
}

export default TableStatus;
