import { createSlice } from '@reduxjs/toolkit';

const passwordManagementSlice = createSlice({
  name: 'passwordManagement',
  initialState: {
    isFilterApplied: false,
    filters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacilityId: '',
      loginUserId: '',
      moduleId: '',
      menuId: '',
      facilityId: '',
      searchStaffId: 0,
      employeeId: '',
      departmentId: 0,
      activeStatus: '',
    },
    staffPopupPageIndex: 0,
    staffPopupPageSize: 25,
  },
  reducers: {
    setPageIndex: (state, { payload }) => {
      state.filters.pageIndex = payload;
    },
    setPageSize: (state, { payload }) => {
      state.filters.pageSize = payload;
    },
    setStaffPopupPageIndex: (state, { payload }) => {
      state.staffPopupPageIndex = payload;
    },
    setStaffPopupPageSize: (state, { payload }) => {
      state.staffPopupPageSize = payload;
    },
    setFilters: (state, { payload }) => {
      state.filters = payload;
    },
    resetFilters: (state) => {
      state.filters = {
        pageIndex: 0,
        pageSize: 25,
        headerFacilityId: '',
        loginUserId: '',
        moduleId: '',
        menuId: '',
        facilityId: '',
        employeeId: '',
        departmentId: 0,
        activeStatus: '',
        searchStaffId: 0,
      };
      state.isFilterApplied = false;
    },
    setIsFilterApplied: (state, { payload }) => {
      state.isFilterApplied = payload;
    },
  },
});

export const {
  setPageIndex,
  setPageSize,
  setStaffPopupPageIndex,
  setStaffPopupPageSize,
  setFilters,
  resetFilters,
  setIsFilterApplied,
} = passwordManagementSlice.actions;
export default passwordManagementSlice.reducer;
