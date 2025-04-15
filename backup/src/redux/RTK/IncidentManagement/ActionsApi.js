import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../../services/customFetchBaseQuery';

export const ActionsApi = createApi({
    reducerPath: 'searchIncidentMaster',
    baseQuery: customFetchBaseQuery({
        baseUrl: process.env.REACT_APP_BASE_URL,
      }),
      endpoints: (builder) => ({
        getPageLoadData: builder.query({
            query: ({ menuId,moduleId, loginUserId, headerFacilityId }) => {
              return {
                url: `/IncidentAction/PageLoadActionData/${moduleId}/${menuId}/${loginUserId}/${headerFacilityId}`,
              };
            },
          }),
          getActionPending: builder.query({
            query: ({ payload }) => ({
              url: '/IncidentAction/GetPendingActions',
              method: 'POST',
              body: payload,
            }),
            transformResponse: (response) => ({
              totalPages: response.Data.TotalPages,
              totalRecords: response.Data.TotalRecords,
              records: response.Data.Records,
            }),
            providesTags: () => [{ type: 'getActionPending' }],
          }),
          getActionApprovalPending: builder.query({
            query: ({ payload }) => ({
              url: '/IncidentAction/GetApprovalPendingActions',
              method: 'POST',
              body: payload,
            }),
            transformResponse: (response) => ({
              totalPages: response.Data.TotalPages,
              totalRecords: response.Data.TotalRecords,
              records: response.Data.Records,
            }),
            providesTags: () => [{ type: 'getActionApprovalPending' }],
          }),
          getActionCompleted: builder.query({
            query: ({ payload }) => ({
              url: '/IncidentAction/GetCompletedActions',
              method: 'POST',
              body: payload,
            }),
            transformResponse: (response) => ({
              totalPages: response.Data.TotalPages,
              totalRecords: response.Data.TotalRecords,
              records: response.Data.Records,
            }),
            providesTags: () => [{ type: 'getActionCompleted' }],
          }),
         
          getDownloadDataPendingAction: builder.mutation({
            query: ({ payload, downloadType }) => ({
              url: `/IncidentAction/DownloadDataPendingIncidentActions/${downloadType}`,
              method: 'POST',
              body: payload,
              responseHandler: (response) => response.blob(),
            }),
          }),
          getDownloadDataApprovalPendingAction: builder.mutation({
            query: ({ payload, downloadType }) => ({
              url: `/IncidentAction/DownloadDataApprovalPendingActions/${downloadType}`,
              method: 'POST',
              body: payload,
              responseHandler: (response) => response.blob(),
            }),
          }),
          getDownloadDataCompletedAction: builder.mutation({

            query: ({ payload, downloadType }) => ({
              url: `/IncidentAction/DownloadDataCompletedIncidentActions/${downloadType}`,
              method: 'GET',
              body: payload,
              responseHandler: (response) => response.blob(),
            }),
          }),

          ReassignAction: builder.mutation({
            query: ({ payload }) => ({
              url: '/IncidentAction/ReAssignIncidentActions',
              method: 'POST',
              body: payload,
            })
          }),
          getCompletedPrintAction: builder.mutation({

            query: ({ headerFacilityId, moduleId, actionId, loginUserId, menuId }) => ({
              url: `/IncidentAction/PrintIncidentActionById/${headerFacilityId}/${actionId}/${loginUserId}/${moduleId}/${menuId}`,
              method: 'POST',
            }),

          }),
        
          getRejectionHistoryById: builder.query({
            query: ({ menuId,moduleId, loginUserId, actionId }) => {
              return {
                url: `/IncidentAction/GetIncidentActionsRejectionHistoryById/${actionId}/${loginUserId}/${moduleId}/${menuId}`,
              };
            },
          }),
          getActionsAttachmentById: builder.query({
            query: ({ menuId,moduleId, loginUserId, actionId }) => {
              return {
                url: `/IncidentAction/GetIncidentActionsAttachmentById/${actionId}/${loginUserId}/${moduleId}/${menuId}`,
              };
            },
          }),

          UpdateCompleteActionStatus: builder.mutation({
            query: ({ formData }) => ({
              url: '/IncidentAction/UpdateCompleteActionStatus',
              method: 'POST',
              body: formData,
              formData: true, 
            }),
            invalidatesTags: () => [{ type: 'UpdateCompleteActionStatus' }],

          }),
          UpdateApproveRejectActionStatus: builder.mutation({
            query: ({ formData }) => ({
              url: '/IncidentAction/UpdateApproveRejectActionStatus',
              method: 'POST',
              body: formData,
              formData: true, 
            }),
            invalidatesTags: () => [{ type: 'UpdateApproveRejectActionStatus' }],

          }),

          
      }),
    });
export const {
    useGetPageLoadDataQuery,
    useGetActionPendingQuery,
    useGetActionApprovalPendingQuery,
    useGetActionCompletedQuery,
    useGetDownloadDataPendingActionMutation,
    useGetDownloadDataApprovalPendingActionMutation,
    useGetDownloadDataCompletedActionMutation,
    useGetCompletedPrintActionMutation,
    useReassignActionMutation,
    useGetRejectionHistoryByIdQuery,
    useGetActionsAttachmentByIdQuery,
    useUpdateCompleteActionStatusMutation,
    useUpdateApproveRejectActionStatusMutation,
  } = ActionsApi;
