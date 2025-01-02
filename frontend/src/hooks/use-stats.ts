import { useGetStatsQuery } from '@/redux/api/stats';

export const useStats = () => {
    const getStatsQuery = useGetStatsQuery();

    return {
        get: {
            data: getStatsQuery.data,
            isFetching: getStatsQuery.isFetching,
            isLoading: getStatsQuery.isLoading,
            isSuccess: getStatsQuery.isSuccess,
            isError: getStatsQuery.isError,
            errors: getStatsQuery.error,
        },
    };
};
