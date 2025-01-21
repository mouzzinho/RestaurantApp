import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';

import {
    useGetUserQuery,
    useGetUsersQuery,
    useGetUserAuthQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useChangePasswordMutation,
    useGetUserWorktimeQuery,
    useUpdateUserWorktimeMutation,
    useCreateUserWorktimeMutation,
} from '@/redux/api/user';
import { getUserTokenData } from '@/utils/getUserTokenData';
import { selectUserState } from '@/redux/slices/user.slice';

export const useUser = (query?: 'single' | 'list' | 'auth' | 'worktime', date?: { year: number; month: number }, userId?: string) => {
    const params = useParams();
    const id = userId ? userId : params && params.id && typeof params.id === 'string' ? params.id : '';
    const userState = useSelector(selectUserState);
    const tokenData = getUserTokenData();
    const isTokenExpired = tokenData?.isTokenExpired || false;
    const skipSingleQuery = query !== 'single' || !id;
    const skipListQuery = query !== 'list';
    const skipAuthQuery = query !== 'auth';
    const skipWorktimeQuery = query !== 'worktime' || !date;

    const getUserQuery = useGetUserQuery({ id }, { skip: skipSingleQuery });
    const getUsersQuery = useGetUsersQuery(undefined, { skip: skipListQuery });
    const getUserAuthQuery = useGetUserAuthQuery(undefined, { skip: skipAuthQuery });
    const getUserWorktimeQuery = useGetUserWorktimeQuery(
        { id, year: date ? date.year : '', month: date ? date.month : '' },
        { skip: skipWorktimeQuery },
    );

    const [create, createUserMutation] = useCreateUserMutation();
    const [createWorktime, createWorktimeMutation] = useCreateUserWorktimeMutation();
    const [update, updateUserMutation] = useUpdateUserMutation();
    const [updateWorktime, updateUserWorktimeMutation] = useUpdateUserWorktimeMutation();
    const [deleteUser, deleteUserMutation] = useDeleteUserMutation();
    const [login, loginUserMutation] = useLoginUserMutation();
    const [logout, logoutUserMutation] = useLogoutUserMutation();
    const [changePassword, changePasswordMutation] = useChangePasswordMutation();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if ((tokenData?.token && isTokenExpired) || getUserAuthQuery.error?.status === 401) {
            localStorage.removeItem('tokenData');
            window.location.reload();
        }
    }, [isTokenExpired, getUserAuthQuery]);

    return {
        ...userState,
        get: {
            data: getUserQuery.data,
            isFetching: getUserQuery.isFetching,
            isLoading: getUserQuery.isLoading,
            isSuccess: getUserQuery.isSuccess,
            isError: getUserQuery.isError,
            errors: getUserQuery.error,
        },
        users: {
            data: getUsersQuery.data,
            isFetching: getUsersQuery.isFetching,
            isLoading: getUsersQuery.isLoading,
            isSuccess: getUsersQuery.isSuccess,
            isError: getUsersQuery.isError,
            errors: getUsersQuery.error,
        },
        worktime: {
            data: getUserWorktimeQuery.data,
            isFetching: getUserWorktimeQuery.isFetching,
            isLoading: getUserWorktimeQuery.isLoading,
            isSuccess: getUserWorktimeQuery.isSuccess,
            isError: getUserWorktimeQuery.isError,
            errors: getUserWorktimeQuery.error,
        },
        getAuth: {
            data: getUserAuthQuery.data,
            isFetching: getUserAuthQuery.isFetching,
            isLoading: getUserAuthQuery.isLoading,
            isSuccess: getUserAuthQuery.isSuccess,
            isError: getUserAuthQuery.isError,
            errors: getUserAuthQuery.error,
        },
        create: {
            fetch: create,
            data: createUserMutation.data,
            isLoading: createUserMutation.isLoading,
            isSuccess: createUserMutation.isSuccess,
            isError: createUserMutation.isError,
            errors: createUserMutation.error,
        },
        createWorktime: {
            fetch: createWorktime,
            data: createWorktimeMutation.data,
            isLoading: createWorktimeMutation.isLoading,
            isSuccess: createWorktimeMutation.isSuccess,
            isError: createWorktimeMutation.isError,
            errors: createWorktimeMutation.error,
        },
        update: {
            fetch: update,
            data: updateUserMutation.data,
            isLoading: updateUserMutation.isLoading,
            isSuccess: updateUserMutation.isSuccess,
            isError: updateUserMutation.isError,
            errors: updateUserMutation.error,
        },
        updateWorktime: {
            fetch: updateWorktime,
            data: updateUserWorktimeMutation.data,
            isLoading: updateUserWorktimeMutation.isLoading,
            isSuccess: updateUserWorktimeMutation.isSuccess,
            isError: updateUserWorktimeMutation.isError,
            errors: updateUserWorktimeMutation.error,
        },
        deleteUser: {
            fetch: deleteUser,
            data: deleteUserMutation.data,
            isLoading: deleteUserMutation.isLoading,
            isSuccess: deleteUserMutation.isSuccess,
            isError: deleteUserMutation.isError,
            errors: deleteUserMutation.error,
        },
        login: {
            fetch: login,
            data: loginUserMutation.data,
            isLoading: loginUserMutation.isLoading,
            isSuccess: loginUserMutation.isSuccess,
            isError: loginUserMutation.isError,
            errors: loginUserMutation.error,
        },
        logout: {
            fetch: logout,
            data: logoutUserMutation.data,
            isLoading: logoutUserMutation.isLoading,
            isSuccess: logoutUserMutation.isSuccess,
            isError: logoutUserMutation.isError,
            errors: logoutUserMutation.error,
        },
        changePassword: {
            fetch: changePassword,
            data: changePasswordMutation.data,
            isLoading: changePasswordMutation.isLoading,
            isSuccess: changePasswordMutation.isSuccess,
            isError: changePasswordMutation.isError,
            errors: changePasswordMutation.error,
        },
    };
};
