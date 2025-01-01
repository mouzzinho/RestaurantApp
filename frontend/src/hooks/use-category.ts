import { useParams } from 'next/navigation';

import {
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} from '@/redux/api/category';

export const useCategory = (query?: 'single' | 'list') => {
    const params = useParams();
    const id = params && params.id && typeof params.id === 'string' ? params.id : '';

    const skipSingleQuery = query !== 'single' || !id;
    const skipListQuery = query !== 'list';

    const getCategoryQuery = useGetCategoryQuery({ id }, { skip: skipSingleQuery });
    const getCategoriesQuery = useGetCategoriesQuery(undefined, { skip: skipListQuery });
    const [create, createCategoryMutation] = useCreateCategoryMutation();
    const [update, updateCategoryMutation] = useUpdateCategoryMutation();
    const [deleteCategory, deleteCategoryMutation] = useDeleteCategoryMutation();

    return {
        get: {
            data: getCategoryQuery.data,
            isFetching: getCategoryQuery.isFetching,
            isLoading: getCategoryQuery.isLoading,
            isSuccess: getCategoryQuery.isSuccess,
            isError: getCategoryQuery.isError,
            errors: getCategoryQuery.error,
        },
        categories: {
            data: getCategoriesQuery.data,
            isFetching: getCategoriesQuery.isFetching,
            isLoading: getCategoriesQuery.isLoading,
            isSuccess: getCategoriesQuery.isSuccess,
            isError: getCategoriesQuery.isError,
            errors: getCategoriesQuery.error,
        },
        create: {
            fetch: create,
            data: createCategoryMutation.data,
            isLoading: createCategoryMutation.isLoading,
            isSuccess: createCategoryMutation.isSuccess,
            isError: createCategoryMutation.isError,
            errors: createCategoryMutation.error,
        },
        update: {
            fetch: update,
            data: updateCategoryMutation.data,
            isLoading: updateCategoryMutation.isLoading,
            isSuccess: updateCategoryMutation.isSuccess,
            isError: updateCategoryMutation.isError,
            errors: updateCategoryMutation.error,
        },
        deleteCategory: {
            fetch: deleteCategory,
            data: deleteCategoryMutation.data,
            isLoading: deleteCategoryMutation.isLoading,
            isSuccess: deleteCategoryMutation.isSuccess,
            isError: deleteCategoryMutation.isError,
            errors: deleteCategoryMutation.error,
        },
    };
};
