import { createSlice } from '@reduxjs/toolkit';

const incidentRiskLevelSlice = createSlice({
  name: 'incidentRiskLevel',
  initialState: {
    loading: false,
    Rohan: 5,
    Simbha: true,
    // error: null,
    pageIndex: 0,
    pageSize: 25,
    // records: [],
    labelDetails: [],
    pageSize1:25,
    categoryAffectedRecords: [],
    consequenceLevelRecords: [],
    likelihoodRecords: [],
    consequenceRecords: [],
    IncidentRiskLevelRecords: [],
  },
  reducers: {
    setPageIndex: (state, { payload }) => {
      state.pageIndex = payload;
    },
    setPageSize: (state, { payload }) => {
      state.pageSize = payload;
    },
    setPageSize1: (state, { payload }) => {
      state.pageSize1 = payload;
    },
    setCategoryAffectedRecords: (state, { payload }) => {
      state.categoryAffectedRecords = payload;
    },
    setConsequenceLevelRecords: (state, { payload }) => {
      state.consequenceLevelRecords = payload;
    },
    setConsequenceRecords: (state, { payload }) => {
      state.consequenceRecords = payload;
    },
    setLiklihoodRecords: (state, { payload }) => {
      state.likelihoodRecords = payload;
    },
    setIncidentRiskLevelRecords: (state, { payload }) => {
      state.IncidentRiskLevelRecords = payload;
    },
  },
});

export const {
  setPageIndex,
  setPageSize,
  setCategoryAffectedRecords,
  setConsequenceLevelRecords,
  setLiklihoodRecords,
  setIncidentRiskLevelRecords,
  setConsequenceRecords,
  setPageSize1
} = incidentRiskLevelSlice.actions;
export default incidentRiskLevelSlice.reducer;
