
import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const incidentInvestigationApi = createApi({
  reducerPath: 'incidentInvestigationMasters',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  endpoints: (builder) => ({

    getPageLoadData: builder.query({
      query: ({ menuId, moduleId, loginUserId, headerFacilityId }) => {
        return {
          url: `/IncidentInvestigation/PageLoadData/${moduleId}/${menuId}/${loginUserId}/${headerFacilityId}`,
        };
      },
    }),
    getIncidentInvestigationPending: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentInvestigation/GetIncidentInvestigationPending',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'getIncidentInvestigationPending' }],
    }),
    getIncidentInvestigationCompleted: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentInvestigation/GetIncidentInvestigationCompleted',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'getIncidentInvestigationcompleted' }],
    }),
    getIncidentInvestigationRejected: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentInvestigation/GetIncidentInvestigationRejected',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'getIncidentInvestigationRejected' }],
    }),
    getDownloadDataInvestigationPending: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentInvestigation/DownloadDataInvestigationPending/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getDownloadDataInvestigationComplete: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentInvestigation/DownloadDataInvestigationComplete/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getDownloadDataInvestigationReject: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentInvestigation/DownloadDataInvestigationReject/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getReportCustomize: builder.mutation({
      query: ({ payload }) => ({
        url: `/IncidentSubMaster/GetReportCustomize`,
        method: 'POST',
        body: payload,
      }),
      
      providesTags: () => [{ type: 'getReportCustomize' }],

    }),
    getIncidentDetailsPendingById: builder.query({
      query: ({ moduleId, incidentId, loginUserId, menuId, IsDeletedIncident = false }) => ({
        url: `/ReportIncident/GetIncidentById/${incidentId}/${loginUserId}/${moduleId}/${menuId}?IsDeletedIncident=${Boolean(IsDeletedIncident)}`,
      }),
    }),
    
    getIncidentDetailsCompletedById: builder.query({
      query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
        url: `/ReportIncident/GetIncidentById/${incidentId}/${loginUserId}/${menuId}/${moduleId}`,
      }),
    }),
    getIncidentDetailsRejectedById: builder.query({
      query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
        url: `/ReportIncident/GetIncidentById/${incidentId}/${loginUserId}/${menuId}/${moduleId}`,
      }),
    }),
    getIncidentApprovalPendingById: builder.query({
      query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
        url: `/IncidentApproval/GetIncidentApprovalViewData/${incidentId}/${loginUserId}/${menuId}/${moduleId}`,
      }),
    }),
    getIncidentApprovalCompletedById: builder.query({
      query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
        url: `/IncidentApproval/GetIncidentApprovalViewData/${incidentId}/${loginUserId}/${menuId}/${moduleId}`,
      }),
    }),
    getIncidentApprovalRejectedById: builder.query({
      query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
        url: `/IncidentApproval/GetIncidentApprovalViewData/${incidentId}/${loginUserId}/${menuId}/${moduleId}`,
      }),
    }),
    getIncidentInvestigationPendingById: builder.query({
      query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
        url: `/IncidentInvestigation/GetIncidentInvestigationPendingById/${incidentId}/${loginUserId}/${menuId}`,
      }),
    }),
    getIncidentInvestigationCompletedById: builder.query({
      query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
        url: `/IncidentInvestigation/GetIncidentInvestigationPendingById/${incidentId}/${loginUserId}/${menuId}`,
      }),
    }),
    getIncidentInvestigationRejectedById: builder.query({
      query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
        url: `/IncidentInvestigation/GetIncidentInvestigationPendingById/${incidentId}/${loginUserId}/${menuId}`,
      }),
    }),
    getAttachmentDownload: builder.query({
      query: ({ AutogenFileURL, OriginalFileName }) => ({
        url: `/ReportIncident/AttachmentDownload/${encodeURIComponent(AutogenFileURL)}/${encodeURIComponent(OriginalFileName)}?AutogenFileURL=${encodeURIComponent(AutogenFileURL)}`,
      }),
      responseHandler: (response) => response.blob(),
    }),
    
    updateIncidentInvestigation: builder.mutation({
      query: (formData) => ({
        url: '/IncidentInvestigation/UpdateIncidentInvestigation',
        method: 'POST',
        body: formData,
        // formData: true, 
      }),
      invalidatesTags: () => [{ type: 'updateIncidentInvestigation' }],
    }),
    createRequestOpinion: builder.mutation({
      query: ( payload ) => ({
        url: '/IncidentInvestigation/CreateRequestOpinion',
        method: 'POST',
        body: payload,
      }),

      invalidatesTags: () => [{ type: 'createRequestOpinion' }],
    }),

    getDefinition: builder.query({
      query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
        url: `/ReportIncident/GetIncidentById/${incidentId}/${loginUserId}/${menuId}/${moduleId}`,
      }),
    }),

    createRejectInvestigation: builder.mutation({
      query: ( payload ) => ({
        url: '/IncidentInvestigation/IncidentInvestigation/ UpdateRejectInvestigation',
        method: 'PUT',
        body: payload,
      }),

      invalidatesTags: () => [{ type: 'createRejectInvestigation' }],
    }),

    createReAssignOpinion: builder.mutation({
      query: ( payload ) => ({
        url: '/IncidentInvestigation/CreateReassignOpinion',
        method: 'POST',
        body: payload,
      }),

      invalidatesTags: () => [{ type: 'createReAssignOpinion' }],
    }),

    getRejectionHistory: builder.query({
      query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
        url: `/IncidentInvestigation/GetRejectionHistory/${incidentId}/${loginUserId}/${menuId}`,
      }),
    }),

  }),
});
export const {
  useGetPageLoadDataQuery,
  useGetIncidentInvestigationPendingQuery,
  useGetIncidentInvestigationCompletedQuery,
  useGetIncidentInvestigationRejectedQuery,
  useGetDownloadDataInvestigationPendingMutation,
  useGetDownloadDataInvestigationCompleteMutation,
  useGetDownloadDataInvestigationRejectMutation,
  useGetIncidentDetailsPendingByIdQuery,
  useGetIncidentDetailsCompletedByIdQuery,
  useGetIncidentDetailsRejectedByIdQuery,
  useGetIncidentApprovalPendingByIdQuery,
  useGetIncidentApprovalCompletedByIdQuery,
  useGetIncidentApprovalRejectedByIdQuery,
  useGetIncidentInvestigationPendingByIdQuery,
  useGetIncidentInvestigationCompletedByIdQuery,
  useGetIncidentInvestigationRejectedByIdQuery,
  useGetDefinitionQuery,
  useGetRejectionHistoryQuery,
  useGetAttachmentDownloadQuery,
  useUpdateIncidentInvestigationMutation,
  useCreateRequestOpinionMutation,
  useCreateRejectInvestigationMutation,
  useCreateReAssignOpinionMutation,
  useGetReportCustomizeMutation,
} = incidentInvestigationApi;
