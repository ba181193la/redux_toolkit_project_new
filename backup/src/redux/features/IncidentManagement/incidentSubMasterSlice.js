import { createSlice } from '@reduxjs/toolkit';

const incidentSubMasterSlice = createSlice({
  name: 'incidentSubMaster',
  initialState: {
    loading: false,
    error: null,
    records: [],
    labelDetails: [],
    staffPopupPageIndex: 0,
    staffPopupPageSize: 25,

    referenceNumber: {
      referenceNumberPageIndex: 0,
      referenceNumberPageSize: 25,
    },

    incidentType: {
      incidentTypePageIndex: 0,
      incidentTypePageSize: 25,
      sentinelEventPageIndex: 0,
      sentinelEventPageSize: 25,
    },

    harmLevel: {
      harmLevelPageIndex: 0,
      harmLevelPageSize: 25,
    },

    medicationHarmLevel: {
      medicationHarmLevelPageIndex: 0,
      medicationHarmLevelPageSize: 25,
    },

    levelOfStaffNegligence: {
      negligencePageIndex: 0,
      negligencePageSize: 25,
    },

    reportToExternalBody: {
      externalBodyPageIndex: 0,
      externalBodyPageSize: 25,
    },

    contributingMainFactor: {
      mainFactorPageIndex: 0,
      mainFactorPageSize: 25,
    },
    contributingSubFactor: {
      subFactorPageIndex: 0,
      subFactorPageSize: 25,
    },
    jawdaIncidentLevel: {
      jawdaIncidentLevelPageIndex: 0,
      jawdaIncidentLevelPageSize: 25,
    },

    rcaQuestions: {
      rcaQuestionsPageIndex: 0,
      rcaQuestionsPageSize: 25,
    },
  },
  reducers: {
    setStaffPopupPageIndex: (state, { payload }) => {
      state.staffPopupPageIndex = payload;
    },
    setStaffPopupPageSize: (state, { payload }) => {
      state.staffPopupPageSize = payload;
    },

    setReferenecNumberPageIndex: (state, { payload }) => {
      state.referenceNumber.referenceNumberPageIndex = payload;
    },
    setReferenecNumberPageSize: (state, { payload }) => {
      state.referenceNumber.referenceNumberPageSize = payload;
    },

    setIncidentTypePageIndex: (state, { payload }) => {
      state.incidentType.incidentTypePageIndex = payload;
    },
    setIncidentTypePageSize: (state, { payload }) => {
      state.incidentType.incidentTypePageSize = payload;
    },
    setSentinelEventPageIndex: (state, { payload }) => {
      state.incidentType.sentinelEventPageIndex = payload;
    },
    setSentinelEventPageSize: (state, { payload }) => {
      state.incidentType.sentinelEventPageSize = payload;
    },

    setHarmLevelPageIndex: (state, { payload }) => {
      state.harmLevel.harmLevelPageIndex = payload;
    },
    setHarmLevelPageSize: (state, { payload }) => {
      state.harmLevel.harmLevelPageSize = payload;
    },

    setMedicationHarmLevelPageIndex: (state, { payload }) => {
      state.medicationHarmLevel.medicationHarmLevelPageIndex = payload;
    },
    setMedicationHarmLevelPageSize: (state, { payload }) => {
      state.medicationHarmLevel.medicationHarmLevelPageSize = payload;
    },

    setLevelOfStaffNegligencePageIndex: (state, { payload }) => {
      state.levelOfStaffNegligence.negligencePageIndex = payload;
    },
    setLevelOfStaffNegligencePageSize: (state, { payload }) => {
      state.levelOfStaffNegligence.negligencePageSize = payload;
    },

    setReportToExternalBodyPageIndex: (state, { payload }) => {
      state.reportToExternalBody.externalBodyPageIndex = payload;
    },
    setReportToExternalBodyPageSize: (state, { payload }) => {
      state.reportToExternalBody.externalBodyPageSize = payload;
    },

    setContributingMainFactorPageIndex: (state, { payload }) => {
      state.contributingMainFactor.mainFactorPageIndex = payload;
    },
    setContributingMainFactorPageSize: (state, { payload }) => {
      state.contributingMainFactor.mainFactorPageSize = payload;
    },

    setContributingSubFactorPageIndex: (state, { payload }) => {
      state.contributingSubFactor.subFactorPageIndex = payload;
    },
    setContributingSubFactorPageSize: (state, { payload }) => {
      state.contributingSubFactor.subFactorPageSize = payload;
    },

    setjawdaIncidentLevelPageIndex: (state, { payload }) => {
      state.jawdaIncidentLevel.jawdaIncidentLevelPageIndex = payload;
    },
    setjawdaIncidentLevelPageSize: (state, { payload }) => {
      state.jawdaIncidentLevel.jawdaIncidentLevelPageSize = payload;
    },

    setRCAQuestionsPageIndex: (state, { payload }) => {
      state.rcaQuestions.rcaQuestionsPageIndex = payload;
    },
    setRCAQuestionsPageSize: (state, { payload }) => {
      state.rcaQuestions.rcaQuestionsPageSize = payload;
    },
  },
});

export const {
  setStaffPopupPageIndex,
  setStaffPopupPageSize,
  setReferenecNumberPageIndex,
  setReferenecNumberPageSize,
  setIncidentTypePageIndex,
  setIncidentTypePageSize,
  setSentinelEventPageIndex,
  setSentinelEventPageSize,
  setHarmLevelPageIndex,
  setHarmLevelPageSize,
  setMedicationHarmLevelPageIndex,
  setMedicationHarmLevelPageSize,
  setLevelOfStaffNegligencePageIndex,
  setLevelOfStaffNegligencePageSize,
  setReportToExternalBodyPageIndex,
  setReportToExternalBodyPageSize,
  setContributingMainFactorPageIndex,
  setContributingMainFactorPageSize,
  setContributingSubFactorPageIndex,
  setContributingSubFactorPageSize,
  setjawdaIncidentLevelPageIndex,
  setjawdaIncidentLevelPageSize,
  setRCAQuestionsPageIndex,
  setRCAQuestionsPageSize,
} = incidentSubMasterSlice.actions;
export default incidentSubMasterSlice.reducer;
