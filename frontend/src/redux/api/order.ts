import restaurantApi from './base';

import { IOrder, IOrderMutation } from '@/models/order';

export const orderApi = restaurantApi
    .enhanceEndpoints({
        addTagTypes: ['Order', 'Orders', 'Tables', 'ActiveTables'],
    })
    .injectEndpoints({
        endpoints: (builder) => ({
            getOrder: builder.query<IOrder, { id: string | number }>({
                query: ({ id }) => `/orders/${id}`,
                providesTags: ['Order'],
            }),
            getOrders: builder.query<IOrder[], undefined>({
                query: () => `/orders`,
                providesTags: ['Orders'],
            }),
            createOrder: builder.mutation<IOrder, IOrderMutation>({
                query: (data) => ({
                    method: 'POST',
                    url: `/orders`,
                    body: data,
                }),
                invalidatesTags: ['Order', 'Orders', 'Tables', 'ActiveTables'],
            }),
            updateOrder: builder.mutation<IOrder, { data: IOrderMutation; id: string | number }>({
                query: ({ data, id }) => ({
                    method: 'PATCH',
                    url: `/orders/${id}`,
                    body: data,
                }),
                invalidatesTags: ['Order', 'Orders', 'Tables', 'ActiveTables'],
            }),
            deactivateOrder: builder.mutation<IOrder, { id: string | number }>({
                query: ({ id }) => ({
                    method: 'PATCH',
                    url: `/orders/${id}/deactivate`,
                }),
                invalidatesTags: ['Order', 'Orders', 'Tables'],
            }),
            deleteOrder: builder.mutation<void, { id: string | number }>({
                query: ({ id }) => ({
                    method: 'DELETE',
                    url: `/orders/${id}`,
                }),
                invalidatesTags: ['Orders'],
            }),
        }),
    });

export const {
    useGetOrdersQuery,
    useGetOrderQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useDeactivateOrderMutation,
    useDeleteOrderMutation,
} = orderApi;
