import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const notificationMasterApi = createApi({
  reducerPath: 'notificationMasterRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: ['getNotificationMaster', 'GetTemplateByTask', 'GetAllTemplates'],
  endpoints: (builder) => ({
    getAllNotification: builder.query({
      query: ({ payload }) => ({
        url: '/NotificationManagement/GetAllTemplates',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['GetAllTemplates'],
    }),
    getVariableDetails: builder.query({
      query: ({ menuId, moduleId, loginUserId }) => {
        return {
          url: `/NotificationManagement/PageLoadData/${menuId}/${moduleId}/${loginUserId}`,
        };
      },
    }),
    getTemplateByTask: builder.query({
      query: ({ menuId, moduleId, loginUserId, mailTaskId }) => {
        return {
          url: `/NotificationManagement/GetTemplateByTask/${menuId}/${moduleId}/${loginUserId}/${mailTaskId}`,
        };
      },
      providesTags: (result, error, mailTaskId) => [
        { type: 'GetTemplateByTask', id: mailTaskId?.toString() },
      ],
    }),

    getAllFacility: builder.query({
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
      providesTags: ['getNotification'],
    }),
    getAllDepartment: builder.query({
      query: ({ payload }) => ({
        url: '/Department/GetAllDepartments',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getNotification'],
    }),
    getAllDesignation: builder.query({
      query: ({ payload }) => ({
        url: '/Designation/GetAllDesignations',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getNotification'],
    }),
    getStaffUserDetails: builder.query({
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
      providesTags: () => [{ type: 'getUserAssignment' }],
    }),
    getAllRoles: builder.query({
      query: ({ payload }) => ({
        url: '/ApplicationRole/GetAllRoles',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'getUserAssignment' }],
    }),
    updateNotification: builder.mutation({
      query: ({ payload }) => ({
        url: '/NotificationManagement',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (payload) => [
        { type: 'GetTemplateByTask', id: payload.mailTaskId },
        { type: 'GetAllTemplates' },
      ],
    }),
    getNotificationStaffSearch: builder.query({
      query: ( payload ) => {        
        return {
          url: '/Staff/GetNotificationStaffSearch',
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
  useGetAllNotificationQuery,
  useGetAllDesignationQuery,
  useGetVariableDetailsQuery,
  useGetTemplateByTaskQuery,
  useGetAllFacilityQuery,
  useGetStaffUserDetailsQuery,
  useLazyGetNotificationStaffSearchQuery,
  useGetAllRolesQuery,
  useUpdateNotificationMutation,
  useGetAllApplicationRolesQuery,
} = notificationMasterApi;
