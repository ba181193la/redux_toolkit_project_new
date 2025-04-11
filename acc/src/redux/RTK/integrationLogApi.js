import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const integrationLogApi = createApi({
  reducerPath: 'integrationLogRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  endpoints: (builder) => ({
    getAllIntegrationLogs: builder.query({
      query: ({ payload }) => ({
        url: '/V1V2Integration/GetAllIntegrationLog',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
    }),
    downloadIntegrationLogListData: builder.mutation({
      query: ({ payload }) => ({
        url: '/V1V2Integration/DownloadData/excel',
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetAllIntegrationLogsQuery,
  useDownloadIntegrationLogListDataMutation,
} = integrationLogApi;
