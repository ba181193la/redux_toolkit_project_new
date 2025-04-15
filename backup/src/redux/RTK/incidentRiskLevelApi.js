import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../services/customFetchBaseQuery';

export const incidentRiskLevelApi = createApi({
  reducerPath: 'incidentRiskLevelRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: ['getStaffSubMaster'],
  endpoints: (builder) => ({
    // * Employment type API
    getCategoryDetails: builder.query({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/GetAllCategoryAffected',
        method: 'POST',
        body: payload,
      }),

      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getCategoryDetails'],
    }),
    getConsequencelevelDetails: builder.query({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/GetAllConsequenceLevel',
        method: 'POST',
        body: payload,
      }),

      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getConsequenceLevelDetails'],
    }),
    getConsequenceDetails: builder.query({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/GetAllConsequence',
        method: 'POST',
        body: payload,
      }),

      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getConsequenceDetails'],
    }),

    getLikelihoodDetails: builder.query({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/GetAllLikelihood',
        method: 'POST',
        body: payload,
      }),
     
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getLikelihoodDetails'],
    }),
    getIncidentRiskDetails: builder.query({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/GetAllIncidentRiskLevel',
        method: 'POST',
        body: payload,
      }),
    
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getIncidentRiskDetails'],
    }),
    // getIncidentRiskLevelCalculation: builder.query({
    //   query: ({ payload }) => ({
    //     url: '/RiskLevelCalculation/GetAllIncidentRiskLevelCalculation',
    //     method: 'POST',
    //     body: payload,
    //   }),
    //   transformResponse: (response) => ({
    //     TotalPages: response.Data.TotalPages,
    //     TotalRecords: response.Data.TotalRecords,
    //     Records: response.Data.Records,
    //   }),
    //   providesTags: ['getConsequenceDetails'],
    // }),

    getIncidentRiskLevelCalculation: builder.query({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/GetAllIncidentRiskLevelCalculation',
        method: 'POST',
        body: { payload },
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data?.TotalPages || 0,
        TotalRecords: response.Data?.TotalRecords || 0,
        Records: response.Data?.data || [],
      }),
      providesTags: ['IncidentRiskLevel'], // ✅ This allows invalidation later
    }),

    saveIncidentRiskLevelCalculation: builder.mutation({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/SaveIncidentRiskLevelCalculation',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['IncidentRiskLevel'], // ✅ This forces refetch after saving
    }),

    addCategory: builder.mutation({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/CreateCategoryAffected',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getCategoryDetails' }],
    }),
    reorderCategoryAffected: builder.mutation({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/ReorderCategoryAffected',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getReorderCategorydetails' }],
    }),
    addLiklihood: builder.mutation({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/CreateLikelihood',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getCategoryDetails' }],
    }),
    addConsequence: builder.mutation({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/CreateConsequence',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getCategoryDetails' }],
    }),
    addConsequenceLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/CreateConsequenceLevel',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getConsequenceLevelDetails' }],
    }),
    addRiskLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/CreateIncidentRiskLevel',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getIncidentRiskDetails' }],
    }),
    deleteCategory: builder.mutation({
      query: ({ categoryAffectedId, loginUserId, menuId }) => ({
        url: `/RiskLevelCalculation/DeleteCategoryAffected/${categoryAffectedId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'getCategory' }],
    }),
    deleteLiklihood: builder.mutation({
      query: ({ likelihoodId, loginUserId, menuId }) => ({
        url: `/RiskLevelCalculation/DeleteLikelihood/${likelihoodId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'getliklihood' }],
    }),
    deleteConsequence: builder.mutation({
      query: ({ ConsequenceId, loginUserId, menuId }) => ({
        url: `/RiskLevelCalculation/DeleteConsequence/${ConsequenceId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'getCategory' }],
    }),
    deleteRiskLevel: builder.mutation({
      query: ({ incidentRiskLevelId, loginUserId, menuId }) => ({
        url: `/RiskLevelCalculation/DeleteIncidentRiskLevel/${incidentRiskLevelId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'getliklihood' }],
    }),
    deleteConsequenceLevel: builder.mutation({
      query: ({ consequenceLevelId, loginUserId, menuId }) => ({
        url: `/RiskLevelCalculation/DeleteConsequenceLevel/${consequenceLevelId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'getliklihood' }],
    }),
    updateCategory: builder.mutation({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/UpdateCategoryAffected',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getAllCategory' }],
    }),
    updateConsequenceLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/updateConsequenceLevel',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getAllConsequenceLevel' }],
    }),

    reorderConsequenceLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/ReorderConsequenceLevel',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getReorderCategorydetails' }],
    }),
    updateLiklihood: builder.mutation({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/UpdateLikelihood',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getAllLiklihood' }],
    }),
    reorderliklihood: builder.mutation({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/ReorderLikelihood',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getAllLiklihood' }],
    }),
    updateConsequence: builder.mutation({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/UpdateConsequence',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getAllConsequence' }],
    }),
    reorderConsequence: builder.mutation({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/ReorderConsequence',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getAllConsequence' }],
    }),
    updateIncidentRiskLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/UpdateIncidentRiskLevel',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getIncidentRiskDetails' }],
    }),
    reorderIncidentriskLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/RiskLevelCalculation/ReorderIncidentRiskLevel',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [{ type: 'getIncidentRiskDetails' }],
    }),
    getCategoryById: builder.query({
      query: ({ categoryAffectedId, loginUserId, menuId }) => {
        return {
          url: `/RiskLevelCalculation/GetCategoryAffectedById/${categoryAffectedId}/${loginUserId}/${menuId}`,
        };
      },
    }),
    getConsequenceLevelbyId: builder.query({
      query: ({ consequenceLevelId, loginUserId }) => {
        return {
          url: `/RiskLevelCalculation/GetConsequenceLevelById/${consequenceLevelId}/${loginUserId}`,
        };
      },
    }),
    getIncidentRiskLevelById: builder.query({
      query: ({ incidentRiskLevelId, loginUserId }) => {
        return {
          url: `/RiskLevelCalculation/GetIncidentRiskLevelById/${incidentRiskLevelId}/${loginUserId}`,
        };
      },
    }),
    getConsequenceById: builder.query({
      query: ({ consequenceId, loginUserId, menuId }) => {
        return {
          url: `/RiskLevelCalculation/GetConsequenceById/${consequenceId}/${loginUserId}`,
        };
      },
    }),

    getLiklihoodById: builder.query({
      query: ({ likelihoodId, loginUserId }) => {
        return {
          url: `/RiskLevelCalculation/GetLikelihoodById/${likelihoodId}/${loginUserId}`,
        };
      },
    }),
  }),
});

export const {
  useGetCategoryDetailsQuery,
  useGetConsequenceDetailsQuery,
  useGetIncidentRiskDetailsQuery,
  useGetConsequencelevelDetailsQuery,
  useGetIncidentRiskLevelCalculationQuery,
  useSaveIncidentRiskLevelCalculationMutation,
  useAddCategoryMutation,
  useAddConsequenceLevelMutation,
  useAddConsequenceMutation,
  useGetCategoryByIdQuery,
  useGetConsequenceByIdQuery,
  useGetIncidentRiskLevelByIdQuery,
  useGetConsequenceLevelbyIdQuery,
  useUpdateCategoryMutation,
  useReorderCategoryAffectedMutation,
  useUpdateConsequenceLevelMutation,
  useReorderConsequenceLevelMutation,
  useUpdateConsequenceMutation,
  useReorderConsequenceMutation,
  useUpdateIncidentRiskLevelMutation,
  useReorderIncidentriskLevelMutation,
  useUpdateLiklihoodMutation,
  useReorderliklihoodMutation,
  useDeleteCategoryMutation,
  useDeleteConsequenceLevelMutation,
  useDeleteConsequenceMutation,
  useDeleteLiklihoodMutation,
  useDeleteRiskLevelMutation,
  useGetLikelihoodDetailsQuery,
  useAddLiklihoodMutation,
  useAddRiskLevelMutation,
  useGetLiklihoodByIdQuery,
} = incidentRiskLevelApi;
