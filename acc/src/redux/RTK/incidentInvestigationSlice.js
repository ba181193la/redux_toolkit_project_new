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
      incidentFromDate: '2024-01-09T07:20:12.500Z',
      incidentToDate: new Date().toISOString(),
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
        incidentFromDate: '2024-01-09T07:20:12.500Z',
        incidentToDate: new Date().toISOString(),
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
