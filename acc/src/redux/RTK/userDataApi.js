import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const userDataApi = createApi({
  reducerPath: 'userData',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  endpoints: (builder) => ({
    getUserDetail: builder.query({
      query: ({ employeeID }) => {
        return { url: `/Login/getUserDetail/${employeeID}`, method: 'GET' };
      },
    }),
  }),
});

export const { useGetUserDetailQuery } = userDataApi;
