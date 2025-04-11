import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const applicationRoleApi = createApi({
  reducerPath: 'applicationRoleRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: [
    'getApplicationRole',
    'getApplicationRolebyid',
    'getApplicationRoleById',
  ],
  endpoints: (builder) => ({
    getApplicationRoleDetails: builder.query({
      query: ({ payload }) => ({
        url: '/ApplicationRole/GetAllRoles',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: (result, error, payload) => [
        { type: 'getApplicationRole' },
      ],
    }),
    deleteApplicationRole: builder.mutation({
      query: ({ roleId, loginUserId, menuId }) => ({
        url: `/ApplicationRole/${roleId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getApplicationRole'],
    }),
    addApplicationRole: builder.mutation({
      query: ({ payload }) => ({
        url: '/ApplicationRole',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: () => [{ type: 'getApplicationRole' }],
    }),
    getApplicationRoleById: builder.query({
      query: ({ menuId, loginUserId, roleId }) => ({
        url: `/ApplicationRole/GetRoleById/${roleId}/${loginUserId}/${menuId}`,
      }),
      providesTags: (result, error, { roleId }) => [
        { type: 'getApplicationRoleById', id: roleId?.toString() },
      ],
    }),
    updateApplicationRole: builder.mutation({
      query: ({ payload }) => ({
        url: '/ApplicationRole',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (result, error, { payload }) => [
        { type: 'getApplicationRoleById', id: payload.roleId.toString() },
      ],
    }),
    getRoleCategoryMaping: builder.query({
      query: ({ loginUserId, menuId }) => ({
        url: `/ApplicationRole/GetRoleCategoryMaping/${loginUserId}/${menuId}`,
      }),
      providesTags: (result, error, menuId) => [
        { type: 'getApplicationRole' },
        { type: 'getApplicationRoleById', id: menuId?.toString() },
      ],
    }),
    updateRoleCategoryMapping: builder.mutation({
      query: ({ payload }) => ({
        url: '/ApplicationRole/UpdateRoleCategoryMapping',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['getApplicationRole'],
    }),
    downloadApplicationRoleData: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/ApplicationRole/DownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getApplicationRolesSearch: builder.query({
      query: ( payload ) => {        
        return {
          url: '/ApplicationRole/GetApplicationRolesSearch',
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
  useGetApplicationRoleDetailsQuery,
  useLazyGetApplicationRolesSearchQuery,
  useDeleteApplicationRoleMutation,
  useAddApplicationRoleMutation,
  useGetApplicationRoleByIdQuery,
  useUpdateApplicationRoleMutation,
  useLazyGetRoleCategoryMapingQuery,
  useUpdateRoleCategoryMappingMutation,
  useDownloadApplicationRoleDataMutation,
} = applicationRoleApi;
