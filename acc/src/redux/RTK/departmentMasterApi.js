import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const departmentMasterApi = createApi({
  reducerPath: 'departmentMasterRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: ['getDepartmentMaster'],

  endpoints: (builder) => ({
    //* Location Type API Queries
    getLocationPageLoadData: builder.query({
      query: ({ menuId, loginUserId, headerFacilityId }) => {
        return {
          url: `/LocationType/PageLoadLocationTypeData/${menuId}/${loginUserId}/${headerFacilityId}`,
        };
      },
    }),

    getLocationTypeDetails: builder.query({
      query: ({ payload }) => ({
        url: '/LocationType/GetAllLocationTypes',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getLocationType'],
    }),

    addLocationType: builder.mutation({
      query: ({ payload }) => ({
        url: '/LocationType/CreateLocationType',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'createLocationType' }],
    }),

    getLocationTypeDataById: builder.query({
      query: ({ locationId, loginUserId, menuId }) => {
        return {
          url: `/LocationType/GetLocationTypeById/${locationId}/${loginUserId}/${menuId}`,
        };
      },
      providesTags: (result, error, locationId) => [
        { type: 'getLocationTypeById', id: locationId?.toString() },
      ],
    }),

    getLocationTypeByFacility: builder.query({
      query: ({ facilityId, loginUserId, moduleId, menuId }) => {
        return {
          url: `/LocationType/GetLocationTypebyFacility/${facilityId}/${loginUserId}/${moduleId}/${menuId}`,
        };
      },
    }),

    updateLocationType: builder.mutation({
      query: ({ payload }) => ({
        url: '/LocationType/UpdateLocationType',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteLocationType: builder.mutation({
      query: ({ locationId, loginUserId, menuId }) => ({
        url: `/LocationType/${locationId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteLocationType'],
    }),

    downloadLocationTypeData: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/LocationType/DownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    //* Department API Queries
    getDepartmentPageLoadData: builder.query({
      query: ({ menuId, loginUserId, headerFacilityId }) => {
        return {
          url: `/Department/PageLoadData/${menuId}/${loginUserId}/${headerFacilityId}`,
        };
      },
    }),

    getDepartmentDetails: builder.query({
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
      providesTags: ['getDepartment'],
    }),

    addDepartment: builder.mutation({
      query: ({ payload }) => ({
        url: '/Department',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getDepartment' }],
    }),

    getDepartmentDataById: builder.query({
      query: ({ departmentId, loginUserId, menuId }) => {
        return {
          url: `/Department/GetDepartmentById/${departmentId}/${loginUserId}/${menuId}`,
        };
      },
      providesTags: (result, error, departmentId) => [
        { type: 'getDepartmentById', id: departmentId?.toString() },
      ],
    }),

    updateDepartment: builder.mutation({
      query: ({ payload }) => ({
        url: '/Department',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteDepartment: builder.mutation({
      query: ({ departmentId, loginUserId, menuId }) => ({
        url: `/Department/${departmentId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getDepartment'],
    }),

    downloadDepartmentData: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/Department/DownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    uploadDepartmentData: builder.mutation({
      query: ({ payload }) => ({
        url: '/Department/import',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'uploadDepartment' }],
    }),
    //* Designation API Queries
    getDesignationPageLoadData: builder.query({
      query: ({ menuId, loginUserId, headerFacilityId }) => {
        return {
          url: `/Designation/PageLoadDesignationData/${menuId}/${loginUserId}/${headerFacilityId}`,
        };
      },
    }),

    getDesignationDetails: builder.query({
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
      providesTags: ['getDesignation'],
    }),

    addDesignation: builder.mutation({
      query: ({ payload }) => ({
        url: '/Designation',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getDesignation' }],
    }),

    getDesignationDataById: builder.query({
      query: ({ designationId, loginUserId, menuId }) => {
        return {
          url: `/Designation/GetDesignationById/${designationId}/${loginUserId}/${menuId}`,
        };
      },
      providesTags: (result, error, designationId) => [
        { type: 'getDesignationById', id: designationId?.toString() },
      ],
    }),

    updateDesignation: builder.mutation({
      query: ({ payload }) => ({
        url: '/Designation',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteDesignation: builder.mutation({
      query: ({ designationId, loginUserId, menuId }) => ({
        url: `/Designation/${designationId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getDesignation'],
    }),

    downloadDesignationData: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/Designation/DownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    uploadDesignationData: builder.mutation({
      query: ({ payload }) => ({
        url: '/Designation/import',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'DesignationData' }],
    }),
    //* Department Group API Queries

    getDepartmentGroupDetails: builder.query({
      query: ({ payload }) => ({
        url: '/Department/DepartmentGroup/GetAllDepartmentGroups',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getDepartmentGroup'],
    }),

    addDepartmentGroup: builder.mutation({
      query: ({ payload }) => ({
        url: '/Department/DepartmentGroup/CreateDepartmentGroup',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getDepartmentGroup' }],
    }),

    getDepartmentGroupDataById: builder.query({
      query: ({ departmentGroupId, loginUserId, menuId }) => {
        return {
          url: `/Department/DepartmentGroup/GetDepartmentGroupById/${departmentGroupId}/${loginUserId}/${menuId}`,
        };
      },
      providesTags: (result, error, departmentGroupId) => [
        { type: 'getDepartmentById', id: departmentGroupId?.toString() },
      ],
    }),

    updateDepartmentGroup: builder.mutation({
      query: ({ payload }) => ({
        url: '/Department/DepartmentGroup/UpdateDepartmentGroup',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteDepartmentGroup: builder.mutation({
      query: ({ departmentGroupId, loginUserId, menuId }) => ({
        url: `/Department/DepartmentGroup/${departmentGroupId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getDepartmentGroup'],
    }),

    getAllDepartmentGroupSearch: builder.query({
      query: (payload) => {
        return {
          url: '/Department/DepartmentGroup/GetAllDepartmentGroupSearch',
          method: 'POST',
          body: payload,
        };
      },
      transformResponse: (response) => ({
        totalPages: response?.Data?.TotalPages,
        totalRecords: response?.Data?.TotalRecords,
        records: response?.Data?.Records,
      }),
      providesTags: (result, error, payload) => [
        { type: 'getAllDepartmentGroup' },
      ],
    }),
  }),
});

export const {
  useGetLocationPageLoadDataQuery,
  useGetLocationTypeDetailsQuery,
  useAddLocationTypeMutation,
  useGetLocationTypeDataByIdQuery,
  useLazyGetLocationTypeByFacilityQuery,
  useUpdateLocationTypeMutation,
  useDeleteLocationTypeMutation,
  useDownloadLocationTypeDataMutation,

  useGetDepartmentPageLoadDataQuery,
  useGetDepartmentDetailsQuery,
  useAddDepartmentMutation,
  useGetDepartmentDataByIdQuery,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useDownloadDepartmentDataMutation,

  useGetDesignationPageLoadDataQuery,
  useGetDesignationDetailsQuery,
  useAddDesignationMutation,
  useGetDesignationDataByIdQuery,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
  useDownloadDesignationDataMutation,
  useUploadDepartmentDataMutation,
  useUploadDesignationDataMutation,
  useGetDepartmentGroupDetailsQuery,
  useAddDepartmentGroupMutation,
  useGetDepartmentGroupDataByIdQuery,
  useUpdateDepartmentGroupMutation,
  useDeleteDepartmentGroupMutation,
  useLazyGetAllDepartmentGroupSearchQuery,
} = departmentMasterApi;
