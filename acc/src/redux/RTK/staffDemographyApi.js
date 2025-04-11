import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const staffDemographyApi = createApi({
  reducerPath: 'staffDemopgraphyRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  endpoints: (builder) => ({
    //* Tabs accordion API Queries
    getTabsDetails: builder.query({
      query: ({ payload }) => ({
        url: '/StaffDemography/GetAllStaffDemographyTab',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getTabs'],
    }),

    addTabs: builder.mutation({
      query: ({ payload }) => ({
        url: '/StaffDemography/CreateStaffDemographyTab',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'createTab' }],
    }),

    getTabDataById: builder.query({
      query: ({ tabId, loginUserId }) => {
        return {
          url: `/StaffDemography/GetStaffdemographyTabById/${tabId}/${loginUserId}`,
        };
      },
      providesTags: (result, error, tabId) => [
        { type: 'getTabById', id: tabId?.toString() },
      ],
    }),

    updateTab: builder.mutation({
      query: ({ payload }) => ({
        url: '/StaffDemography/UpdateStaffDemographyTab',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteTab: builder.mutation({
      query: ({ tabId, loginUserId, menuId }) => ({
        url: `/StaffDemography/DeleteDemographyTab/${tabId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteTab'],
    }),

    //* License accordion API Queries
    getLicenseDetails: builder.query({
      query: ({ payload }) => ({
        url: '/StaffDemography/GetAllStaffDemographyLicense',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getLicense'],
    }),

    addLicense: builder.mutation({
      query: ({ payload }) => ({
        url: '/StaffDemography/CreateStaffDemographyLicense',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'createLicense' }],
    }),

    getLicenseDataById: builder.query({
      query: ({ licenseId, loginUserId }) => {
        return {
          url: `/StaffDemography/GetStaffdemographyLicenseById/${licenseId}/${loginUserId}`,
        };
      },
      providesTags: (result, error, licenseId) => [
        { type: 'getLicenseById', id: licenseId?.toString() },
      ],
    }),

    updateLicense: builder.mutation({
      query: ({ payload }) => ({
        url: '/StaffDemography/UpdateStaffDemographyLicense',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteLicense: builder.mutation({
      query: ({ licenseId, loginUserId, menuId }) => ({
        url: `/StaffDemography/DeleteDemographyLicense/${licenseId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteLicense'],
    }),

    //* Additional Tab accordion API Queries
    getAdditionalTabDetails: builder.query({
      query: ({ payload }) => ({
        url: '/StaffDemography/GetAllStaffDemographyAdditionalTab',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getAdditionalTab'],
    }),

    addAdditionalTab: builder.mutation({
      query: ({ payload }) => ({
        url: '/StaffDemography/CreateStaffDemographyAdditional',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'createAdditionalTab' }],
    }),

    getAdditionalTabDataById: builder.query({
      query: ({ tabId, loginUserId }) => {
        return {
          url: `/StaffDemography/GetStaffdemographyAdditionalById/${tabId}/${loginUserId}`,
        };
      },
      providesTags: (result, error, tabId) => [
        { type: 'getAdditionalTabById', id: tabId?.toString() },
      ],
    }),

    updateAdditionalTab: builder.mutation({
      query: ({ payload }) => ({
        url: '/StaffDemography/UpdateStaffDemographyAdditional',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteAdditionalTab: builder.mutation({
      query: ({ tabId, loginUserId, menuId }) => ({
        url: `/StaffDemography/DeleteDemographyAddition/${tabId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteAdditionalTab'],
    }),

    //* Life Support Certification accordion API Queries
    getCertificationDetails: builder.query({
      query: ({ payload }) => ({
        url: '/StaffDemography/GetAllStaffDemographyCertification',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getCertification'],
    }),

    addCertification: builder.mutation({
      query: ({ payload }) => ({
        url: '/StaffDemography/CreateStaffDemographyCertification',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'createCertification' }],
    }),

    getCertificationDataById: builder.query({
      query: ({ certificateId, loginUserId }) => {
        return {
          url: `/StaffDemography/GetStaffdemographyCertificationById/${certificateId}/${loginUserId}`,
        };
      },
      providesTags: (result, error, certificateId) => [
        { type: 'getCertificationById', id: certificateId?.toString() },
      ],
    }),

    updateCertificationTab: builder.mutation({
      query: ({ payload }) => ({
        url: '/StaffDemography/UpdateStaffDemographyCertification',
        method: 'PUT',
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetTabsDetailsQuery,
  useAddTabsMutation,
  useGetTabDataByIdQuery,
  useUpdateTabMutation,
  useDeleteTabMutation,

  useGetLicenseDetailsQuery,
  useAddLicenseMutation,
  useGetLicenseDataByIdQuery,
  useUpdateLicenseMutation,
  useDeleteLicenseMutation,

  useGetAdditionalTabDetailsQuery,
  useAddAdditionalTabMutation,
  useGetAdditionalTabDataByIdQuery,
  useUpdateAdditionalTabMutation,
  useDeleteAdditionalTabMutation,

  useGetCertificationDetailsQuery,
  useAddCertificationMutation,
  useGetCertificationDataByIdQuery,
  useUpdateCertificationTabMutation,
} = staffDemographyApi;
