import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const formBuilderApi = createApi({
  reducerPath: 'formBuilderRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: [''],
  endpoints: (builder) => ({
    getFormBuilderById: builder.query({
      query: ({ menuId, loginUserId, moduleId, headerFacilityId,tabs }) => {
        return {
          url: `/FormBuilder/GetFormBuilderById/${loginUserId}/${moduleId}/${menuId}/${headerFacilityId}?Tabs=${tabs}`,
        };
      },
    }),
    addForm: builder.mutation({
      query: ({ payload }) => ({
        url: '/Formbuilder',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});
export const { useGetFormBuilderByIdQuery, useAddFormMutation } =
  formBuilderApi;
