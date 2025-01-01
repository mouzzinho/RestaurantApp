import { useParams } from 'next/navigation';

import { useGetDishesQuery, useGetDishQuery, useCreateDishMutation, useUpdateDishMutation, useDeleteDishMutation } from '@/redux/api/dish';

export const useDish = (query?: 'single' | 'list') => {
    const params = useParams();
    const id = params && params.id && typeof params.id === 'string' ? params.id : '';

    const skipSingleQuery = query !== 'single' || !id;
    const skipListQuery = query !== 'list';

    const getDishQuery = useGetDishQuery({ id }, { skip: skipSingleQuery });
    const getDishesQuery = useGetDishesQuery(undefined, { skip: skipListQuery });
    const [create, createDishMutation] = useCreateDishMutation();
    const [update, updateDishMutation] = useUpdateDishMutation();
    const [deleteDish, deleteDishMutation] = useDeleteDishMutation();

    return {
        get: {
            data: getDishQuery.data,
            isFetching: getDishQuery.isFetching,
            isLoading: getDishQuery.isLoading,
            isSuccess: getDishQuery.isSuccess,
            isError: getDishQuery.isError,
            errors: getDishQuery.error,
        },
        dishes: {
            data: getDishesQuery.data,
            isFetching: getDishesQuery.isFetching,
            isLoading: getDishesQuery.isLoading,
            isSuccess: getDishesQuery.isSuccess,
            isError: getDishesQuery.isError,
            errors: getDishesQuery.error,
        },
        create: {
            fetch: create,
            data: createDishMutation.data,
            isLoading: createDishMutation.isLoading,
            isSuccess: createDishMutation.isSuccess,
            isError: createDishMutation.isError,
            errors: createDishMutation.error,
        },
        update: {
            fetch: update,
            data: updateDishMutation.data,
            isLoading: updateDishMutation.isLoading,
            isSuccess: updateDishMutation.isSuccess,
            isError: updateDishMutation.isError,
            errors: updateDishMutation.error,
        },
        deleteDish: {
            fetch: deleteDish,
            data: deleteDishMutation.data,
            isLoading: deleteDishMutation.isLoading,
            isSuccess: deleteDishMutation.isSuccess,
            isError: deleteDishMutation.isError,
            errors: deleteDishMutation.error,
        },
    };
};
