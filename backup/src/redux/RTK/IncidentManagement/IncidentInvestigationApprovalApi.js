import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../../services/customFetchBaseQuery';

export const incidentInvestigationApprovalApi = createApi({
  reducerPath: 'incidentInvestigationApprovalRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: [''],
  endpoints: (builder) => ({
    // Get page load data
    getPageLoadData: builder.query({
      query: ({ moduleId, menuId, loginUserId, facilityId }) => ({
        url: `/IncidentInvestigationApproval/PageLoadData/${moduleId}/${menuId}/${loginUserId}/${facilityId}`,
      }),
      transformResponse: (response) => ({
        Records: response.Data,
      }),
    }),

    // pending tab api queries

    getPendingList: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentInvestigationApproval/GetIncidentInvestigationApprovalPending',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getPendingList'],
    }),

    updateInvesigationApproval: builder.mutation({
      query: ({
        incidentId,
        loginUserId,
        moduleId,
        menuId,
        approverStatus,
        approverRemarks,
      }) => ({
        url: `/IncidentInvestigationApproval/UpdateIncidentInvestigationApproval?incidentId=${incidentId}&loginUserId=${loginUserId}&moduleId=${moduleId}&menuId=${menuId}&approverStatus=${approverStatus}&approverRemarks=${approverRemarks}`,
        method: 'PUT',
      }),
    }),

    downloadPendingList: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentInvestigationApproval/DownloadInvestigationApprovalPending/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Completed tab api queries
    getCompletedList: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentInvestigationApproval/GetIncidentInvestigationApprovalCompleted',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getCompletedList'],
    }),

    getApprovalDetailsById: builder.query({
      query: ({ incidentId, loginUserId, menuId }) => {
        return {
          url: `/IncidentInvestigationApproval/GetIncidentInvestigationApprovalDetailsById/${incidentId}/${loginUserId}/${menuId}`,
        };
      },
      providesTags: (result, error, incidentId) => [
        {
          type: 'getApprovalDetailsById',
          id: incidentId?.toString(),
        },
      ],
    }),

    downloadCompletedList: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentInvestigationApproval/DownloadInvestigationApprovalCompleted/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetPageLoadDataQuery,

  useGetPendingListQuery,
  useUpdateInvesigationApprovalMutation,
  useDownloadPendingListMutation,

  useGetCompletedListQuery,
  useGetApprovalDetailsByIdQuery,
  useDownloadCompletedListMutation,
} = incidentInvestigationApprovalApi;
