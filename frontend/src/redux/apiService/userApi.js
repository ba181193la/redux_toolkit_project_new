import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi', // Optional: default is 'api'
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }), // Backend URL
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Fetch all users
    fetchUsers: builder.query({
      query: () => '/user',
      providesTags: ['User'],
    }),

    // Get single user
    getUserById: builder.query({
      query: (id) => `/user/${id}`,
      providesTags: ['User'],
    }),

    // Create user
    createUser: builder.mutation({
      query: (newUser) => ({
        url: '/user',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),

    // Update user
    updateUser: builder.mutation({
      query: ({ id, ...updatedUser }) => ({
        url: `/user/${id}`,
        method: 'PUT',
        body: updatedUser,
      }),
      invalidatesTags: ['User'],
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useFetchUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;