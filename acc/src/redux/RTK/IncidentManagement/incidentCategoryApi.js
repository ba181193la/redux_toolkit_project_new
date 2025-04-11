import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../../services/customFetchBaseQuery';

export const incidentCategoryApi = createApi({
  reducerPath: 'incidentCategoryRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: [''],
  endpoints: (builder) => ({
    // Get page names
    getPageLoadName: builder.query({
      query: ({ moduleId, menuId, loginUserId }) => ({
        url: `/IncidentCategory/GetPageLoadPageName/${moduleId}/${menuId}/${loginUserId}`,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
    }),

    // Affected category API Queries
    getAffectedCategory: builder.query({
      query: ({ moduleId, menuId, loginUserId, headerFacilityId }) => ({
        url: `/IncidentCategory/GetPageLoadAffectedCategory/${moduleId}/${loginUserId}/${menuId}/${headerFacilityId}`,
      }),
    }),

    getAllAffectedCategory: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentCategory/GetAllAffectedCategory',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getAllAffectedCategory'],
    }),

    addAffectedCategory: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentCategory/CreateAffectedCategory',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'addAffectedCategory' }],
    }),

    getAffectedCategoryById: builder.query({
      query: ({ affectedCategoryId, loginUserId, menuId }) => {
        return {
          url: `/IncidentCategory/GetAffectedCategoryById/${affectedCategoryId}/${loginUserId}/${menuId}`,
        };
      },
      providesTags: (result, error, affectedCategoryId) => [
        { type: 'getAffectedCategoryById', id: affectedCategoryId?.toString() },
      ],
    }),

    updateAffectedCategory: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentCategory/UpdateAffectedCategory',
        method: 'PUT',
        body: payload,
      }),
    }),

    downloadAffectedCategory: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentCategory/AffectedCategoryDownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),

    deleteAffectedCategory: builder.mutation({
      query: ({ affectedCategoryId, loginUserId, menuId }) => ({
        url: `/IncidentCategory/DeleteAffectedCategory/${affectedCategoryId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteAffectedCategory'],
    }),

    //* Main Category API Queries

    getMainCategory: builder.query({
      query: ({
        moduleId,
        menuId,
        loginUserId,
        affectedCategoryId,
        headerFacilityId,
      }) => {
        return {
          url: `/IncidentCategory/GetPageLoadMainCategory/${moduleId}/${menuId}/${loginUserId}/${affectedCategoryId}/${headerFacilityId}`,
        };
      },
    }),

    getAllMainCategory: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentCategory/GetAllMainCategory',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getAllMainCategory'],
    }),

    addMainCategory: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentCategory/CreateMainCategory',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'addMainCategory' }],
    }),

    getMainCategoryById: builder.query({
      query: ({ mainCategoryId, loginUserId, menuId }) => {
        return {
          url: `/IncidentCategory/GetMainCategoryById/${mainCategoryId}/${loginUserId}/${menuId}`,
        };
      },
      providesTags: (result, error, mainCategoryId) => [
        { type: 'getMainCategoryById', id: mainCategoryId?.toString() },
      ],
    }),

    updateMainCategory: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentCategory/UpdateMainCategory',
        method: 'PUT',
        body: payload,
      }),
    }),

    downloadMainCategory: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentCategory/MainCategoryDownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),

    deleteMainCategory: builder.mutation({
      query: ({ mainCategoryId, loginUserId, menuId }) => ({
        url: `/IncidentCategory/DeleteMainCategory/${mainCategoryId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteMainCategory'],
    }),

    getMCFormBuilderById: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentCategory/GetMainCategoryFormBuilderById',
        method: 'POST',
        body: payload,
      }),
      providesTags: ['getMCFormBuilderById'],
    }),

    saveMCFormBuilder: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentCategory/SaveMainCategoryFormBuilder',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'saveMCFormBuilder' }],
    }),

    //* Sub Category API Queries

    getSubCategory: builder.query({
      query: ({ moduleId, menuId, loginUserId, mainCategoryId }) => {
        return {
          url: `/IncidentCategory/GetPageLoadSubCategory/${moduleId}/${menuId}/${loginUserId}/${mainCategoryId}`,
        };
      },
    }),

    getAllSubCategory: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentCategory/GetAllSubCategory',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getAllSubCategory'],
    }),

    addSubCategory: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentCategory/CreateSubCategory',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'addSubCategory' }],
    }),

    getSubCategoryById: builder.query({
      query: ({ subCategoryId, loginUserId, menuId }) => {
        return {
          url: `/IncidentCategory/GetSubCategoryById/${subCategoryId}/${loginUserId}/${menuId}`,
        };
      },
      providesTags: (result, error, subCategoryId) => [
        { type: 'getSubCategoryById', id: subCategoryId?.toString() },
      ],
    }),

    updateSubCategory: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentCategory/UpdateSubCategory',
        method: 'PUT',
        body: payload,
      }),
    }),

    downloadSubCategory: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentCategory/SubCategoryDownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),

    deleteSubCategory: builder.mutation({
      query: ({ subCategoryId, loginUserId, menuId }) => ({
        url: `/IncidentCategory/DeleteSubCategory/${subCategoryId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteSubCategory'],
    }),

    getSCFormBuilderById: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentCategory/GetSubCategoryFormBuilderById',
        method: 'POST',
        body: payload,
      }),
      providesTags: ['getSCFormBuilderById'],
    }),

    saveSCFormBuilder: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentCategory/SaveSubCategoryFormBuilder',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'saveSCFormBuilder' }],
    }),

    //* Incident Details API Queries

    getIncidentDetail: builder.query({
      query: ({ moduleId, menuId, loginUserId, subCategoryId }) => {
        return {
          url: `/IncidentCategory/GetPageLoadIncidentDetail/${moduleId}/${menuId}/${loginUserId}/${subCategoryId}`,
        };
      },
    }),

    getAllIncidetDetail: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentCategory/GetAllIncidentDetail',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getAllIncidentDetail'],
    }),

    addIncidentDetail: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentCategory/CreateIncidentDetail',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'addIncidentDetail' }],
    }),

    getIncidentDetailById: builder.query({
      query: ({ incidentDetailId, loginUserId, menuId }) => {
        return {
          url: `/IncidentCategory/GetIncidentDetailById/${incidentDetailId}/${loginUserId}/${menuId}`,
        };
      },
      providesTags: (result, error, incidentDetailId) => [
        { type: 'getMainCategoryById', id: incidentDetailId?.toString() },
      ],
    }),

    updateIncidentDetails: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentCategory/UpdateIncidentDetail',
        method: 'PUT',
        body: payload,
      }),
    }),

    downloadIncidentDetail: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentCategory/IncidentDetailDownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),

    deleteIncidentDetail: builder.mutation({
      query: ({ incidentDetailId, loginUserId, menuId }) => ({
        url: `/IncidentCategory/DeleteIncidentDetail/${incidentDetailId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteIncidentDetail'],
    }),

    getIDFormBuilderById: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentCategory/GetIncidentDetailFormBuilderById',
        method: 'POST',
        body: payload,
      }),
      providesTags: ['getIDFormBuilderById'],
    }),

    saveIDFormBuilder: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentCategory/SaveIncidentDetailFormBuilder',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'saveIDFormBuilder' }],
    }),
  }),
});

export const {
  useGetPageLoadNameQuery,

  useGetAffectedCategoryQuery,
  useGetAllAffectedCategoryQuery,
  useLazyGetAffectedCategoryQuery,
  useGetAffectedCategoryByIdQuery,
  useAddAffectedCategoryMutation,
  useUpdateAffectedCategoryMutation,
  useDownloadAffectedCategoryMutation,
  useDeleteAffectedCategoryMutation,

  useLazyGetMainCategoryQuery,
  useGetAllMainCategoryQuery,
  useGetMainCategoryByIdQuery,
  useAddMainCategoryMutation,
  useUpdateMainCategoryMutation,
  useDownloadMainCategoryMutation,
  useDeleteMainCategoryMutation,
  useLazyGetMCFormBuilderByIdQuery,
  useSaveMCFormBuilderMutation,

  useLazyGetSubCategoryQuery,
  useGetAllSubCategoryQuery,
  useDownloadSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useAddSubCategoryMutation,
  useGetSubCategoryByIdQuery,
  useUpdateSubCategoryMutation,
  useLazyGetSCFormBuilderByIdQuery,
  useSaveSCFormBuilderMutation,

  useLazyGetIncidentDetailQuery,
  useGetAllIncidetDetailQuery,
  useGetIncidentDetailByIdQuery,
  useAddIncidentDetailMutation,
  useUpdateIncidentDetailsMutation,
  useDownloadIncidentDetailMutation,
  useDeleteIncidentDetailMutation,
  useLazyGetIDFormBuilderByIdQuery,
  useSaveIDFormBuilderMutation,
} = incidentCategoryApi;
