import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const pageUtilitiesApi = createApi({
  reducerPath: 'pageUtilitiesRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: [
    'getAllModuleList,getAllMenuList,getAllFieldAccessList,getFieldLabelData,getAllSubPageList',
  ],
  endpoints: (builder) => ({
    getAllModuleList: builder.query({
      query: ({ payload }) => ({
        url: '/PageUtilities/GetAllModuleList',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getAllModuleList'],
    }),

    getAllMenuList: builder.query({
      query: ({ payload }) => ({
        url: '/PageUtilities/GetAllMenuList',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getAllMenuList'],
    }),

    getAllFieldAccessList: builder.query({
      query: ({ payload }) => ({
        url: '/PageUtilities/GetAllFieldAccessList',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getAllFieldAccessList'],
    }),

    getFieldLabelData: builder.query({
      query: ({ payload }) => ({
        url: '/PageUtilities/GetFieldLabelData',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        Records: response.Data,
      }),
      providesTags: ['getFieldLabelData'],
    }),

    getAllSubPageList: builder.query({
      query: ({ moduleId, menuId, loginUserId, headerFacilityId }) => ({
        url: `/PageUtilities/GetAllSubPageList/?ModuleId=${moduleId}&MenuId=${menuId}&LoginUserId=${loginUserId}&HeaderFacilityId=${headerFacilityId}`,
        method: 'POST',
      }),
    }),

    getFieldLabelList: builder.query({
      query: ({ payload }) => ({
        url: '/PageUtilities/GetFieldLabelList',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        Records: response.Data,
      }),
      providesTags: ['getFieldLabelList'],
    }),
    updateModuleList: builder.mutation({
      query: ({ payload }) => ({
        url: '/PageUtilities/UpdateModuleList',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['getAllModuleList'],
    }),

    updateMenuList: builder.mutation({
      query: ({ payload }) => ({
        url: '/PageUtilities/UpdateMenuList',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['getAllMenuList'],
    }),

    updateFieldAccessList: builder.mutation({
      query: ({ payload }) => ({
        url: '/PageUtilities/UpdateFieldAccessList',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['getAllFieldAccessList'],
    }),

    updateFieldLabel: builder.mutation({
      query: ({ payload }) => ({
        url: '/PageUtilities/UpdateFieldLabel',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['getFieldLabelData'],
    }),
  }),
});

export const {
  useGetAllModuleListQuery,
  useLazyGetAllMenuListQuery,
  useLazyGetAllFieldAccessListQuery,
  useLazyGetAllSubPageListQuery,
  useLazyGetFieldLabelDataQuery,
  useLazyGetFieldLabelListQuery,
  useUpdateModuleListMutation,
  useUpdateMenuListMutation,
  useUpdateFieldAccessListMutation,
  useUpdateFieldLabelMutation,
} = pageUtilitiesApi;
