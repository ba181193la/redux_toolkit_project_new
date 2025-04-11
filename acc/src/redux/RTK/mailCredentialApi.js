import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const mailCredentialApi = createApi({
  reducerPath: 'mailCredentialRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: ['getMailCredential'],
  endpoints: (builder) => ({
    getPageLoadData: builder.query({
      query: ({ menuId, loginUserId, headerFacilityId }) => {
        return {
          url: `/MailCredentials/PageLoadData/${menuId}/${loginUserId}/${headerFacilityId}`,
        };
      },
    }),
    addMailCredential: builder.mutation({
      query: ({ payload }) => ({
        url: '/MailCredentials',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getMailCredential' }],
    }),
  }),
});

export const { useGetPageLoadDataQuery, useAddMailCredentialMutation } =
  mailCredentialApi;
