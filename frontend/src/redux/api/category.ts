import restaurantApi from './base';

import { ICategory } from '@/models/category';

export const categoryApi = restaurantApi
    .enhanceEndpoints({
        addTagTypes: ['Category', 'Categories'],
    })
    .injectEndpoints({
        endpoints: (builder) => ({
            getCategory: builder.query<ICategory, { id: string | number }>({
                query: ({ id }) => `/categories/${id}`,
                providesTags: ['Category'],
            }),
            getCategories: builder.query<ICategory[], void>({
                query: () => `/categories`,
                providesTags: ['Categories'],
            }),
            createCategory: builder.mutation<ICategory, ICategory>({
                query: (data) => ({
                    method: 'POST',
                    url: `/categories`,
                    body: data,
                }),
                invalidatesTags: ['Category', 'Categories'],
            }),
            updateCategory: builder.mutation<ICategory, { data: ICategory; id: number }>({
                query: ({ data, id }) => ({
                    method: 'PATCH',
                    url: `/categories/${id}`,
                    body: data,
                }),
                invalidatesTags: ['Category', 'Categories'],
            }),
            deleteCategory: builder.mutation<void, { id: string | number }>({
                query: ({ id }) => ({
                    method: 'DELETE',
                    url: `/categories/${id}`,
                }),
                invalidatesTags: ['Categories'],
            }),
        }),
    });

export const { useGetCategoriesQuery, useGetCategoryQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } =
    categoryApi;
