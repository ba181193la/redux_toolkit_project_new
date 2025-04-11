import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const contactInformationApi = createApi({
  reducerPath: 'contactInformationRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: ['getCompany', 'getFacility', 'updateFacility'],
  endpoints: (builder) => ({
    getCompanyDetails: builder.query({
      query: ({ payload }) => ({
        url: '/Company/GetAllCompany',
        method: 'POST',
        body: payload,
      }),

      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: (payload) => [
        {
          type: 'getFacility',
          id: payload?.headerFacility || 'defaultFacility',
        },
        { type: 'getCompany' },
      ],
    }),
    getFacilityPageLoadData: builder.query({
      query: ({ menuId, loginUserId }) => {
        return {
          url: `/Facility/PageLoadData/${menuId}/${loginUserId}`,
        };
      },
    }),
    deleteCompany: builder.mutation({
      query: ({ companyId, loginUserId, menuId }) => ({
        url: `/Company/${companyId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'getCompany' }],
    }),
    addCompany: builder.mutation({
      query: ({ payload }) => {
        return {
          url: '/Company',
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags: [{ type: 'getCompany' }],
    }),

    updateCompany: builder.mutation({
      query: ({ payload }) => ({
        url: '/Company',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getAllCompany' }],
    }),
    getCompanyById: builder.query({
      query: ({ companyId, loginUserId }) => ({
        url: `/Company/GetCompanyById/${companyId}/${loginUserId}`,
      }),
    }),
    getFacilityById: builder.query({
      query: ({ facilityId, loginUserId }) => ({
        url: `/Facility/GetFacilityById/${facilityId}/${loginUserId}`,
      }),
      providesTags: (result, error, { facilityId }) =>
        result ? [{ type: 'updateFacility', id: facilityId }] : [],
    }),
    addFacility: builder.mutation({
      query: ({ payload }) => ({
        url: '/Facility',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getFacility' }],
    }),
    updateFacility: builder.mutation({
      query: ({ payload }) => {
        return {
          url: '/Facility',
          method: 'PUT',
          body: payload,
        };
      },
      invalidatesTags: (result, error, { payload }) =>
        result
          ? [
              { type: 'updateFacility', id: payload.id },
              { type: 'getFacility' },
            ]
          : [],
    }),
    deleteFacility: builder.mutation({
      query: ({ FacilityId, loginUserId, menuId }) => ({
        url: `/Facility/${FacilityId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'getFacility' }],
    }),

    getUserDetail: builder.query({
      query: ({ employeeId }) => ({
        url: `/Login/getUserDetail/${employeeId}`,
      }),
    }),
    updateLicense: builder.mutation({
      query: ({ payload }) => {
        return {
          url: '/Company/LicenseUpdate',
          method: 'PUT',
          body: payload,
        };
      },
      invalidatesTags: [{ type: 'getLicense' }],
    }),

    getFacility: builder.query({
      query: ({ payload }) => ({
        url: '/Facility/GetAllFacility',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        totalPages: response.Data.TotalPages,
        totalRecords: response.Data.TotalRecords,
        records: response.Data.Records,
      }),
      providesTags: (payload) => [
        { type: 'getFacility', id: payload.headerFacility },
      ],
    }),
    getLicenseById: builder.query({
      query: ({ companyId, loginUserId, moduleId, menuId }) => ({
        url: `/Company/GetLicenseDetailById/${companyId}/${loginUserId}/${moduleId}/${menuId}`,
      }),
    }),
    downloadFacilityData: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/Facility/DownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getAllCompanySearch: builder.query({
      query: (payload) => {
        return {
          url: '/Company/GetAllCompanySearch',
          method: 'POST',
          body: payload,
        };
      },
      transformResponse: (response) => ({
        totalPages: response?.Data?.TotalPages,
        totalRecords: response?.Data?.TotalRecords,
        records: response?.Data?.Records,
      }),
      providesTags: (result, error, payload) => [{ type: 'getUserAssignment' }],
    }),
    getAllFacilitySearch: builder.query({
      query: (payload) => {
        return {
          url: '/Facility/GetAllFacilitySearch',
          method: 'POST',
          body: payload,
        };
      },
      transformResponse: (response) => ({
        totalPages: response?.Data?.TotalPages,
        totalRecords: response?.Data?.TotalRecords,
        records: response?.Data?.Records,
      }),
      providesTags: (result, error, payload) => [{ type: 'getUserAssignment' }],
    }),
  }),
});

export const {
  useGetLazyCompanyDetailsQuery,
  useGetFacilityPageLoadDataQuery,
  useGetCompanyByIdQuery,
  useGetLicenseByIdQuery,
  useGetCompanyDetailsQuery,
  useLazyGetAllCompanySearchQuery,
  useLazyGetAllFacilitySearchQuery,
  useUpdateCompanyMutation,
  useLazyGetFacilityQuery,
  useDeleteCompanyMutation,
  useAddCompanyMutation,
  useAddFacilityMutation,
  useGetFacilityByIdQuery,
  useUpdateFacilityMutation,
  useUpdateLicenseMutation,
  useGetFacilityQuery,
  useDeleteFacilityMutation,
  useDownloadFacilityDataMutation,
} = contactInformationApi;
