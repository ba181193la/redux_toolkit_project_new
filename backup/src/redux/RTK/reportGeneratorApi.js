import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';
 
export const reportGeneratorApi = createApi({
  reducerPath: 'reportGeneratorRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: 'https://tagstationery.travelport.online/api/',
  }),
  tagTypes: ['getAllStaff', 'getStaffUnlock'],
  endpoints: (builder) => ({
    getReportDetails: builder.query({
      query: ({ payload }) => ({
        url: '/ReportGenerator/GetAllReportGenerators',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: (result, error, payload) => [{ type: 'getAllReports' }],
    }),
    getAllModuleList: builder.query({
      query: ({ payload }) => ({
        url: '/api/PageUtilities/GetAllModuleList',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: (result, error, payload) => [{ type: 'getAllModuleList' }],
    }),
    getAllMenuList: builder.query({
      query: ({ payload }) => ({
        url: '/PageUtilities/GetAllMenuList',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: (result, error, payload) => [{ type: 'getAllModuleList' }],
    }),
    getStaffDetails: builder.query({
      query: ({ payload }) => ({
        url: '/Staff/GetAllStaff',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: (result, error, payload) => [{ type: 'getAllStaff' }],
    }),
    getModuleList: builder.query({
      query: ({ payload }) => ({
        url: '/PageUtilities/GetAllModuleList',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: (result, error, payload) => [{ type: 'getAllStaff' }],
    }),
    getReportById: builder.query({
      query: ({
        ReportGeneratorId,
        LoginUserId,
        PageModuleId,
        PageMenuId,
      }) => ({
        url: `/ReportGenerator/GetReportGeneratorById/${LoginUserId}/${PageModuleId}/${PageMenuId}?ReportGeneratorId=${ReportGeneratorId}`,
      }),
    }),
    deleteReport: builder.mutation({
      query: ({
        reportGeneratorId,
        loginUserId,
        pageModuleId,
        pageMenuId,
      }) => ({
        url: `/ReportGenerator/${reportGeneratorId}/${loginUserId}/${pageModuleId}/${pageMenuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'getAllReports' }],
    }),
    addReport: builder.mutation({
      query: ({ payload }) => ({
        url: '/ReportGenerator',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getAllReports' }],
    }),
 
    updateReport: builder.mutation({
      query: ({ payload }) => ({
        url: '/ReportGenerator',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getAllReports' }],
    }),
    getAllFacility: builder.query({
      query: ({ payload }) => ({
        url: '/Facility/GetAllFacility',
        method: 'POST',
        body: payload,
      }),
 
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: (result, error, payload) => [
        { type: 'getFacility', id: payload.headerFacility },
      ],
    }),
 
    unlockStaff: builder.mutation({
      query: ({ payload }) => ({
        url: '/Staff/UnlockStaff',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: 'getStaffUnlock',
    }),
    downloadStaffData: builder.mutation({
      query: ({ payload }) => ({
        url: '/Staff/DownloadData',
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});
 
export const {
  useLazyGetStaffDetailsQuery,
  useGetStaffDetailsQuery,
  useGetModuleListQuery,
  useGetReportDetailsQuery,
  useGetAllMenuListQuery,
  useGetAllFacilityQuery,
  useGetReportByIdQuery,
  useDeleteReportMutation,
  useAddReportMutation,
  useUpdateReportMutation,
  useGetAllModulesMutation,
} = reportGeneratorApi;
 
 