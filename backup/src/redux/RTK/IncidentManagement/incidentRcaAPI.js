import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../../services/customFetchBaseQuery';

export const incidentRcaAPI = createApi({
  reducerPath: 'incidentRcaMasters',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  endpoints: (builder) => ({
    getPageLoadData: builder.query({
      query: ({ menuId, moduleId, loginUserId, headerFacilityId }) => {
        return {
          url: `/IncidentRCA/GetIncidentRCAPageLoadData/${moduleId}/${menuId}/${loginUserId}/${headerFacilityId}`,
        };
      },
    }),

    getRCAPending: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentRCA/GetRCAPending',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'getRCAPending' }],
    }),
    getRCACompleted: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentRCA/GetRCACompleted',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'getRCACompleted' }],
    }),
    getRCADrafted: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentRCA/GetRCADrafted',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'getRCADrafted' }],
    }),
    getDownloadDataIncidentRCAPending: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentRCA/DownloadDataIncidentRCAPending/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getDownloadDataIncidentRCACompleted: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentRCA/DownloadDataIncidentRCACompleted/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getIncidentRCAEntryDataById: builder.query({
      query: ({ moduleId, RCAId, loginUserId, menuId }) => ({
        url: `/IncidentRCA/GetIncidentRCAEntryData/${RCAId}/${loginUserId}/${moduleId}/${menuId}`,
      }),
    }),
    getPreviewIncidentRCA: builder.query({
      query: ({ moduleId, RCAId, loginUserId, menuId }) => ({
        url: `/IncidentRCA/PreviewIncidentRCA/${RCAId}/${loginUserId}/${moduleId}/${menuId}`,
      }),
    }),
    getIncidentRCADraftData: builder.query({
      query: ({ moduleId, RCAId, loginUserId, menuId }) => ({
        url: `/IncidentRCA/GetIncidentRCADraftData/${RCAId}/${loginUserId}/${moduleId}/${menuId}`,
      }),
    }),
    getIncidentRCAViewData: builder.query({
      query: ({ moduleId, incidentId , loginUserId, menuId }) => ({
        url: `/IncidentRCA/GetIncidentRCAViewData/${incidentId}/${loginUserId}/${moduleId}/${menuId}`,
      }),
    }),
    saveRCA: builder.mutation({
      query: (formData) => ({
        url: '/IncidentRCA/SaveRCA',
        method: 'POST',
        body: formData,
        // formData: true,
      }),

      invalidatesTags: () => [{ type: 'saveRCA' }],
    }),
    previewSaveRCA: builder.mutation({
      query: (formData) => ({
        url: '/IncidentRCA/PreviewSaveRCA',
        method: 'POST',
        body: formData,
        // formData: true,
      }),

      invalidatesTags: () => [{ type: 'previewSaveRCA' }],
    }),
  }),
});

export const {
  useGetPageLoadDataQuery,
  useGetRCAPendingQuery,
  useGetRCACompletedQuery,
  useGetRCADraftedQuery,
  useGetDownloadDataIncidentRCAPendingMutation,
  useGetDownloadDataIncidentRCACompletedMutation,
  useGetIncidentRCAEntryDataByIdQuery,
  useGetPreviewIncidentRCAQuery,
  useGetIncidentRCAViewDataQuery,
  useGetIncidentRCADraftDataQuery,
  useSaveRCAMutation,
  usePreviewSaveRCAMutation,
} = incidentRcaAPI;
