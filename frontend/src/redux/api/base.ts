import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getUserTokenData } from '@/utils/getUserTokenData';

const restaurantApi = createApi({
    reducerPath: 'restaurantApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = getUserTokenData();
            headers.set('Accept', 'application/json');
            headers.set('Content-Type', 'application/json');
            headers.set('Authorization', `Bearer ${token?.token}`);
            return headers;
        },
    }),
    endpoints: () => ({}),
});

export default restaurantApi;
