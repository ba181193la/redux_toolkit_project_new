import { createSlice } from '@reduxjs/toolkit';

const opinionSlice = createSlice({
  name: 'opinion',
  initialState: {
    isPendingFilterApplied: false,
    isCompletedFilterApplied: false,
    pendingFilters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacilityId: 0,
      incidentId: 0,
      // facilityId: "",
      requestedUserId: 0,
      loginUserId: 0,
      moduleId: 0,
      menuId: 0,
      incidentDetailId: 0,
      incidentFromDate: null,
      incidentToDate: null,
    },
    completedFilters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacilityId: 0,
      incidentId: 0,
      // facilityId: "",
      requestedUserId: 0,
      loginUserId: 0,
      moduleId: 0,
      menuId: 0,
      incidentDetailId: 0,
      incidentFromDate: null,
      incidentToDate: null,
    },
  },
  reducers: {
    setPendingFilters: (state, { payload }) => {
      // Ensure we update only the necessary properties
      Object.assign(state.pendingFilters, payload);
    },

    resetPendingFilters: (state) => {
      state.pendingFilters = {
        pageIndex: 0,
        pageSize: 25,
        headerFacilityId: 0,
        incidentId: 0,
        requestedUserId: 0,
        loginUserId: 0,
        // facilityId: "",
        moduleId: 0,
        menuId: 0,
        incidentDetailId: 0,
        incidentFromDate: null,
        incidentToDate: null,
      };
      state.isPendingFilterApplied = false;
    },
    setIsPendingFilterApplied: (state, { payload }) => {
      state.isPendingFilterApplied = payload;
    },
    setCompletedFilters: (state, { payload }) => {
      Object.assign(state.completedFilters, payload);
    },
    resetCompletedFilters: (state) => {
      state.completedFilters = {
        pageIndex: 0,
        pageSize: 25,
        headerFacilityId: 0,
        incidentId: 0,
        requestedUserId: 0,
        loginUserId: 0,
        // facilityId: "",
        moduleId: 0,
        menuId: 0,
        incidentDetailId: 0,
        incidentFromDate: null,
        incidentToDate: null,
      };
      state.isCompletedFilterApplied = false;
    },
    setIsCompletedFilterApplied: (state, { payload }) => {
      state.isCompletedFilterApplied = payload;
    },
  },
});

export const {
  setPendingFilters,
  setCompletedFilters,
  resetPendingFilters,
  resetCompletedFilters,
  // setPendingPageIndex,
  setIsPendingFilterApplied,
  facilityId,
  setIsCompletedFilterApplied,
} = opinionSlice.actions;
export default opinionSlice.reducer;
