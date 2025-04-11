
import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../../services/customFetchBaseQuery';

export const customDashboardApi = createApi({
  reducerPath: 'CustomDashboardMasters',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  endpoints: (builder) => ({
    getPageLoadData: builder.query({
      query: ({ menuId,moduleId, loginUserId, facilityId }) => {
        return {
          url: `/IncidentCustomDashboard/PageLoadActionData/${moduleId}/${menuId}/${loginUserId}/${facilityId}`,
        };
      },
    }),
    createCustomDashboard: builder.mutation({
        query: ( payload ) => ({
          url: '/IncidentCustomDashboard/CreateCustomDashboard',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: () => [{ type: 'createCustomDashboard' }],
      }),
      getCustomDashboard: builder.mutation({
        query: ( payload ) => ({
          url: '/IncidentCustomDashboard/GetCustomDashboard',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: () => [{ type: 'getCustomDashboard' }],
      }),
      getCustomDashboardReports: builder.mutation({
        query: ( payload ) => ({
          url: '/IncidentCustomDashboard/GetCustomDashboardReports',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: () => [{ type: 'getCustomDashboardReports' }],
      }),
      saveCustomDashboardDetails: builder.mutation({
        query: ( payload ) => ({
          url: '/IncidentCustomDashboard/SaveCustomDashboardDetails',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: () => [{ type: 'saveCustomDashboardDetails' }],
      }),
      deleteCustomDashboardDetailsById: builder.mutation({
        query: ({ menuId, loginUserId,customDashboardDetailsId }) => ({
      
            url: `/IncidentCustomDashboard/DeleteCustomDashboardDetailsById/${customDashboardDetailsId}/${loginUserId}/${menuId}`,
            method: 'DELETE',
          
        }),
        invalidatesTags: ['deleteCustomDashboardDetailsById'],
      }),
      deleteCustomDashboardById: builder.mutation({
        query: ({ menuId, loginUserId,customDashboardId }) => ({
      
            url: `/IncidentCustomDashboard/DeleteCustomDashboardById/${customDashboardId}/${loginUserId}/${menuId}`,
            method: 'DELETE',
          
        }),
        invalidatesTags: ['deleteCustomDashboardById'],
      }),
     
     
    }),

  });

export const {
  useGetPageLoadDataQuery,
  useCreateCustomDashboardMutation,
  useGetCustomDashboardMutation,
  useGetCustomDashboardReportsMutation,
  useSaveCustomDashboardDetailsMutation,
  useDeleteCustomDashboardDetailsByIdMutation,
  useDeleteCustomDashboardByIdMutation
  
} = customDashboardApi;
