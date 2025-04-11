import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const loginApi = createApi({
  reducerPath: 'loginRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    // baseUrl: 'http://rms.zamzamsportsarena.com/swagger/v1/swagger.json'
  }),
  tagTypes: [''],
  endpoints: (builder) => ({
    getLoginPageLoadData: builder.query({
      query: () => {
        return {
          url: `/Login/PageLoadData`,
        };
      },
    }),
    getAzureDetails: builder.query({
      query: ({ companyCode }) => {
        return {
          url: `/Login/getAzureDetails/${companyCode}`,
        };
      },
    }),
    staffLock: builder.query({
      query: ({ employeeId }) => {
        return {
          url: `/Login/StaffAccessLock/${employeeId}`,
        };
      },
    }),
    getSwitchUserId: builder.query({
      query: ({ EmployeeId }) => ({
        url: `/Login/GetUserDetail/${EmployeeId}`,
      }),
    }),
    getFacilityRBAC: builder.query({
      query: ({ EmployeeId }) => ({
        url: `/Login/getFacilityRBAC/${EmployeeId}`,
      }),
    }),
    regenerateToken: builder.query({
      query: ({ employeeID }) => ({
        url: `/Login/ReGenerateJwtToken?user=${employeeID}`,
        method: 'POST',
      }),
    }), // <-- Corrected closing parenthesis here
    getBriefPageLoadData: builder.query({
      query: () => {
        return {
          url: `/ReportIncident/BriefPageLoadData`,
        };
      },
    }),
    getDesignation: builder.query({
      query: ({ deptId }) => {
        return {
          url: `/ReportIncident/BriefLoadDesignation/${deptId}`,
        };
      },
    }),
    getStaffDetailList: builder.query({
      query: ({ facilityId }) => {
        return {
          url: `/ReportIncident/BriefLoadStaff/${facilityId}`,
        };
      },
    }),
    createBriefIncident: builder.mutation({
      query: ({ payload }) => ({
        url: '/ReportIncident/CreateBriefIncident',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetLoginPageLoadDataQuery,
  useLazyGetAzureDetailsQuery,
  useLazyRegenerateTokenQuery,
  useGetBriefPageLoadDataQuery,
  useLazyGetDesignationQuery,
  useGetStaffDetailListQuery,
  useLazyStaffLockQuery,
  useCreateBriefIncidentMutation,
  useLazyGetSwitchUserIdQuery,
  useLazyGetFacilityRBACQuery,
} = loginApi;
