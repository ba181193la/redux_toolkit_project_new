import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../../services/customFetchBaseQuery';
import DeletedIncident from '../../../features/IncidentManagement/SearchIncident/DeletedIncident/DeletedIncident';

export const searchIncidentApi = createApi({
    reducerPath: 'searchIncidentApi',
    baseQuery: customFetchBaseQuery({
        baseUrl: process.env.REACT_APP_BASE_URL,
      }),
      endpoints: (builder) => ({
        getPageLoadData: builder.query({
            query: ({ menuId,moduleId, loginUserId, headerFacilityId }) => {
              return {
                url: `/SearchIncident/PageLoadData/${moduleId}/${menuId}/${loginUserId}/${headerFacilityId}`,
              };
            },
          }),
          getIncidentSubmitted: builder.query({
            query: ({ payload }) => ({
              url: '/SearchIncident/GetIncidentSubmitted',
              method: 'POST',
              body: payload,
            }),
            transformResponse: (response) => ({
              totalPages: response.Data.TotalPages,
              totalRecords: response.Data.TotalRecords,
              records: response.Data.Records,
            }),
            providesTags: () => [{ type: 'getIncidentSubmitted' }],
          }),
          getAllIncident: builder.query({
            query: ({ payload }) => ({
              url: '/SearchIncident/GetAllIncident',
              method: 'POST',
              body: payload,
            }),
            transformResponse: (response) => ({
              totalPages: response.Data.TotalPages,
              totalRecords: response.Data.TotalRecords,
              records: response.Data.Records,
            }),
            providesTags: () => [{ type: 'getAllIncident' }],
          }),
          getDeletedIncident: builder.query({
            query: ({ payload }) => ({
              url: '/SearchIncident/GetDeletedIncident',
              method: 'POST',
              body: payload,
            }),
            transformResponse: (response) => ({
              totalPages: response.Data.TotalPages,
              totalRecords: response.Data.TotalRecords,
              records: response.Data.Records,
            }),
            providesTags: () => [{ type: 'getDeletedIncident' }],
          }),
          getDownloadDataSearchIncidentSubmitted: builder.mutation({
            query: ({ payload, downloadType }) => ({
              url: `/SearchIncident/DownloadDataIncidentSubmitted/${downloadType}`,
              method: 'POST',
              body: payload,
              responseHandler: (response) => response.blob(),
            }),
          }),
          getDownloadDataSearchIncidentAllIncident: builder.mutation({
            query: ({ payload, downloadType }) => ({
              url: `/SearchIncident/DownloadDataAllIncident/${downloadType}`,
              method: 'POST',
              body: payload,
              responseHandler: (response) => response.blob(),
            }),
          }),
          getDownloadDataDelete: builder.mutation({
            query: ({ payload, downloadType }) => ({
              url: `/SearchIncident/DownloadDataDeletedIncident/${downloadType}`,
              method: 'POST',
              body: payload,
              responseHandler: (response) => response.blob(),
            }),
          }),
          getHistoryIncident: builder.query({
            query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
              url: `/SearchIncident/GetIncidentNotificationHistory/${moduleId}/${menuId}/${loginUserId}/${incidentId}`,
            }),
          }),
          getReportIncident: builder.query({
            query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
              url: `/ReportIncident/GetIncidentById/${incidentId}/${loginUserId}/${menuId}/${moduleId}`,
            }),
          }),
          getTabAccessRights: builder.query({
            query: ({ moduleId, facilityId, loginUserId, menuId }) => ({
              // url: `/SearchIncident/AllIncidentTabAccessRights/${moduleId}/${menuId}/${loginUserId}/${facilityId}`,
              url: `/SearchIncident/AllIncidentTabAccessRights/${menuId}/${moduleId}/${loginUserId}/${facilityId}`,
            }),
          }),
          sendReminderMail: builder.mutation({
            query: (payload) => ({
              url: '/SearchIncident/SendReminderMail',
              method: 'POST',
              body: payload,
              headers: {
                'Content-Type': 'application/json', 
              },
            }),
            invalidatesTags: () => [{ type: 'sendReminderMail' }],
          }),
          deleteIncident: builder.mutation({
            query: (payload) => ({
              url: '/SearchIncident/DeleteIncident',
              method: 'PUT',
              body: payload,
              headers: {
                'Content-Type': 'application/json', 
              },
            }),
            invalidatesTags: () => [{ type: 'deleteIncident' }],
          }),
          
          
      }),
    });
export const {
   useGetPageLoadDataQuery,
    useGetIncidentSubmittedQuery,
    useGetAllIncidentQuery,
    useGetDeletedIncidentQuery,
    useGetHistoryIncidentQuery,
    useGetReportIncidentQuery,
    useGetTabAccessRightsQuery,
    useGetDownloadDataSearchIncidentSubmittedMutation,
    useGetDownloadDataSearchIncidentAllIncidentMutation,
    useGetDownloadDataDeleteMutation,
    useSendReminderMailMutation,
    useDeleteIncidentMutation,
  } = searchIncidentApi;
