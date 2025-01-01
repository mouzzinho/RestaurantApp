import {
    useGetTablesQuery,
    useGetTableQuery,
    useCreateTableMutation,
    useUpdateTableMutation,
    useDeleteTableMutation,
    useGetTablesWithOrdersQuery,
    useUpdateTableOrderMutation,
} from '@/redux/api/table';
import { useSearchParams } from 'next/navigation';

export const useTable = (query?: 'single' | 'list' | 'active') => {
    const tableId = useSearchParams().get('table') || '';
    const skipSingleQuery = query !== 'single' || !tableId;
    const skipListQuery = query !== 'list';
    const skipActiveQuery = query !== 'active';

    const getTableQuery = useGetTableQuery({ id: tableId }, { skip: skipSingleQuery });
    const getTablesQuery = useGetTablesQuery(undefined, { skip: skipListQuery });
    const getActiveQuery = useGetTablesWithOrdersQuery(undefined, { skip: skipActiveQuery });
    const [create, createTableMutation] = useCreateTableMutation();
    const [update, updateTableMutation] = useUpdateTableMutation();
    const [updateOrder, updateTableOrderMutation] = useUpdateTableOrderMutation();
    const [deleteTable, deleteTableMutation] = useDeleteTableMutation();

    return {
        get: {
            data: getTableQuery.data,
            isFetching: getTableQuery.isFetching,
            isLoading: getTableQuery.isLoading,
            isSuccess: getTableQuery.isSuccess,
            isError: getTableQuery.isError,
            errors: getTableQuery.error,
        },
        tables: {
            data: getTablesQuery.data,
            isFetching: getTablesQuery.isFetching,
            isLoading: getTablesQuery.isLoading,
            isSuccess: getTablesQuery.isSuccess,
            isError: getTablesQuery.isError,
            errors: getTablesQuery.error,
        },
        active: {
            data: getActiveQuery.data,
            isFetching: getActiveQuery.isFetching,
            isLoading: getActiveQuery.isLoading,
            isSuccess: getActiveQuery.isSuccess,
            isError: getActiveQuery.isError,
            errors: getActiveQuery.error,
        },
        create: {
            fetch: create,
            data: createTableMutation.data,
            isLoading: createTableMutation.isLoading,
            isSuccess: createTableMutation.isSuccess,
            isError: createTableMutation.isError,
            errors: createTableMutation.error,
        },
        update: {
            fetch: update,
            data: updateTableMutation.data,
            isLoading: updateTableMutation.isLoading,
            isSuccess: updateTableMutation.isSuccess,
            isError: updateTableMutation.isError,
            errors: updateTableMutation.error,
        },
        updateOrder: {
            fetch: updateOrder,
            data: updateTableOrderMutation.data,
            isLoading: updateTableOrderMutation.isLoading,
            isSuccess: updateTableOrderMutation.isSuccess,
            isError: updateTableOrderMutation.isError,
            errors: updateTableOrderMutation.error,
        },
        deleteTable: {
            fetch: deleteTable,
            data: deleteTableMutation.data,
            isLoading: deleteTableMutation.isLoading,
            isSuccess: deleteTableMutation.isSuccess,
            isError: deleteTableMutation.isError,
            errors: deleteTableMutation.error,
        },
    };
};
