
import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../../services/customFetchBaseQuery';

export const CustomReportsApi = createApi({
  reducerPath: 'CustomReportsMasters',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  endpoints: (builder) => ({
    getPageLoadData: builder.query({
      query: ({ menuId, moduleId, loginUserId, facilityId }) => {
        return {
          url: `/IncidentCustomReport/PageLoadData/${moduleId}/${menuId}/${loginUserId}/${facilityId}`,
        };
      },
    }),
   createReportName: builder.mutation({
        query: ( payload ) => ({
          url: '/IncidentCustomReport/CreateReportName',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: () => [{ type: 'createReportName' }],
      }),
      getReportDetails: builder.mutation({
        query: ( payload ) => ({
          url: '/IncidentCustomReport/GetReportDetails',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: () => [{ type: 'getReportDetails' }],
      }),
      submitReportFields: builder.mutation({
        query: ( payload ) => ({
          url: '/IncidentCustomReport/SubmitReportFields',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: () => [{ type: 'submitReportFields' }],
      }),
      generateExcelReport: builder.mutation({
        query: ( payload ) => ({
          url: `/IncidentCustomReport/GenerateExcelReport`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: () => [{ type: 'generateExcelReport' }],
      }),
    }),

  });

export const {
  useGetPageLoadDataQuery,
  useCreateReportNameMutation,
  useGetReportDetailsMutation,
  useSubmitReportFieldsMutation,
  useGenerateExcelReportMutation,
  
} = CustomReportsApi;
