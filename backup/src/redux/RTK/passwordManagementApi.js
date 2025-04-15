import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const passwordManagementApi = createApi({
  reducerPath: 'passwordManagementRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: ['getPasswordManagement'],
  endpoints: (builder) => ({
    getPageLoadData: builder.query({
      query: ({ menuId, loginUserId, headerFacilityId }) => {
        return {
          url: `/PasswordManagement/PageLoadData/${menuId}/${loginUserId}/${headerFacilityId}`,
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
      providesTags: (result, error, payload) => [
        { type: 'getPasswordManagement' },
      ],
    }),

    getPasswordPolicy: builder.query({
      query: ({ loginUserId, headerFacilityId }) => {
        return {
          url: `/PasswordManagement/GetPasswordPolicy/${loginUserId}/${headerFacilityId}`,
          method: 'POST',
        };
      },
      providesTags: (result, error, loginUserId) => [
        { type: 'getPasswordPolicy', id: loginUserId?.toString() },
      ],
    }),

    getPasswordData: builder.query({
      query: ({ moduleId, menuId, loginUserId, userId, headerFacilityId }) => {
        return {
          url: `/PasswordManagement/GetPasswordData/${moduleId}/${menuId}/${loginUserId}/${userId}/${headerFacilityId}`,
          method: 'POST',
        };
      },
      providesTags: (result, error, loginUserId) => [
        { type: 'getPasswordData', id: loginUserId?.toString() },
      ],
    }),

    getPopupStaffDetails: builder.query({
      query: ({ payload }) => ({
        url: '/PasswordManagement/GetActiveAllStaff',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: (result, error, payload) => [
        { type: 'getPasswordManagement' },
      ],
    }),

    addPasswordPolicy: builder.mutation({
      query: ({ payload }) => ({
        url: '/PasswordManagement/CreatePasswordPolicy',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getPasswordManagement' }],
    }),

    updatePasswordPolicy: builder.mutation({
      query: ({ payload }) => ({
        url: '/PasswordManagement/UpdatePasswordPolicy',
        method: 'PUT',
        body: payload,
      }),
    }),

    updateStaffPassword: builder.mutation({
      query: ({ payload }) => ({
        url: '/PasswordManagement/updatePassword',
        method: 'PUT',
        body: payload,
      }),
    }),

    sendStaffCredentialsMail: builder.query({
      query: ({
        userIds,
        moduleId,
        menuId,
        loginUserId,
        headerFacilityId,
        facilityId,
      }) => {
        return {
          url: `/PasswordManagement/StaffCredentialsMailTrigger/${userIds}/${moduleId}/${menuId}/${loginUserId}/${headerFacilityId}/${facilityId}`,
          method: 'POST',
        };
      },
      providesTags: (result, error, loginUserId) => [
        { type: 'sendStaffCredentialsMail', id: loginUserId?.toString() },
      ],
    }),
    getPasswordMgmtStaffSearch: builder.query({
      query: (payload) => {
        return {
          url: '/Staff/GetPasswordMgmtStaffSearch',
          method: 'POST',
          body: payload,
        };
      },
      transformResponse: (response) => ({
        totalPages: response?.Data?.TotalPages,
        totalRecords: response?.Data?.TotalRecords,
        records: response?.Data?.Records,
      }),
      providesTags: (result, error, payload) => [{ type: 'getPasswordMgmt' }],
    }),
  }),
});

export const {
  useGetPageLoadDataQuery,
  useGetStaffDetailsQuery,
  useGetPasswordPolicyQuery,
  useGetPasswordDataQuery,
  useGetPopupStaffDetailsQuery,
  useAddPasswordPolicyMutation,
  useUpdatePasswordPolicyMutation,
  useUpdateStaffPasswordMutation,
  useLazySendStaffCredentialsMailQuery,
  useLazyGetPasswordMgmtStaffSearchQuery,
} = passwordManagementApi;
