import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../../services/customFetchBaseQuery';

export const reportIncidentApi = createApi({
  reducerPath: 'reportIncidentRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: ['getSavedIncidents'],
  endpoints: (builder) => ({
    getReportPageLoadData: builder.query({
      query: ({ moduleId, menuId, loginUserId, facilityId }) => ({
        url: `/ReportIncident/PageLoadData/${moduleId}/${menuId}/${loginUserId}/${facilityId}`,
      }),
    }),
    getIncidentById: builder.query({
      query: ({ incidentId, moduleId, menuId, loginUserId }) => {
        return {
          url: `/ReportIncident/GetIncidentById/${incidentId}/${loginUserId}/${moduleId}/${menuId}`,
        };
      },
    }),

    addReport: builder.mutation({
      query: ({ payload }) => {
        return {
          url: '/ReportIncident/CreateReportIncident',
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags: [{ type: 'getReport' }],
    }),

    updateReport: builder.mutation({
      query: ({ payload }) => {

        return {
          url: '/ReportIncident/UpdateReportIncident',
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags: [{ type: 'getReport' }],
    }),

    deleteReport: builder.mutation({
      query: ({ incidentId, loginUserId, menuId }) => ({
        url: `/ReportIncident/${incidentId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'getReport' }],
    }),

    getSavedIncidents: builder.query({
      query: ({ payload }) => ({
        url: '/ReportIncident/GetSavedIncidents',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'getSavedIncidents' }],
    }),
  }),
});

export const {
  useGetReportPageLoadDataQuery,
  useGetSavedIncidentsQuery,
  useGetIncidentByIdQuery,
  useAddReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation
} = reportIncidentApi;
