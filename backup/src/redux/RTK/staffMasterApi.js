import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const staffMasterApi = createApi({
  reducerPath: 'staffMasterRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: ['getAllStaff', 'getStaffUnlock'],
  endpoints: (builder) => ({
    getPageLoadData: builder.query({
      query: ({ menuId, loginUserId, headerFacilityId }) => {
        return {
          url: `/Staff/PageLoadData/${menuId}/${loginUserId}/${headerFacilityId}`,
        };
      },
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
      providesTags: () => [{ type: 'getAllStaff' }],
    }),
    getStaffById: builder.query({
      query: ({ menuId, loginUserId, userId }) => ({
        url: `/Staff/GetStaffById/${userId}/${loginUserId}/${menuId}`,
      }),
    }),
    getStaffUnlock: builder.query({
      query: ({ menuId, loginUserId }) => {
        return {
          url: `/Staff/GetStaffUnlockList/${menuId}/${loginUserId}`,
        };
      },
      providesTags: 'getStaffUnlock',
    }),
    deleteStaff: builder.mutation({
      query: ({ userId, loginUserId, menuId }) => ({
        url: `/Staff/${userId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'getAllStaff' }],
    }),
    addStaff: builder.mutation({
      query: ({ payload }) => ({
        url: '/Staff',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getAllStaff' }],
    }),
    updateStaff: builder.mutation({
      query: ({ payload }) => ({
        url: '/Staff',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [{ type: 'updateStaff' }],
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
      query: ({ payload, downloadType }) => ({
        url: `/Staff/DownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    uploadStaffData: builder.mutation({
      query: ({ payload }) => ({
        url: `/Staff/import`,
        method: 'POST',
        body: payload,
      }),
    }),
    GetAllStaffCategorySearch: builder.query({
      query: ({ payload }) => ({
        url: '/Staff/StaffMasterSubMaster/GetAllStaffCategorySearch',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'etAllStaffCategorySearch' }],
    }),
  }),
});

export const {
  useGetPageLoadDataQuery,
  useLazyGetPageLoadDataQuery,
  useLazyGetStaffDetailsQuery,
  useGetStaffDetailsQuery,
  useGetStaffByIdQuery,
  useGetStaffUnlockQuery,
  useDeleteStaffMutation,
  useAddStaffMutation,
  useUpdateStaffMutation,
  useUnlockStaffMutation,
  useDownloadStaffDataMutation,
  useUploadStaffDataMutation,
  useLazyGetAllStaffCategorySearchQuery,
} = staffMasterApi;
