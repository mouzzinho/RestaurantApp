import restaurantApi from './base';

import { ITable, ITableMutation, ITableWithOrder } from '@/models/table';

export const tableApi = restaurantApi
    .enhanceEndpoints({
        addTagTypes: ['Table', 'Tables', 'ActiveTables'],
    })
    .injectEndpoints({
        endpoints: (builder) => ({
            getTable: builder.query<ITable, { id: string | number }>({
                query: ({ id }) => `/tables/${id}`,
                providesTags: ['Table'],
            }),
            getTables: builder.query<ITableWithOrder[], void>({
                query: () => `/tables`,
                providesTags: ['Tables'],
            }),
            getTablesWithOrders: builder.query<ITableWithOrder[], void>({
                query: () => `/tables/active`,
                providesTags: ['ActiveTables'],
            }),
            createTable: builder.mutation<ITable, ITable>({
                query: (data) => ({
                    method: 'POST',
                    url: `/tables`,
                    body: data,
                }),
                invalidatesTags: ['Table', 'Tables'],
            }),
            updateTable: builder.mutation<ITable, { data: ITableMutation; id: number }>({
                query: ({ data, id }) => ({
                    method: 'PATCH',
                    url: `/tables/${id}`,
                    body: data,
                }),
                invalidatesTags: ['Table', 'Tables'],
            }),
            updateTableOrder: builder.mutation<ITable, { data: ITableMutation; id: number }>({
                query: ({ data, id }) => ({
                    method: 'PATCH',
                    url: `/tables/${id}/order`,
                    body: data,
                }),
                invalidatesTags: ['Table', 'Tables', 'ActiveTables'],
            }),
            deleteTable: builder.mutation<void, { id: string | number }>({
                query: ({ id }) => ({
                    method: 'DELETE',
                    url: `/tables/${id}`,
                }),
                invalidatesTags: ['Tables'],
            }),
        }),
    });

export const {
    useGetTablesQuery,
    useGetTablesWithOrdersQuery,
    useGetTableQuery,
    useCreateTableMutation,
    useUpdateTableMutation,
    useUpdateTableOrderMutation,
    useDeleteTableMutation,
} = tableApi;
