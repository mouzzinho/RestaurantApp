import restaurantApi from './base';

import { IDish, IDishMutation } from '@/models/dish';

export const dishApi = restaurantApi
    .enhanceEndpoints({
        addTagTypes: ['Dish', 'Dishes'],
    })
    .injectEndpoints({
        endpoints: (builder) => ({
            getDish: builder.query<IDish, { id: string | number }>({
                query: ({ id }) => `/dishes/${id}`,
                providesTags: ['Dish'],
            }),
            getDishes: builder.query<IDish[], void>({
                query: () => `/dishes`,
                providesTags: ['Dishes'],
            }),
            createDish: builder.mutation<IDish, IDishMutation>({
                query: (data) => ({
                    method: 'POST',
                    url: `/dishes`,
                    body: data,
                }),
                invalidatesTags: ['Dish', 'Dishes'],
            }),
            updateDish: builder.mutation<IDish, { data: IDishMutation; id: number }>({
                query: ({ data, id }) => ({
                    method: 'PATCH',
                    url: `/dishes/${id}`,
                    body: data,
                }),
                invalidatesTags: ['Dish', 'Dishes'],
            }),
            deleteDish: builder.mutation<void, { id: string | number }>({
                query: ({ id }) => ({
                    method: 'DELETE',
                    url: `/dishes/${id}`,
                }),
                invalidatesTags: ['Dishes'],
            }),
        }),
    });

export const { useGetDishesQuery, useGetDishQuery, useCreateDishMutation, useUpdateDishMutation, useDeleteDishMutation } = dishApi;
