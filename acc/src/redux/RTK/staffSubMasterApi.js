import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const staffSubMasterApi = createApi({
  reducerPath: 'staffSubMasterRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: ['getStaffSubMaster'],
  endpoints: (builder) => ({
    // * Employment type API
    getEmploymentTypesDetails: builder.query({
      query: ({ payload }) => ({
        url: '/Staff/StaffMasterSubMaster/GetAllEmploymentTypes',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getstaffSubMaster'],
    }),

    addEmploymentType: builder.mutation({
      query: ({ payload }) => ({
        url: '/Staff/StaffMasterSubMaster/CreateEmploymentType',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getStaffSubMaster' }],
    }),

    getEmploymentTypeById: builder.query({
      query: ({ employmentTypeId, loginUserId, menuId }) => {
        return {
          url: `/Staff/StaffMasterSubMaster/GetEmploymentTypeById/${employmentTypeId}/${loginUserId}/${menuId}`,
        };
      },
      providesTags: (result, error, employmentTypeId) => [
        { type: 'getStaffSubMaster', id: employmentTypeId?.toString() },
      ],
    }),

    updateEmploymentType: builder.mutation({
      query: ({ payload }) => ({
        url: '/Staff/StaffMasterSubMaster/UpdateEmploymentType',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteEmploymentType: builder.mutation({
      query: ({ employmentTypeId, loginUserId, menuId }) => ({
        url: `/Staff/StaffMasterSubMaster/EmploymentType/${employmentTypeId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getStaffSubMaster'],
    }),

    // * Physician level API
    getPhysicianLevelDetails: builder.query({
      query: ({ payload }) => ({
        url: '/Staff/StaffMasterSubMaster/GetAllPhysicianLevel',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getstaffSubMaster'],
    }),

    addPhysicianLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/Staff/StaffMasterSubMaster/CreatePhysicianLevel',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getStaffSubMaster' }],
    }),

    getPhysicianLevelById: builder.query({
      query: ({ physicianLevelId, loginUserId, menuId }) => {
        return {
          url: `/Staff/StaffMasterSubMaster/GetPhysicianLevelById/${physicianLevelId}/${loginUserId}/${menuId}`,
        };
      },
      providesTags: (result, error, physicianLevelId) => [
        { type: 'getStaffSubMaster', id: physicianLevelId?.toString() },
      ],
    }),

    updatePhysicianLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/Staff/StaffMasterSubMaster/UpdatePhysicianLevel',
        method: 'PUT',
        body: payload,
      }),
    }),

    deletePhysicianLevel: builder.mutation({
      query: ({ physicianLevelId, loginUserId, menuId }) => ({
        url: `/Staff/StaffMasterSubMaster/PhysicianLevel/${physicianLevelId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getStaffSubMaster'],
    }),

    // * Employment subtype API
    getEmployeeSubTypesDetails: builder.query({
      query: ({ payload }) => ({
        url: '/Staff/StaffMasterSubMaster/GetAllEmployeeSubTypes',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getstaffSubMaster'],
    }),

    addEmployeeSubType: builder.mutation({
      query: ({ payload }) => ({
        url: '/Staff/StaffMasterSubMaster/CreateEmployeeSubType',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getStaffSubMaster' }],
    }),

    getEmployeeSubTypeById: builder.query({
      query: ({ employeeSubTypeId, loginUserId, menuId }) => {
        return {
          url: `/Staff/StaffMasterSubMaster/GetEmployeeSubTypeById/${employeeSubTypeId}/${loginUserId}/${menuId}`,
        };
      },
      providesTags: (result, error, employeeSubTypeId) => [
        { type: 'getStaffSubMaster', id: employeeSubTypeId?.toString() },
      ],
    }),

    updateEmployeeSubType: builder.mutation({
      query: ({ payload }) => ({
        url: '/Staff/StaffMasterSubMaster/UpdateEmployeeSubType',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteEmployeeSubType: builder.mutation({
      query: ({ employeeSubTypeId, loginUserId, menuId }) => ({
        url: `/Staff/StaffMasterSubMaster/EmployeeSubType/${employeeSubTypeId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getStaffSubMaster'],
    }),

    // * Staff Category API
    getStaffCategoryDetails: builder.query({
      query: ({ payload }) => ({
        url: '/Staff/StaffMasterSubMaster/GetAllStaffCategory',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getstaffSubMaster'],
    }),

    addStaffCategory: builder.mutation({
      query: ({ payload }) => ({
        url: '/Staff/StaffMasterSubMaster/CreateStaffCategory',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getStaffSubMaster' }],
    }),

    getStaffCategoryById: builder.query({
      query: ({ staffCategoryId, loginUserId, menuId }) => {
        return {
          url: `/Staff/StaffMasterSubMaster/GetStaffCategoryById/${staffCategoryId}/${loginUserId}/${menuId}`,
        };
      },
      providesTags: (result, error, employeeSubTypeId) => [
        { type: 'getStaffSubMaster', id: employeeSubTypeId?.toString() },
      ],
    }),
    
    getAllEmploymentTypesSearch: builder.query({
      query: ( payload ) => {        
        return {
          url: '/Staff/StaffMasterSubMaster/GetAllEmploymentTypesSearch',
          method: 'POST',
          body: payload,
        };
      },
      transformResponse: (response) => ({
        totalPages: response?.Data?.TotalPages,
        totalRecords:response?.Data?.TotalRecords,
        records:response?.Data?.Records
      }),
      providesTags: (result, error, payload) => [{ type: 'GetAllEmploymentTypes' }],
    }),
    getAllPhysicianLevelSearch: builder.query({
      query: ( payload ) => {        
        return {
          url: '/Staff/StaffMasterSubMaster/GetAllPhysicianLevelSearch',
          method: 'POST',
          body: payload,
        };
      },
      transformResponse: (response) => ({
        totalPages: response?.Data?.TotalPages,
        totalRecords:response?.Data?.TotalRecords,
        records:response?.Data?.Records
      }),
      providesTags: (result, error, payload) => [{ type: 'GetAllEmploymentTypes' }],
    }),
    getAllEmployeeSubTypesSearch: builder.query({
      query: ( payload ) => {        
        return {
          url: '/Staff/StaffMasterSubMaster/GetAllEmployeeSubTypesSearch',
          method: 'POST',
          body: payload,
        };
      },
      transformResponse: (response) => ({
        totalPages: response?.Data?.TotalPages,
        totalRecords:response?.Data?.TotalRecords,
        records:response?.Data?.Records
      }),
      providesTags: (result, error, payload) => [{ type: 'GetAllEmploymentTypes' }],
    }),
    getAllStaffCategorySearch: builder.query({
      query: ( payload ) => {        
        return {
          url: '/Staff/StaffMasterSubMaster/GetAllStaffCategorySearch',
          method: 'POST',
          body: payload,
        };
      },
      transformResponse: (response) => ({
        totalPages: response?.Data?.TotalPages,
        totalRecords:response?.Data?.TotalRecords,
        records:response?.Data?.Records
      }),
      providesTags: (result, error, payload) => [{ type: 'GetAllEmploymentTypes' }],
    }),
    updateStaffCategory: builder.mutation({
      query: ({ payload }) => ({
        url: '/Staff/StaffMasterSubMaster/UpdateStaffCategory',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteStaffCategory: builder.mutation({
      query: ({ staffCategoryId, loginUserId, menuId }) => ({
        url: `/Staff/StaffMasterSubMaster/StaffCategory/${staffCategoryId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getStaffSubMaster'],
    }),
  }),
});

export const {
  useGetEmploymentTypesDetailsQuery,
  useAddEmploymentTypeMutation,
  useGetEmploymentTypeByIdQuery,
  useUpdateEmploymentTypeMutation,
  useDeleteEmploymentTypeMutation,

  useGetPhysicianLevelDetailsQuery,
  useAddPhysicianLevelMutation,
  useGetPhysicianLevelByIdQuery,
  useUpdatePhysicianLevelMutation,
  useDeletePhysicianLevelMutation,

  useGetEmployeeSubTypesDetailsQuery,
  useAddEmployeeSubTypeMutation,
  useGetEmployeeSubTypeByIdQuery,
  useUpdateEmployeeSubTypeMutation,
  useDeleteEmployeeSubTypeMutation,

  useGetStaffCategoryDetailsQuery,
  useAddStaffCategoryMutation,
  useGetStaffCategoryByIdQuery,
  useUpdateStaffCategoryMutation,
  useDeleteStaffCategoryMutation,
  useLazyGetAllEmploymentTypesSearchQuery,
  useLazyGetAllPhysicianLevelSearchQuery,
  useLazyGetAllEmployeeSubTypesSearchQuery,
  useLazyGetAllStaffCategorySearchQuery
  
  
} = staffSubMasterApi;
