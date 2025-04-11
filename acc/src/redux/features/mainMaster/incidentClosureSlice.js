import { createSlice } from '@reduxjs/toolkit';

const incidentClosureSlice = createSlice({
  name: 'incidentClosure',
  initialState: {
    isFilterApplied: false,
    filters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacilityId: 0,
      loginUserId: 0,
      moduleId: 0,
      menuId: 0,
      facilityIds: "",
      incidentId: 0,
      incidentDetailId: 0,
      incidentTypeId: 0,
      MainCategoryId: 0,
      subCategoryId: 0,
      affectedCategoryId: 0,
      incidentRiskLevelId: 0,
      incidentFromDate: "",
      incidentToDate: '',
      reportFromDate: "",
      reportToDate: '',
      departmentId: 0,
      contributingDepartmentId: 0,
      incidentHarmLevelId: 0,
      incidentLevelId: 0
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
        headerFacilityId: 0,
        loginUserId: 0,
        moduleId: 0,
        menuId: 0,
        facilityIds: "",
        incidentId: 0,
        incidentDetailId: 0,
        incidentTypeId: 0,
        MainCategoryId: 0,
        subCategoryId: 0,
        affectedCategoryId: 0,
        incidentRiskLevelId: 0,
        incidentFromDate: "",
        incidentToDate: '',
        reportFromDate: "",
        reportToDate: '',
        departmentId: 0,
        contributingDepartmentId: 0,
        incidentHarmLevelId: 0,
        incidentLevelId: 0,
      };
      state.isFilterApplied = false;
    },
    setIsFilterApplied: (state, { payload }) => {
      state.isFilterApplied = payload;
    },
  },
});

export const { setFilters, resetFilters, setIsFilterApplied } =
  incidentClosureSlice.actions;
export default incidentClosureSlice.reducer;
