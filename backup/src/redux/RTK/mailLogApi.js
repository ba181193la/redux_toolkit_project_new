import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const mailLogApi = createApi({
  reducerPath: 'mailLogRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: ['getMailLog'],
  endpoints: (builder) => ({
    getAllMailLogs: builder.query({
      query: ({ payload }) => ({
        url: '/MailLog/GetAllMailLog',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'getMailLog' }],
    }),
    getMailLogData: builder.query({
      query: ({ menuId, loginUserId, headerFacilityId }) => {
        return {
          url: `/MailLog/PageLoadData/${menuId}/${loginUserId}/${headerFacilityId}`,
        };
      },
    }),
    getAllFacility: builder.query({
      query: ({ payload }) => ({
        url: '/Facility/GetAllFacility',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getMailLog'],
    }),
    downloadMailLogListData: builder.mutation({
      query: ({ payload }) => ({
        url: '/MailLog/DownloadData/excel',
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetAllMailLogsQuery,
  useGetMailLogDataQuery,
  useGetAllFacilityQuery,
  useDownloadMailLogListDataMutation,
} = mailLogApi;
