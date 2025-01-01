import { useParams } from 'next/navigation';

import {
    useGetOrdersQuery,
    useGetOrderQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
    useDeactivateOrderMutation,
} from '@/redux/api/order';
import { selectOrderState, setOrderDishes } from '@/redux/slices/order.slice';
import { useDispatch, useSelector } from '@/redux/hooks';

export const useOrder = (query?: 'single' | 'list') => {
    const params = useParams();
    const id = params && params.id && typeof params.id === 'string' ? params.id : '';
    const dispatch = useDispatch();
    const orderState = useSelector(selectOrderState);

    const skipSingleQuery = query !== 'single' || !id;
    const skipListQuery = query !== 'list';

    const getOrderQuery = useGetOrderQuery({ id }, { skip: skipSingleQuery });
    const getOrdersQuery = useGetOrdersQuery(undefined, { skip: skipListQuery });
    const [create, createOrderMutation] = useCreateOrderMutation();
    const [update, updateOrderMutation] = useUpdateOrderMutation();
    const [deactivate, deactivateOrderMutation] = useDeactivateOrderMutation();
    const [deleteOrder, deleteOrderMutation] = useDeleteOrderMutation();

    return {
        ...orderState,
        get: {
            data: getOrderQuery.data,
            isFetching: getOrderQuery.isFetching,
            isLoading: getOrderQuery.isLoading,
            isSuccess: getOrderQuery.isSuccess,
            isError: getOrderQuery.isError,
            errors: getOrderQuery.error,
        },
        orders: {
            data: getOrdersQuery.data,
            isFetching: getOrdersQuery.isFetching,
            isLoading: getOrdersQuery.isLoading,
            isSuccess: getOrdersQuery.isSuccess,
            isError: getOrdersQuery.isError,
            errors: getOrdersQuery.error,
        },
        create: {
            fetch: create,
            data: createOrderMutation.data,
            isLoading: createOrderMutation.isLoading,
            isSuccess: createOrderMutation.isSuccess,
            isError: createOrderMutation.isError,
            errors: createOrderMutation.error,
        },
        update: {
            fetch: update,
            data: updateOrderMutation.data,
            isLoading: updateOrderMutation.isLoading,
            isSuccess: updateOrderMutation.isSuccess,
            isError: updateOrderMutation.isError,
            errors: updateOrderMutation.error,
        },
        deactivate: {
            fetch: deactivate,
            data: deactivateOrderMutation.data,
            isLoading: deactivateOrderMutation.isLoading,
            isSuccess: deactivateOrderMutation.isSuccess,
            isError: deactivateOrderMutation.isError,
            errors: deactivateOrderMutation.error,
        },
        deleteOrder: {
            fetch: deleteOrder,
            data: deleteOrderMutation.data,
            isLoading: deleteOrderMutation.isLoading,
            isSuccess: deleteOrderMutation.isSuccess,
            isError: deleteOrderMutation.isError,
            errors: deleteOrderMutation.error,
        },
        setOrderDishes: (arg: Parameters<typeof setOrderDishes>[0]) => {
            dispatch(setOrderDishes(arg));
        },
    };
};
