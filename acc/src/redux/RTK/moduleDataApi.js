import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const moduleDataApi = createApi({
  reducerPath: 'moduleData',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  endpoints: (builder) => ({   
    getLabels: builder.query({
      query: ({ menuId, moduleId }) => {
        return { url: `/LabelAccess/getLabel/${menuId}/${moduleId}`};
      },
    }),
    getFields: builder.query({
      query: ({ menuId, moduleId }) => {
        return { url: `/LabelAccess/getField/${menuId}/${moduleId}` };
      },
    }),
  }),
});

export const { useGetLabelsQuery, useGetFieldsQuery } = moduleDataApi;
