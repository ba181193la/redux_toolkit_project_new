import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const groupConfigApi = createApi({
  reducerPath: 'groupConfigRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: 'https://tagstationery.travelport.online/api',
  }),
  tagTypes: ['getGroupConfig'],
  endpoints: (builder) => ({
    getGroupConfigData: builder.query({
      query: ({ menuId, loginUserId, headerFacilityId }) => {
        return {
          url: `/GroupConfig/PageLoadData/${menuId}/${loginUserId}/${headerFacilityId}`,
        };
      },
    }),
    updateGroupConfigData: builder.mutation({
      query: ({ payload }) => {
        return {
          url: '/GroupConfig',
          method: 'PUT',
          body: payload,
        };
      },
      invalidatesTags: ['getGroupConfig'],
    }),
  }),
});

export const { useGetGroupConfigDataQuery, useUpdateGroupConfigDataMutation } =
  groupConfigApi;
