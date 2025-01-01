import restaurantApi from './base';

import { IIngredient } from '@/models/ingredient';

export const ingredientApi = restaurantApi
    .enhanceEndpoints({
        addTagTypes: ['Ingredient', 'Ingredients'],
    })
    .injectEndpoints({
        endpoints: (builder) => ({
            getIngredient: builder.query<IIngredient, { id: string | number }>({
                query: ({ id }) => `/ingredients/${id}`,
                providesTags: ['Ingredient'],
            }),
            getIngredients: builder.query<IIngredient[], void>({
                query: () => `/ingredients`,
                providesTags: ['Ingredients'],
            }),
            createIngredient: builder.mutation<IIngredient, IIngredient>({
                query: (data) => ({
                    method: 'POST',
                    url: `/ingredients`,
                    body: data,
                }),
                invalidatesTags: ['Ingredient', 'Ingredients'],
            }),
            updateIngredient: builder.mutation<IIngredient, { data: IIngredient; id: number }>({
                query: ({ data, id }) => ({
                    method: 'PATCH',
                    url: `/ingredients/${id}`,
                    body: data,
                }),
                invalidatesTags: ['Ingredient', 'Ingredients'],
            }),
            deleteIngredient: builder.mutation<void, { id: string | number }>({
                query: ({ id }) => ({
                    method: 'DELETE',
                    url: `/ingredients/${id}`,
                }),
                invalidatesTags: ['Ingredients'],
            }),
        }),
    });

export const {
    useGetIngredientsQuery,
    useGetIngredientQuery,
    useCreateIngredientMutation,
    useUpdateIngredientMutation,
    useDeleteIngredientMutation,
} = ingredientApi;
