import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../../services/customFetchBaseQuery';

export const incidentApprovalApi = createApi({
  reducerPath: 'incidentApprovalMaster',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  endpoints: (builder) => ({
    getPageLoadData: builder.query({
      query: ({ menuId, moduleId, loginUserId, headerFacilityId }) => {
        return {
          url: `/IncidentApproval/GetIncidentApprovalPageLoad/${menuId}/${loginUserId}/${moduleId}?HeaderFacilityId=${headerFacilityId}`,
        };
      },
    }),
    getIncidentApprovalPending: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentApproval/GetApprovalPending',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'getIncidentApprovalPending' }],
    }),
    getIncidentApprovalCompleted: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentApproval/GetApprovalCompleted',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'getIncidentApprovalCompleted' }],
    }),
    getIncidentApprovalRejected: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentApproval/GetApprovalRejected',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'getIncidentApprovalRejected' }],
    }),

    getDownloadDataApprovalPending: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentApproval/DownloadDataIncidentApprovalPending/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),

    getDownloadDataApprovalComplete: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentApproval/DownloadDataIncidentApprovalCompleted/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getDownloadDataApprovalReject: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentApproval/DownloadDataIncidentApprovalRejected/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getIncidentDetilsPendingById: builder.query({
      query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
        url: `/IncidentInvestigationApproval/GetIncidentApprovalDetailsById/${incidentId}/${loginUserId}/${menuId}`,
      }),
    }),

    getReportIncident: builder.query({
      query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
        url: `/ReportIncident/GetIncidentById/${incidentId}/${loginUserId}/${moduleId}/${menuId}`,
      }),
    }),

    getApprovalEntryData: builder.query({
      query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
        url: `/IncidentApproval/GetIncidentApprovalEntryData/${incidentId}/${loginUserId}/${moduleId}/${menuId}`,
      }),
    }),

    UpdateMergeIncident: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentApproval/MergeIncidentData',
        method: 'POST',
        body: payload,
      }),
    }),

    GetIncidentCategoryList: builder.mutation({
      query: (payload) => ({
        url: '/IncidentApproval/GetIncidentCategoryList',
        method: 'POST',
        body: payload,
      }),
    }),

    GetIncidentDetailsList: builder.query({
      query: (payload) => ({
        url: '/IncidentApproval/GetIncidentCategoryList',
        method: 'POST',
        body: payload,
      }),
    }),

    RejectIncident: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentApproval/IncidentApprovalRejection',
        method: 'POST',
        body: payload,
      }),
    }),
    RequestInformation: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentApproval/RequestMoreInformationIncident',
        method: 'POST',
        body: payload,
      }),
    }),

    SkipInvestigation: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentApproval/SkipInvestigation',
        method: 'POST',
        body: payload,
      }),
    }),
    FillRCA: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentApproval/FillRCA',
        method: 'POST',
        body: payload,
      }),
    }),
    getReportIncidentPageload: builder.query({
      query: ({ moduleId, headerFacilityId, loginUserId, menuId }) => ({
        url: `/ReportIncident/PageLoadData/${moduleId}/${menuId}/${loginUserId}/${headerFacilityId}`,
      }),
    }),

    AssignInvestigator: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentApproval/AssignInvestigator',
        method: 'POST',
        body: payload,
      }),
    }),

    Opinion: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentApproval/CreateRequestOpinion',
        method: 'POST',
        body: payload,
      }),
    }),

    ReassignInvestigators: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentApproval/ReassignInvestigators',
        method: 'POST',
        body: payload,
      }),
    }),

    getApprovalviewData: builder.query({
      query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
        url: `/IncidentApproval/GetIncidentApprovalViewData/${incidentId}/${loginUserId}/${moduleId}/${menuId}`,
      }),
    }),
  }),
});
export const {
  useGetPageLoadDataQuery,
  useGetIncidentApprovalPendingQuery,
  useGetIncidentApprovalCompletedQuery,
  useGetIncidentApprovalRejectedQuery,
  useGetDownloadDataApprovalPendingMutation,
  useGetDownloadDataApprovalCompleteMutation,
  useGetDownloadDataApprovalRejectMutation,
  useGetIncidentDetilsPendingByIdQuery,
  useGetReportIncidentQuery,
  useGetApprovalEntryDataQuery,
  useUpdateMergeIncidentMutation,
  useRejectIncidentMutation,
  useRequestInformationMutation,
  useSkipInvestigationMutation,
  useFillRCAMutation,
  useGetReportIncidentPageloadQuery,
  useAssignInvestigatorMutation,
  useOpinionMutation,
  useReassignInvestigatorsMutation,
  useGetApprovalviewDataQuery,
  useGetIncidentCategoryListMutation,
  useGetIncidentDetailsListQuery,
  useLazyGetIncidentDetailsListQuery,
} = incidentApprovalApi;
