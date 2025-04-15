import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../../services/customFetchBaseQuery';

export const landingPageApi = createApi({
  reducerPath: 'landingPageRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: ['getFavourites'],
  endpoints: (builder) => ({
    getAllFavouritePages: builder.query({
      query: ({ loginUserId }) => ({
        url: `/Dashboard/GetFavouritePages/${loginUserId}`,
        method: 'GET',
      }),
      transformResponse: (response) => ({
        records: response?.Data
      }),
     
      providesTags: () => [{ type: 'getFavourites' }],
    }),
    getShowPendingTask: builder.query({
      query: ({ loginUserId }) => ({
        url: `/HomePageSettings/GetPendingTasks/${loginUserId}`,
        method: 'GET',
      }),
      transformResponse: (response) => ({
        showPendingTaskData: response?.Data
      }),
      providesTags: () => [{ type: 'getFavourites' }],
    }),
    getIncidentCountDeatils: builder.query({
      query: ({payload}) => ({
        url: `/Dashboard/GetDashboardMenus`,
        method: 'POST',
        body:payload
      }),
      transformResponse: (response) => ({
        incidentMenuCountList: response?.Data?.MenuList
      })})
  }),
});

export const {
  useGetAllFavouritePagesQuery,
  useGetShowPendingTaskQuery,
  useGetIncidentCountDeatilsQuery
} = landingPageApi;
