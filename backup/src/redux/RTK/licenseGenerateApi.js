import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const licenseGenerateApi = createApi({
  reducerPath: 'licenseGenerateRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  endpoints: (builder) => ({
    generateLicense: builder.mutation({
      query: ({ payload }) => ({
        url: '/LicenseGenerate/GenerateLicense',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useGenerateLicenseMutation } = licenseGenerateApi;
