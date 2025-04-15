import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const adMasterApi = createApi({
  reducerPath: 'adMasterRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: ['getADConfiguration'],
  endpoints: (builder) => ({
    getADConfigurationDetails: builder.query({
      query: ({ payload }) => ({
        url: '/ADConfiguration/GetADConfiguration',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        Records: response.Data,
      }),
      providesTags: (result, error, payload) => [
        { type: 'getADConfiguration' },
      ],
    }),

    getStaffDetails: builder.query({
      query: ({ payload }) => ({
        url: '/Staff/GetAllStaff',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: (result, error, payload) => [
        { type: 'getPasswordManagement' },
      ],
    }),

    addADConfiguration: builder.mutation({
      query: ({ payload }) => ({
        url: '/ADConfiguration/CreateADConfigruation',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['getADConfiguration'],
    }),

    updateADConfiguration: builder.mutation({
      query: ({ payload }) => ({
        url: '/ADConfiguration/UpdateADConfiguration',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['getADConfiguration'],
    }),
  }),
});

export const {
  useGetADConfigurationDetailsQuery,
  useGetStaffDetailsQuery,
  useAddADConfigurationMutation,
  useUpdateADConfigurationMutation,
} = adMasterApi;
