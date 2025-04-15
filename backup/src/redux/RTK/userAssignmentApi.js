import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const userAssignmentApi = createApi({
  reducerPath: 'userAssignmentRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: ['getUserAssignment'],
  endpoints: (builder) => ({
    getUADetails: builder.query({
      query: ({ payload }) => ({
        url: '/UserAssignment/GetAllUserAssignment',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getUserAssignment'],
    }),
    getUserPageLoadData: builder.query({
      query: ({ menuId, loginUserId, headerFacilityId }) => {
        return {
          url: `/UserAssignment/PageLoadData/${menuId}/${loginUserId}/${headerFacilityId}`,
        };
      },
    }),
    getAddUser: builder.mutation({
      query: ({ payload }) => ({
        url: '/UserAssignment',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getUserAssignment' }],
    }),
    getAllFacilities: builder.query({
      query: ({ payload }) => ({
        url: '/Facility/GetAllFacility',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getUserAssignment'],
    }),
    getStaffUserDetails: builder.query({
      query: ({ payload }) => {
        return {
          url: '/Staff/GetAllStaff',
          method: 'POST',
          body: payload,
        };
      },
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: (result, error, payload) => [{ type: 'getUserAssignment' }],
    }),
    getUserAssignmentById: builder.query({
      query: ({ menuId, loginUserId, userId }) => ({
        url: `/UserAssignment/GetUserAssignmentById/${userId}/${loginUserId}/${menuId}`,
      }),
    }),
    downloadUserAssignmentData: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/UserAssignment/DownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getUserAssignmentStaffSearch: builder.query({
      query: ( payload ) => {        
        return {
          url: '/Staff/GetUserAssignmentStaffSearch',
          method: 'POST',
          body: payload,
        };
      },
      transformResponse: (response) => ({
        totalPages: response?.Data?.TotalPages,
        totalRecords:response?.Data?.TotalRecords,
        records:response?.Data?.Records
      }),
      providesTags: (result, error, payload) => [{ type: 'getUserAssignment' }],
    }),
  }),
});

export const {
  useGetUserPageLoadDataQuery,
  useGetAddUserMutation,
  useGetAllFacilitiesQuery,
  useGetUADetailsQuery,
  useGetStaffUserDetailsQuery,
  useGetUserAssignmentByIdQuery,
  useDownloadUserAssignmentDataMutation,
  useLazyGetUserAssignmentByIdQuery,
  useLazyGetUserAssignmentStaffSearchQuery
} = userAssignmentApi;
