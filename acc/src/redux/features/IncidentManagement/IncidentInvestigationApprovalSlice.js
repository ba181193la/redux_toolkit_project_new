import { createSlice } from '@reduxjs/toolkit';

const incidentInvestigationApprovalSlice = createSlice({
  name: 'incidentInvestigationApproval',
  initialState: {
    isPendingFilterApplied: false,
    isCompletedFilterApplied: false,
    pendingFilters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacilityId: '',
      loginUserId: '',
      moduleId: '',
      menuId: '',
      incidentId: 0,
      incidentDetailId: 0,
      investigatorId: 0,
      departmentId: 0,
      facilityId: '',
      incidentFromDate: '',
      incidentToDate: '',
      requestReceivedDate: '',
    },
    completedFilters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacilityId: '',
      loginUserId: '',
      moduleId: '',
      menuId: '',
      incidentId: 0,
      incidentDetailId: 0,
      investigatorId: 0,
      departmentId: 0,
      facilityId: '',
      incidentFromDate: '',
      incidentToDate: '',
      requestReceivedDate: '',
    },
  },
  reducers: {
    //* Pending tab reducers
    setPendingPageIndex: (state, { payload }) => {
      state.pendingFilters.pageIndex = payload;
    },
    setPendingPageSize: (state, { payload }) => {
      state.pendingFilters.pageSize = payload;
    },
    setPendingFilters: (state, { payload }) => {
      state.pendingFilters = payload;
    },
    resetPendingFilters: (state) => {
      state.pendingFilters = {
        pageIndex: 0,
        pageSize: 25,
        headerFacilityId: '',
        loginUserId: '',
        moduleId: '',
        menuId: '',
        incidentId: 0,
        incidentDetailId: 0,
        investigatorId: 0,
        departmentId: 0,
        facilityId: '',
        incidentFromDate: '',
        incidentToDate: '',
        requestReceivedDate: '',
      };
      state.isPendingFilterApplied = false;
    },
    setIsPendingFilterApplied: (state, { payload }) => {
      state.isPendingFilterApplied = payload;
    },

    //* Completed tab reducers
    setCompletedPageIndex: (state, { payload }) => {
      state.completedFilters.pageIndex = payload;
    },
    setCompletedPageSize: (state, { payload }) => {
      state.completedFilters.pageSize = payload;
    },
    setCompletedFilters: (state, { payload }) => {
      state.completedFilters = payload;
    },
    resetCompletedFilters: (state) => {
      state.completedFilters = {
        pageIndex: 0,
        pageSize: 25,
        headerFacilityId: '',
        loginUserId: '',
        moduleId: '',
        menuId: '',
        incidentId: 0,
        incidentDetailId: 0,
        investigatorId: 0,
        departmentId: 0,
        facilityId: '',
        incidentFromDate: '',
        incidentToDate: '',
        requestReceivedDate: '',
      };
      state.isCompletedFilterApplied = false;
    },
    setIsCompletedFilterApplied: (state, { payload }) => {
      state.isCompletedFilterApplied = payload;
    },
  },
});

export const {
  setPendingPageIndex,
  setPendingPageSize,
  setPendingFilters,
  resetPendingFilters,
  setIsPendingFilterApplied,

  setCompletedPageIndex,
  setCompletedPageSize,
  setCompletedFilters,
  resetCompletedFilters,
  setIsCompletedFilterApplied,
} = incidentInvestigationApprovalSlice.actions;

export default incidentInvestigationApprovalSlice.reducer;
