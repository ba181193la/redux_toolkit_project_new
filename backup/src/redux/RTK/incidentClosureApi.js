import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const incidentClosureApi = createApi({
  reducerPath: 'incidentClosureMasters',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  endpoints: (builder) => ({
    getPageLoadData: builder.query({
      query: ({ menuId, moduleId, loginUserId, headerFacilityId }) => {
        return {
          url: `/IncidentClosure/GetIncidentClosurePageLoadData/${moduleId}/${menuId}/${loginUserId}/${headerFacilityId}`,
        };
      },
    }),
    getIncidentClosurePending: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentClosure/GetClosurePending',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'getIncidentClosurePending' }],
    }),
    getIncidentClosureCompleted: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentClosure/GetClosureCompleted',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'getIncidentClosureCompleted' }],
    }),
    getIncidentClosureDrafted: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentClosure/GetClosureDrafted',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: () => [{ type: 'getIncidentClosureDrafted' }],
    }),
    getDownloadDataClosurePending: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentClosure/DownloadDataIncidentClosurePending/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getDownloadDataClosureComplete: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentClosure/DownloadDataIncidentClosureCompleted/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getClosureEntryData: builder.query({
      query: ({ moduleId, incidentClosureId, loginUserId, menuId }) => ({
        url: `/IncidentClosure/GetIncidentClosureEntryData/${incidentClosureId}/${loginUserId}/${moduleId}/${menuId}`,
      }),
    }),
    getClosureViewData: builder.query({
      query: ({ moduleId, incidentId, loginUserId, menuId }) => ({
        url: `/IncidentClosure/GetIncidentClosureViewData/${incidentId}/${loginUserId}/${moduleId}/${menuId}`,
      }),
    }),
    getClosureEntryDraftData: builder.query({
      query: ({ moduleId, incidentClosureId, loginUserId, menuId }) => ({
        url: `/IncidentClosure/GetIncidentClosureDraftData/${incidentClosureId}/${loginUserId}/${moduleId}/${menuId}`,
      }),
    }),
    getIncidentLevelData: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentClosure/GetIncidentRiskLevelClosure',
        method: 'POST',
        body: payload,
      }),

      // transformResponse: (response) => ({
      //   totalPages: response.Data.TotalPages,
      //   totalRecords: response.Data.TotalRecords,
      //   records: response.Data.Records,
      // }),
      providesTags: () => [{ type: 'getIncidentLevelData' }],
    }),
    ClosureFillRCA: builder.mutation({
      query: ({ formData }) => ({
        url: '/IncidentClosure/ClosureFillRCA',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: () => [{ type: 'ClosureFillRCA' }],
    }),

    EditClosure: builder.mutation({
      query: ({ formData }) => ({
        url: '/IncidentClosure/EditClosure',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: () => [{ type: 'EditClosure' }],
    }),

    SaveRCA: builder.mutation({
      query: ({ formData }) => ({
        url: '/IncidentClosure/SaveClosure',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: () => [{ type: 'SaveRCA' }],
    }),
  }),
});
export const {
  useGetPageLoadDataQuery,
  useGetIncidentClosurePendingQuery,
  useGetIncidentClosureCompletedQuery,
  useGetIncidentClosureDraftedQuery,
  useGetDownloadDataClosurePendingMutation,
  useGetDownloadDataClosureCompleteMutation,
  useGetClosureEntryDataQuery,
  useGetClosureViewDataQuery,
  useGetClosureEntryDraftDataQuery,
  useGetIncidentLevelDataQuery,
  useClosureFillRCAMutation,
  useSaveRCAMutation,
  useEditClosureMutation,
} = incidentClosureApi;
