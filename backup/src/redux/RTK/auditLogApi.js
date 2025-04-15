import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const auditLogApi = createApi({
  reducerPath: 'auditLogRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: ['getAuditLog','getUserSessionLog'],
  endpoints: (builder) => ({
    getAllAuditLogs: builder.query({
      query: ({ payload }) => ({
        url: '/AuditLog/GetAllAuditLog',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'getAuditLog' }],
    }),
    getAuditLogData: builder.query({
      query: ({ menuId, loginUserId, headerFacilityId }) => {
        return {
          url: `/AuditLog/PageLoadData/${menuId}/${loginUserId}/${headerFacilityId}`,
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
      providesTags: ['getAuditLog'],
    }),
    getAuditLogById: builder.query({
      query: ({ eventId, loginUserId }) => ({
        url: `/AuditLog/GetAuditLogById/${eventId}/${loginUserId}`,
      }),
    }),
    getUserSessionLog: builder.query({
      query: ({ payload }) => ({
        url: '/AuditLog/GetUserSessionLog',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data?.TotalPages,
        totalRecords: response.Data?.TotalRecords,
        records: response.Data?.Records,
      }),
      providesTags: () => [{ type: 'getUserSessionLog' }],
    }),
    downloadAuditLogListData: builder.mutation({
      query: ({ payload }) => ({
        url: '/AuditLog/DownloadData/excel',
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetAllAuditLogsQuery,
  useGetAuditLogDataQuery,
  useGetAllFacilityQuery,
  useGetAuditLogByIdQuery,
  useGetUserSessionLogQuery,
  useDownloadAuditLogListDataMutation,
} = auditLogApi;
