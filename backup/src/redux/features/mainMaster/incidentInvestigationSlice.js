import { createSlice } from '@reduxjs/toolkit';

const incidentInvestigationSlice = createSlice({
  name: 'incidentInvestigation',
  initialState: {
    isFilterApplied: false,
    filters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacilityId: '',
      loginUserId: '',
      moduleId: '',
      menuId: '',
      incidentId: 0,
      incidentDetailId: 0,
      investigatorId: 0,
      facilityId: '',
      incidentFromDate: '',
      incidentToDate: '',
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
        headerFacilityId: '',
        loginUserId: '',
        moduleId: '',
        menuId: '',
        incidentId: 0,
        incidentDetailId: 0,
        investigatorId: 0,
        facilityId: '',
        incidentFromDate: '',
        incidentToDate: '',
      };
      state.isFilterApplied = false;
    },
    setIsFilterApplied: (state, { payload }) => {
      state.isFilterApplied = payload;
    },
  },
});

export const { setFilters, resetFilters, setIsFilterApplied } =
  incidentInvestigationSlice.actions;
export default incidentInvestigationSlice.reducer;
