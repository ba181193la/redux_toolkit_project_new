import { createSlice } from '@reduxjs/toolkit';

const incidentCategorySlice = createSlice({
  name: 'incidentCategory',
  initialState: {
    affectedCategory: {
      affectedCategoryPageIndex: 0,
      affectedCategoryPageSize: 25,
    },
    mainCategory: {
      mainCategoryPageIndex: 0,
      mainCategoryPageSize: 25,
    },
    subCategory: {
      subCategoryPageIndex: 0,
      subCategoryPageSize: 25,
    },
    incidentDetails: {
      incidentDetailsPageIndex: 0,
      incidentDetailsPageSize: 25,
    },
  },
  reducers: {
    setAffectedCategoryPageIndex: (state, { payload }) => {
      state.affectedCategory.affectedCategoryPageIndex = payload;
    },
    setAffectedCategoryPageSize: (state, { payload }) => {
      state.affectedCategory.affectedCategoryPageSize = payload;
    },

    setMainCategoryPageIndex: (state, { payload }) => {
      state.mainCategory.mainCategoryPageIndex = payload;
    },
    setMainCategoryPageSize: (state, { payload }) => {
      state.mainCategory.mainCategoryPageSize = payload;
    },

    setSubCategoryPageIndex: (state, { payload }) => {
      state.subCategory.subCategoryPageIndex = payload;
    },
    setSubCategoryPageSize: (state, { payload }) => {
      state.subCategory.subCategoryPageSize = payload;
    },

    setIncidentDetailsPageIndex: (state, { payload }) => {
      state.incidentDetails.incidentDetailsPageIndex = payload;
    },
    setIncidentDetailsPageSize: (state, { payload }) => {
      state.incidentDetails.incidentDetailsPageSize = payload;
    },
  },
});

export const {
  setAffectedCategoryPageIndex,
  setAffectedCategoryPageSize,

  setMainCategoryPageIndex,
  setMainCategoryPageSize,

  setSubCategoryPageIndex,
  setSubCategoryPageSize,

  setIncidentDetailsPageIndex,
  setIncidentDetailsPageSize,
} = incidentCategorySlice.actions;

export default incidentCategorySlice.reducer;
