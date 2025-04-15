import { createSlice } from '@reduxjs/toolkit';

const userAssignmentSlice = createSlice({
  name: 'userAssignment',
  initialState: {
    isFilterApplied: false,
    userAssignmentList: [],
    filters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacility: '',
      loginUserId: '',
      moduleId: '',
      menuId: '',
      employeeId: '',
      facilityId: '',
      searchStaffId: 0,
      designationId: 0,
      applicationRole: 0,
      staffCategoryId: 0,
      departmentId: 0,
      activeStatus: '',
    },
  },
  reducers: {
    setFilters: (state, { payload }) => {
      state.filters = payload;
    },
    resetFilters: (state) => {
      state.filters = {
        pageIndex: 0,
        pageSize: 25,
        headerFacility: '',
        loginUserId: '',
        moduleId: '',
        menuId: '',
        employeeId: '',
        facilityId: '',
        searchStaffId: 0,
        designationId: 0,
        staffCategoryId: 0,
        activeStatus: '',
        departmentId: 0,
        applicationRole: 0,
      };
      state.isFilterApplied = false;
    },
    setIsFilterApplied: (state, { payload }) => {
      state.isFilterApplied = payload;
    },
    setPageIndex: (state, { payload }) => {
      state.pageIndex = payload;
    },
    setPageSize: (state, { payload }) => {
      state.pageSize = payload;
    },
    setUserAssignmentList: (state, action) => {
      state.userAssignmentList = action?.payload;
    },
  },
});

export const {
  setFilters,
  resetFilters,
  setIsFilterApplied,
  setPageIndex,
  setPageSize,
  setUserAssignmentList,
} = userAssignmentSlice.actions;
export default userAssignmentSlice.reducer;
