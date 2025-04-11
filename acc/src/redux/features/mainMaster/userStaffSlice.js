import { createSlice } from '@reduxjs/toolkit';

const userStaff = createSlice({
  name: 'userStaff',
  initialState: {
    isFilterApplied: false,
    filters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacility: '',
      loginUserId: '',
      moduleId: '',
      menuId: '',
      staffCategoryId: 0,
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
        facilityId: '',
        searchStaffId: 0,
        employmentTypeId: 0,
        departmentId: 0,
        employeeId: '',
        designationId: 0,
        staffCategoryId: 0,
        activeStatus: '',
        adUserLogonName: '',
      };
      state.isFilterApplied = false;
    },
    setIsFilterApplied: (state, { payload }) => {
      state.isFilterApplied = payload;
    },
  },
});

export const { setFilters, resetFilters, setIsFilterApplied } =
  userStaff.actions;
export default userStaff.reducer;
