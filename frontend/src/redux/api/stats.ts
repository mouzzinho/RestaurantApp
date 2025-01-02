import restaurantApi from './base';
import { IStats } from '@/models/stats';

export const dishApi = restaurantApi.injectEndpoints({
    endpoints: (builder) => ({
        getStats: builder.query<IStats, void>({
            query: () => `/stats`,
        }),
    }),
});

export const { useGetStatsQuery } = dishApi;
