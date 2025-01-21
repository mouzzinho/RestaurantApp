import restaurantApi from './base';

import { TLoginFormValues } from '@/forms/login.form';
import { IUser, IUserWorktime } from '@/models/user';
import { ITokenData } from '@/models/token-data';
import { IPasswordChangeValues } from '@/components/organizms/password-form';

export const userApi = restaurantApi
    .enhanceEndpoints({
        addTagTypes: ['User', 'Users', 'Worktime'],
    })
    .injectEndpoints({
        endpoints: (builder) => ({
            getUser: builder.query<IUser, { id: string | number }>({
                query: ({ id }) => `/users/${id}`,
            }),
            getUsers: builder.query<IUser[], void>({
                query: () => `/users`,
                providesTags: ['Users'],
            }),
            getUserWorktime: builder.query<IUserWorktime[], { id: string | number; year?: number | string; month?: number | string }>({
                query: ({ id, year, month }) => `/users/${id}/worktime?year=${year}&month=${month}`,
                providesTags: ['Worktime'],
            }),
            createUser: builder.mutation<IUser, IUser>({
                query: (data) => ({
                    method: 'POST',
                    url: `/users`,
                    body: data,
                }),
                invalidatesTags: ['User', 'Users'],
            }),
            createUserWorktime: builder.mutation<void, IUserWorktime>({
                query: (data) => ({
                    method: 'POST',
                    url: `/users/${data.user_id}/worktime`,
                    body: data,
                }),
                invalidatesTags: ['Worktime'],
            }),
            updateUser: builder.mutation<IUser, { data: IUser; id: number }>({
                query: ({ data, id }) => ({
                    method: 'PATCH',
                    url: `/users/${id}`,
                    body: data,
                }),
                invalidatesTags: ['User', 'Users'],
            }),
            updateUserWorktime: builder.mutation<void, IUserWorktime>({
                query: (data) => ({
                    method: 'PATCH',
                    url: `/users/${data.user_id}/worktime/${data.id}`,
                    body: data,
                }),
                invalidatesTags: ['Worktime'],
            }),
            deleteUser: builder.mutation<void, { id: string | number }>({
                query: ({ id }) => ({
                    method: 'DELETE',
                    url: `/users/${id}`,
                }),
                invalidatesTags: ['Users'],
            }),
            getUserAuth: builder.query<IUser, void>({
                query: () => `/auth/user`,
            }),
            loginUser: builder.mutation<ITokenData, TLoginFormValues>({
                query: (data) => ({
                    method: 'POST',
                    url: `/auth/login`,
                    body: data,
                }),
            }),
            logoutUser: builder.mutation<void, void>({
                query: () => ({
                    method: 'POST',
                    url: '/auth/logout',
                }),
            }),
            changePassword: builder.mutation<void, IPasswordChangeValues>({
                query: (data) => ({
                    method: 'POST',
                    url: '/auth/change-password',
                    body: data,
                }),
            }),
        }),
    });

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useGetUserAuthQuery,
    useGetUserWorktimeQuery,
    useCreateUserMutation,
    useCreateUserWorktimeMutation,
    useUpdateUserMutation,
    useUpdateUserWorktimeMutation,
    useDeleteUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useChangePasswordMutation,
} = userApi;
