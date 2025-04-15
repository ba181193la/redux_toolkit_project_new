import { createSlice } from '@reduxjs/toolkit';

const incidentApprovalSlice = createSlice({
  name: 'incidentApproval',
  initialState: {
    isFilterApplied: false,
    filters: {
      pageIndex: 0,
      pageSize: 25,
      loginUserId: '',
      moduleId: '',
      menuId: '',
      incidentId: 0,
      incidentDetailId: 0,
      investigatorId: 0,
      facilityId: '',
      incidentFromDate: '',
      incidentToDate: '',
      IncidentTypeId: 0,
      MainCategoryId: 0,
      SubCategoryId: 0,
      AffectedCategoryId: 0,
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
        loginUserId: '',
        moduleId: '',
        menuId: '',
        incidentId: 0,
        incidentDetailId: 0,
        investigatorId: 0,
        facilityId: '',
        incidentFromDate: '',
        incidentToDate: '',
        IncidentTypeId: 0,
        MainCategoryId: 0,
        SubCategoryId: 0,
        AffectedCategoryId: 0,
      };
      state.isFilterApplied = false;
    },
    setIsFilterApplied: (state, { payload }) => {
      state.isFilterApplied = payload;
    },
  },
});

export const { setFilters, resetFilters, setIsFilterApplied } =
  incidentApprovalSlice.actions;
export default incidentApprovalSlice.reducer;
