import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const resetPasswordApi = createApi({
  reducerPath: 'resetPasswordRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: ['getResetPassword'],
  endpoints: (builder) => ({
    forgetPasswordMailTrigger: builder.mutation({
      query: ({ employeeId }) => {
        return{
          url: `/Login/ForgotPasswordMailTrigger/${employeeId}`,
          method: 'get',
        }
      },
    }),
    resetPassword : builder.mutation({
      query: ({payload}) => ({
        url: `/Login/ResetPassword`,
        method: 'POST',
        body: payload
      })
    }),
    getResetPasswordUserDetail : builder.query({
      query: ({ employeeId }) => {
        return{
       url: `/Login/getResetPasswordUserDetail/${employeeId}`,
        } 
      }
    }),
    getPasswordPolicyReset: builder.query({
      query: ({ loginUserId, headerFacilityId }) => {
        return {
          url: `/PasswordManagement/GetPasswordPolicyReset/${loginUserId}/${headerFacilityId}`,
          method: 'POST',
        };
      },
      providesTags: (result, error, loginUserId) => [
        { type: 'getPasswordPolicy', id: loginUserId?.toString() },
      ],
    }),
  }),
});

export const { useForgetPasswordMailTriggerMutation, useResetPasswordMutation, useLazyGetResetPasswordUserDetailQuery, useGetPasswordPolicyResetQuery } = resetPasswordApi;
