import { useParams } from 'next/navigation';

import {
    useGetIngredientsQuery,
    useGetIngredientQuery,
    useCreateIngredientMutation,
    useUpdateIngredientMutation,
    useDeleteIngredientMutation,
} from '@/redux/api/ingredient';

export const useIngredient = (query?: 'single' | 'list') => {
    const params = useParams();
    const id = params && params.id && typeof params.id === 'string' ? params.id : '';

    const skipSingleQuery = query !== 'single' || !id;
    const skipListQuery = query !== 'list';

    const getIngredientQuery = useGetIngredientQuery({ id }, { skip: skipSingleQuery });
    const getIngredientsQuery = useGetIngredientsQuery(undefined, { skip: skipListQuery });
    const [create, createIngredientMutation] = useCreateIngredientMutation();
    const [update, updateIngredientMutation] = useUpdateIngredientMutation();
    const [deleteIngredient, deleteIngredientMutation] = useDeleteIngredientMutation();

    return {
        get: {
            data: getIngredientQuery.data,
            isFetching: getIngredientQuery.isFetching,
            isLoading: getIngredientQuery.isLoading,
            isSuccess: getIngredientQuery.isSuccess,
            isError: getIngredientQuery.isError,
            errors: getIngredientQuery.error,
        },
        ingredients: {
            data: getIngredientsQuery.data,
            isFetching: getIngredientsQuery.isFetching,
            isLoading: getIngredientsQuery.isLoading,
            isSuccess: getIngredientsQuery.isSuccess,
            isError: getIngredientsQuery.isError,
            errors: getIngredientsQuery.error,
        },
        create: {
            fetch: create,
            data: createIngredientMutation.data,
            isLoading: createIngredientMutation.isLoading,
            isSuccess: createIngredientMutation.isSuccess,
            isError: createIngredientMutation.isError,
            errors: createIngredientMutation.error,
        },
        update: {
            fetch: update,
            data: updateIngredientMutation.data,
            isLoading: updateIngredientMutation.isLoading,
            isSuccess: updateIngredientMutation.isSuccess,
            isError: updateIngredientMutation.isError,
            errors: updateIngredientMutation.error,
        },
        deleteIngredient: {
            fetch: deleteIngredient,
            data: deleteIngredientMutation.data,
            isLoading: deleteIngredientMutation.isLoading,
            isSuccess: deleteIngredientMutation.isSuccess,
            isError: deleteIngredientMutation.isError,
            errors: deleteIngredientMutation.error,
        },
    };
};
