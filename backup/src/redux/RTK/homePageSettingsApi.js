import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const homePageSettingsApi = createApi({
  reducerPath: 'homePageSettingsRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: [
    'getFavouritesList',
    'getPendingTasks'
  ],
  endpoints: (builder) => ({
  
    getFavouritesList: builder.query({
      query: ({ loginUserId }) => ({
        url: `/HomePageSettings/PageLoadData/${loginUserId}`,
        method: 'GET'
      }),
      transformResponse: (response) => ({
        Records: response.Data,
      }),
      providesTags: (result, error, payload) => [
        { type: 'getFavouritesList' },
      ],
    }),
    getPendingTasks: builder.query({
      query: ({ loginUserId }) => ({
        url: `/HomePageSettings/GetPendingTasks/${loginUserId}`,
        method: 'GET'
      }),
      transformResponse: (response) => ({
        updatePendingTaskData: response.Data,
      }),
      providesTags: (result, error, payload) => [
        { type: 'getPendingTasks' },
      ],
    }),
    getOrganizationLevelMenuList: builder.query({
      query: ({ loginUserId }) => ({
        url: `/HomePageSettings/GetOrganizationMenu/${loginUserId}`,
        method: 'GET'
      }),
      transformResponse: (response) => ({
        organizationLevelMenuList: response.Data?.MenuList || []
      }),

    }),
    getUserLevelMenuList: builder.query({
      query: ({ loginUserId }) => ({
        url: `/HomePageSettings/GetUserMenu/${loginUserId}`,
        method: 'GET'
      }),
      transformResponse: (response) => ({
        userLevelMenuList: response.Data || []
      }),

    }),
    updatePendingTasks: builder.mutation({
      query: ({ payload}) => ({
        url: `/HomePageSettings/UpdatePendingTasks`,
        method: 'PUT',
        body: payload,
      }),
      providesTags: ['getPendingTasks'],
    }),
    createOrganizationLevelMenuList: builder.mutation({
      query: ({ payload }) => ({
        url: '/HomePageSettings/CreateOrganizationLevelMenu',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['getFavouritesList'],
    }),
    createUserLevelMenuList: builder.mutation({
      query: ({ payload }) => ({
        url: '/HomePageSettings/CreateUserLevelMenu',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['getFavouritesList'],
    })
  }),
});

export const {
  useGetFavouritesListQuery,
  useGetPendingTasksQuery,
  useGetOrganizationLevelMenuListQuery,
  useGetUserLevelMenuListQuery,
  useUpdatePendingTasksMutation,
  useCreateUserLevelMenuListMutation,
  useCreateOrganizationLevelMenuListMutation
  
} = homePageSettingsApi;
