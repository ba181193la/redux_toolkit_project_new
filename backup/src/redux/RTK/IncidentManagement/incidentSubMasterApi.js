import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBaseQuery from '../../../services/customFetchBaseQuery';

export const incidentSubMasterApi = createApi({
  reducerPath: 'incidentSubMasterRTK',
  baseQuery: customFetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  tagTypes: [''],
  endpoints: (builder) => ({
    getPageLoadData: builder.query({
      query: ({ menuId, loginUserId, headerFacilityId }) => {
        return {
          url: `/IncidentSubMaster/PageLoadData/${menuId}/${loginUserId}/${headerFacilityId}`,
        };
      },
    }),

    //* Reference Number API Queries

    getReferenceNumberDetails: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/GetAllIncidentReferenceNumber',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getReferenceNumber'],
    }),

    addReferenceNumber: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/CreateIncidentReferenceNumber',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'addReferenceNumber' }],
    }),

    getReferenceNumberDataById: builder.query({
      query: ({ incidentReferenceId, loginUserId }) => {
        return {
          url: `/IncidentSubMaster/GetIncidentReferenceNumberById/${incidentReferenceId}/${loginUserId}`,
        };
      },
      providesTags: (result, error, incidentReferenceId) => [
        { type: 'getReferenceById', id: incidentReferenceId?.toString() },
      ],
    }),

    updateReferenceNumber: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/UpdateIncidentReferenceNumber',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteReferenceNumber: builder.mutation({
      query: ({ incidentReferenceId, loginUserId, menuId }) => ({
        url: `/IncidentSubMaster/DeleteIncidentReferenceNumber/${incidentReferenceId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteReferenceNumber'],
    }),

    //* Incident Type API Queries

    getIncidentTypeDetails: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/GetAllIncidentType',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getIncidentType'],
    }),

    getAllSentinelEvent: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/GetAllSentinelEvent',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getAllSentinelEvent'],
    }),

    addIncidentType: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/CreateIncidentType',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'addIncidentType' }],
    }),

    getIncidentTypeDataById: builder.query({
      query: ({ incidentTypeId, loginUserId, menuId }) => {
        return {
          url: `/IncidentSubMaster/GetIncidentTypeById/${incidentTypeId}/${loginUserId}/${menuId}`,
        };
      },
      providesTags: (result, error, incidentTypeId) => [
        { type: 'getIncidentTypeById', id: incidentTypeId?.toString() },
      ],
    }),

    updateIncidentType: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/UpdateIncidentType',
        method: 'PUT',
        body: payload,
      }),
    }),

    reorderIncidentType: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/ReorderIncidentType',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteIncidentType: builder.mutation({
      query: ({ IncidentTypeId, loginUserId, menuId }) => ({
        url: `/IncidentSubMaster/DeleteIncidentType/${IncidentTypeId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteIncidentType'],
    }),

    downloadIncidentType: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentSubMaster/DownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),

    //* Harm Level API Queries
    getHarmLevelDetails: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/GetAllHarmLevel',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getHarmLevel'],
    }),

    addHarmLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/CreateIncidentHarmLevel',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'addHarmLevel' }],
    }),

    getHarmLevelDataById: builder.query({
      query: ({ incidentHarmLevelId, loginUserId, menuId }) => {
        return {
          url: `/IncidentSubMaster/GetIncidentHarmLevelById/${incidentHarmLevelId}/${loginUserId}/${menuId}`,
        };
      },
      providesTags: (result, error, incidentHarmLevelId) => [
        { type: 'getHarmLevelById', id: incidentHarmLevelId?.toString() },
      ],
    }),

    reorderIncidentHarmLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/ReorderIncidentHarmLevel',
        method: 'PUT',
        body: payload,
      }),
    }),

    updateHarmLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/UpdateIncidentHarmLevel',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteHarmLevel: builder.mutation({
      query: ({ incidentHarmLevelId, loginUserId, menuId }) => ({
        url: `/IncidentSubMaster/DeleteIncidentHarmLevel/${incidentHarmLevelId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteHarmLevel'],
    }),

    downloadHarmLevel: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentSubMaster/HarmlevelDownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),

    //* Medication Harm level
    getMedicationHarmLevelDetails: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/GetAllMedicationHarmLevel',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getMedicationHarmLevel'],
    }),

    addMedicationHarmLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/CreateIncidentMedicationHarmLevel',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'addMedicationHarmLevel' }],
    }),

    getMedicationHarmLevelDataById: builder.query({
      query: ({ medicationHarmLevelId, loginUserId, menuId }) => {
        return {
          url: `/IncidentSubMaster/GetIncidentMedicationHarmLevelById/${medicationHarmLevelId}/${loginUserId}/${menuId}`,
        };
      },
      providesTags: (result, error, medicationHarmLevelId) => [
        {
          type: 'getMedicationHarmLevelById',
          id: medicationHarmLevelId?.toString(),
        },
      ],
    }),

    updateMedicationHarmLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/UpdateIncidentMedicationHarmLevel',
        method: 'PUT',
        body: payload,
      }),
    }),

    reorderMedicationHarmLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/ReorderIncidentMedicationHarmLevel',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteMedicationHarmLevel: builder.mutation({
      query: ({ medicationHarmLevelId, loginUserId, menuId }) => ({
        url: `/IncidentSubMaster/DeleteIncidentMedicationHarmLevel/${medicationHarmLevelId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteMedicationHarmLevel'],
    }),

    downloadMedicationHarmLevel: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentSubMaster/MedicationHarmlevelDownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),

    //* Level of staff Negligence
    getLevelOfStaffNegligence: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/GetAllStaffNegligence',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getLevelOfNegligence'],
    }),

    addLevelOfStaffNegligence: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/CreateStaffNegligence',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'addLevelOfNegligence' }],
    }),

    getStaffNegligenceDataById: builder.query({
      query: ({ staffNegligenceId, loginUserId }) => {
        return {
          url: `/IncidentSubMaster/GetStaffNegligenceById/${staffNegligenceId}/${loginUserId}`,
        };
      },
      providesTags: (result, error, staffNegligenceId) => [
        {
          type: 'getStaffNegligenceById',
          id: staffNegligenceId?.toString(),
        },
      ],
    }),

    reorderStaffNegligence: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/ReorderStaffNegligence',
        method: 'PUT',
        body: payload,
      }),
    }),

    updateStaffNegligence: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/UpdateStaffNegligence',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteStaffNegligence: builder.mutation({
      query: ({ staffNegligenceId, loginUserId, menuId }) => ({
        url: `/IncidentSubMaster/DeleteStaffNegligence/${staffNegligenceId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteStaffNegligence'],
    }),

    downloadStaffNegligence: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentSubMaster/StaffNegligenceDownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),

    //* Report to External Body
    getReportToExternalBody: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/GetAllReportToExternalBody',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getReportToExternalBody'],
    }),

    addReportToExternalBody: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/CreateReportToExternalBody',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'addReportToExternalBody' }],
    }),

    getReportToExternalBodyById: builder.query({
      query: ({ externalBodyId, loginUserId }) => {
        return {
          url: `/IncidentSubMaster/GetReportToExternalBodyById/${externalBodyId}/${loginUserId}`,
        };
      },
      providesTags: (result, error, externalBodyId) => [
        {
          type: 'getReportToExternalBodyById',
          id: externalBodyId?.toString(),
        },
      ],
    }),

    reorderExternalBody: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/ReorderReportToExternalBody',
        method: 'PUT',
        body: payload,
      }),
    }),

    UpdateExternalBody: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/UpdateReportToExternalBody',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteExternalBody: builder.mutation({
      query: ({ externalBodyId, loginUserId, menuId }) => ({
        url: `/IncidentSubMaster/DeleteReportToExternalBody/${externalBodyId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteExternalBody'],
    }),

    //* Contributing Main Factor

    getContributingMainFactor: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/GetAllContributingMainFactor',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getContributingMainFactor'],
    }),

    addContributingMainFactor: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/CreateContributingMainFactor',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'addContributingMainFactor' }],
    }),

    getContributingMainFactorById: builder.query({
      query: ({ mainFactorId, loginUserId }) => {
        return {
          url: `/IncidentSubMaster/GetContributingMainFactorById/${mainFactorId}/${loginUserId}`,
        };
      },
      providesTags: (result, error, mainFactorId) => [
        {
          type: 'getContributingMainFactorById',
          id: mainFactorId?.toString(),
        },
      ],
    }),

    UpdateContributingMainFactor: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/UpdateContributingMainFactor',
        method: 'PUT',
        body: payload,
      }),
    }),

    reorderMainFactor: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/ReorderContributingMainFactor',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteContributingMainFactor: builder.mutation({
      query: ({ mainFactorId, loginUserId, menuId }) => ({
        url: `/IncidentSubMaster/DeleteContributingMainFactor/${mainFactorId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteContributingMainFactor'],
    }),

    downloadContributingMainFactor: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentSubMaster/MainFactorDownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),

    //* Contributing Sub Factor

    getContributingSubFactor: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/GetAllContributingSubFactor',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getContributingSubFactor'],
    }),

    addContributingSubFactor: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/CreateContributingSubFactor',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'addContributingSubFactor' }],
    }),

    getContributingSubFactorById: builder.query({
      query: ({ subFactorId, loginUserId }) => {
        return {
          url: `/IncidentSubMaster/GetContributingSubFactorById/${subFactorId}/${loginUserId}`,
        };
      },
      providesTags: (result, error, subFactorId) => [
        {
          type: 'getContributingSubFactorById',
          id: subFactorId?.toString(),
        },
      ],
    }),

    UpdateContributingSubFactor: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/UpdateContributingSubFactor',
        method: 'PUT',
        body: payload,
      }),
    }),

    reorderSubFactor: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/ReorderContributingSubFactor',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteContributingSubFactor: builder.mutation({
      query: ({ subFactorId, loginUserId, menuId }) => ({
        url: `/IncidentSubMaster/DeleteContributingSubFactor/${subFactorId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteContributingSubFactor'],
    }),

    downloadContributingSubFactor: builder.mutation({
      query: ({ payload, downloadType }) => ({
        url: `/IncidentSubMaster/SubFactorDownloadData/${downloadType}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.blob(),
      }),
    }),

    //* Common setup
    getCommonSetup: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/GetCommonSetupSubMaster',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getCommonSetup'],
    }),

    UpdateCommonSetup: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/SubmitCommonSetupSubMaster',
        method: 'PUT',
        body: payload,
      }),
    }),

    //* Jawda Incident Level

    getJawdaIncidentLevel: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/GetAllJAWDAIncidentLevel',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getJAWDAIncidentLevel'],
    }),

    addJAWDAIncidentLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/CreateJAWDAIncidentLevel',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'addJAWDAIncidentLevel' }],
    }),

    getJAWDAIncidentLevelById: builder.query({
      query: ({ jawdaLevelId, loginUserId }) => {
        return {
          url: `/IncidentSubMaster/GetJAWDAIncidentLevelById/${jawdaLevelId}/${loginUserId}`,
        };
      },
      providesTags: (result, error, jawdaLevelId) => [
        {
          type: 'getJAWDAIncidentLevelById',
          id: jawdaLevelId?.toString(),
        },
      ],
    }),

    reorderJAWDAIncidentLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/ReorderJAWDAIncidentLevel',
        method: 'PUT',
        body: payload,
      }),
    }),

    UpdateJAWDAIncidentLevel: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/UpdateJAWDAIncidentLevel',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteJAWDAIncidentLevel: builder.mutation({
      query: ({ jawdaLevelId, loginUserId, menuId }) => ({
        url: `/IncidentSubMaster/DeleteJAWDAIncidentLevel/${jawdaLevelId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteJAWDAIncidentLevel'],
    }),

    //* Clinical/Non Clinical Definition
    getClinicalNonClinical: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/GetClinicalNonClinicalDefinition',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getClinicalNonClinical'],
    }),

    UpdateClinicalNonClinical: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/SubmitClinicalNonClinicalDefinition',
        method: 'PUT',
        body: payload,
      }),
    }),

    //* Report customization

    UpdateReportCustomization: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/SubmitReportCustomize',
        method: 'PUT',
        body: payload,
      }),
    }),

    //* RCA Questions

    getRCAQuestion: builder.query({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/GetAllIncidentRCAQuestions',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => ({
        TotalPages: response.Data.TotalPages,
        TotalRecords: response.Data.TotalRecords,
        Records: response.Data.Records,
      }),
      providesTags: ['getRCAQuestion'],
    }),

    addRCAQuestion: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/CreateIncidentRCAQuestion',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'addRCAQuestion' }],
    }),

    getRCAQuestionById: builder.query({
      query: ({ RCAQuestionstId, loginUserId }) => {
        return {
          url: `/IncidentSubMaster/GetIncidentRCAQuestionById/${RCAQuestionstId}/${loginUserId}`,
        };
      },
      providesTags: (result, error, RCAQuestionstId) => [
        {
          type: 'getRCAQuestionById',
          id: RCAQuestionstId?.toString(),
        },
      ],
    }),

    reorderRCAQuestion: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/ReorderIncidentRCAQuestion',
        method: 'PUT',
        body: payload,
      }),
    }),

    UpdateRCAQuestion: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/UpdateIncidentRCAQuestion',
        method: 'PUT',
        body: payload,
      }),
    }),

    deleteRCAQuestion: builder.mutation({
      query: ({ RCAQuestionstId, loginUserId, menuId }) => ({
        url: `/IncidentSubMaster/DeleteIncidentRCAQuestion/${RCAQuestionstId}/${loginUserId}/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deleteRCAQuestion'],
    }),

    //* Closure TAT updation

    UpdateClosureTAT: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/SubmitIncidentClosureTAT',
        method: 'PUT',
        body: payload,
      }),
    }),

    //* Incident Search Data updation

    UpdateSearchDataAccess: builder.mutation({
      query: ({ payload }) => ({
        url: '/IncidentSubMaster/SubmitIncidentSearchDataAccess',
        method: 'PUT',
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetPageLoadDataQuery,

  useGetReferenceNumberDetailsQuery,
  useAddReferenceNumberMutation,
  useGetReferenceNumberDataByIdQuery,
  useUpdateReferenceNumberMutation,
  useDeleteReferenceNumberMutation,

  useGetIncidentTypeDetailsQuery,
  useGetAllSentinelEventQuery,
  useAddIncidentTypeMutation,
  useGetIncidentTypeDataByIdQuery,
  useUpdateIncidentTypeMutation,
  useReorderIncidentTypeMutation,
  useDeleteIncidentTypeMutation,
  useDownloadIncidentTypeMutation,

  useGetHarmLevelDetailsQuery,
  useAddHarmLevelMutation,
  useGetHarmLevelDataByIdQuery,
  useUpdateHarmLevelMutation,
  useReorderIncidentHarmLevelMutation,
  useDeleteHarmLevelMutation,
  useDownloadHarmLevelMutation,

  useGetMedicationHarmLevelDetailsQuery,
  useAddMedicationHarmLevelMutation,
  useGetMedicationHarmLevelDataByIdQuery,
  useUpdateMedicationHarmLevelMutation,
  useReorderMedicationHarmLevelMutation,
  useDeleteMedicationHarmLevelMutation,
  useDownloadMedicationHarmLevelMutation,

  useGetLevelOfStaffNegligenceQuery,
  useAddLevelOfStaffNegligenceMutation,
  useGetStaffNegligenceDataByIdQuery,
  useReorderStaffNegligenceMutation,
  useUpdateStaffNegligenceMutation,
  useDeleteStaffNegligenceMutation,
  useDownloadStaffNegligenceMutation,

  useGetReportToExternalBodyQuery,
  useAddReportToExternalBodyMutation,
  useGetReportToExternalBodyByIdQuery,
  useReorderExternalBodyMutation,
  useUpdateExternalBodyMutation,
  useDeleteExternalBodyMutation,

  useGetContributingMainFactorQuery,
  useAddContributingMainFactorMutation,
  useGetContributingMainFactorByIdQuery,
  useUpdateContributingMainFactorMutation,
  useReorderMainFactorMutation,
  useDeleteContributingMainFactorMutation,
  useDownloadContributingMainFactorMutation,

  useGetContributingSubFactorQuery,
  useAddContributingSubFactorMutation,
  useGetContributingSubFactorByIdQuery,
  useUpdateContributingSubFactorMutation,
  useReorderSubFactorMutation,
  useDeleteContributingSubFactorMutation,
  useDownloadContributingSubFactorMutation,

  useGetCommonSetupQuery,
  useUpdateCommonSetupMutation,

  useGetJawdaIncidentLevelQuery,
  useAddJAWDAIncidentLevelMutation,
  useGetJAWDAIncidentLevelByIdQuery,
  useReorderJAWDAIncidentLevelMutation,
  useUpdateJAWDAIncidentLevelMutation,
  useDeleteJAWDAIncidentLevelMutation,

  useGetClinicalNonClinicalQuery,
  useUpdateClinicalNonClinicalMutation,

  useUpdateReportCustomizationMutation,

  useGetRCAQuestionQuery,
  useAddRCAQuestionMutation,
  useGetRCAQuestionByIdQuery,
  useReorderRCAQuestionMutation,
  useUpdateRCAQuestionMutation,
  useDeleteRCAQuestionMutation,

  useUpdateClosureTATMutation,

  useUpdateSearchDataAccessMutation,
} = incidentSubMasterApi;
