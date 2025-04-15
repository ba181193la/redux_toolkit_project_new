
import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../../services/customFetchBaseQuery';

export const incidentDashboardApi = createApi({
  reducerPath: 'IncidentDashboardFilterMasters',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  endpoints: (builder) => ({
    getPageLoadData: builder.query({
      query: ({ menuId,moduleId, loginUserId, headerFacilityId }) => {
        return {
          url: `/IncidentDashboard/PageLoadActionData/${moduleId}/${menuId}/${loginUserId}/${headerFacilityId}`,
        };
      },
    }),

    generateIncidentDashBoardFilterReport: builder.mutation({
        query: ( payload ) => ({
          url: '/IncidentDashboard/GenerateIncidentDashBoardFilterReport',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: () => [{ type: 'generateIncidentDashBoardFilterReport' }],
      }),
      getIncidentDetails: builder.mutation({
        query: ( payload ) => ({
          url: '/IncidentDashboard/GetIncidentDetails',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: () => [{ type: 'getIncidentDetails' }],
      }),
      downloadDashboardFilterReports: builder.mutation({
        query: ({ payload, downloadType }) => ({
          url: `/IncidentDashboard/DownloadDashboardFilterReports/${downloadType}`,
          method: 'POST',
          body: payload,
          responseHandler: (response) => response.blob(),
        }),
      }),
    }),

  });

export const {
  useGetPageLoadDataQuery,
  useGenerateIncidentDashBoardFilterReportMutation,
  useGetIncidentDetailsMutation,
  useDownloadDashboardFilterReportsMutation
  
} = incidentDashboardApi;
