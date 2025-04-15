import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';
 
export const incidentOpinionApi = createApi({
  reducerPath: 'incidentOpinionRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: ['getAllStaff', 'getStaffUnlock'],
  endpoints: (builder) => ({
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
        // responseHandler: (response) => response.blob(),
      }),
    }),
 
 
 
    getPageLoadData: builder.query({
      query: ({ menuId, loginUserId, headerFacilityId }) => {
        return {
          url: `/Staff/PageLoadData/${menuId}/${loginUserId}/${headerFacilityId}`,
        };
      },
    }),
    getOpinionPageLoadData: builder.query({
      query: ({ menuId, loginUserId, moduleId, facilityId }) => {
        return {
          url: `/IncidentOpinion/PageLoadOpinionData/${moduleId}/${menuId}/${loginUserId}/${facilityId}`,
        };
      },
    }),
    getOpinionDetails: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentOpinion/GetIncidentOpinionPending',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => {
        return {
          totalPages: response.Data.TotalPages,
          totalRecords: response.Data.TotalRecords,
          records: response.Data.Records,
        };
      },
      providesTags: () => [{ type: 'getAllOpinions' }],
    }),
    getOpinionCompleteDetails: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentOpinion/GetIncidentOpinionComplete',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => {
        return {
          totalPages: response.Data.TotalPages,
          totalRecords: response.Data.TotalRecords,
          records: response.Data.Records,
        };
      },
      providesTags: () => [{ type: 'getAllOpinions' }],
    }),
    getOpinionById: builder.query({
      query: ({  opinionId, loginUserId, menuId,moduleId }) => {
        return {
          url:`/IncidentOpinion/GetIncidentOpinionDetilsPendingById/${incidentId}/${loginUserId}/${menuId}?ModuleId=${moduleId}`
        };
      },
    }),
    updateOpinion: builder.mutation({
      query: ({ payload }) => {
        return {
          url: '/IncidentOpinion',
          method: 'PUT',
          body: payload,
        };
      },
      invalidatesTags: [{ type: 'getOpinion' }],
    }),
    getIncidentApprovalPendingById: builder.query({
      query: ({  incidentId, loginUserId, menuId,moduleId }) => {
        return {
          url:`/IncidentOpinion/GetIncidentApprovalPendingById/${incidentId}/${loginUserId}/${menuId}?ModuleId=${moduleId}`
        };
      },
    }),
    GetIncidentOpinionPendingById: builder.query({
      query: ({  opinionId, loginUserId, menuId,moduleId }) => {
        return {
          url:`/IncidentOpinion/GetIncidentOpinionPendingById/${opinionId}/${loginUserId}/${menuId}?ModuleId=${moduleId}`
        };
      },
    }),
    getIncidentOpinionCompletedById: builder.query({
      query: ({  opinionId, loginUserId, menuId,moduleId }) => {
        return {
          url:`/IncidentOpinion/GetIncidentOpinionCompletedById/${opinionId}/${loginUserId}/${menuId}?ModuleId=${moduleId}`
        };
      },
    }),
    printPendingOpinionList: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentOpinion/DownloadDataIncidentOpinionPending/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    printCompletedOpinionList: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentOpinion/DownloadDataIncidentOpinionComplete/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});
 
export const {
  useGetPageLoadDataQuery,
  useLazyGetPageLoadDataQuery,
  useGetOpinionPageLoadDataQuery,
  useGetOpinionDetailsQuery,
  useGetOpinionCompleteDetailsQuery,
  useGetOpinionByIdQuery,
  useGetIncidentApprovalPendingByIdQuery,
  useGetIncidentOpinionPendingByIdQuery,
  useGetIncidentOpinionCompletedByIdQuery,
 
  usePrintPendingOpinionListMutation,
  usePrintCompletedOpinionListMutation,
  useUpdateOpinionMutation,
 
  useLazyGetStaffDetailsQuery,
  useGetStaffDetailsQuery,
  useGetStaffUnlockQuery,
  useDeleteStaffMutation,
  useAddStaffMutation,
  useUpdateStaffMutation,
  useUnlockStaffMutation,
  useDownloadStaffDataMutation,
  useUploadStaffDataMutation,
} = incidentOpinionApi;