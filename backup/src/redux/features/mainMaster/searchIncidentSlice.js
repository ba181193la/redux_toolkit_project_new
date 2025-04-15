import { createSlice } from '@reduxjs/toolkit';

const searchIncidentSlice = createSlice({
  name: 'searchIncident',
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
      facilityId: '',
      incidentFromDate: '',
      incidentToDate: '',
      departmentId: 0,
      incidentDetailId: 0,
      incidentTypeId: 0,
      personInvolved: '',
      incidentHarmLevelId: 0,
      incidentRiskLevelId: 0,
      dayofWeek: '',
      incidentStatusId: 0,
      reportingYear: '',
      overallTaT: '',
      responsibleStaff: 0,
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
        facilityId: '',
        incidentFromDate: '',
        incidentToDate: '',
        departmentId: 0,
        incidentDetailId: 0,
        incidentTypeId: 0,
        personInvolved: '',
        incidentHarmLevelId: 0,
        incidentRiskLevelId: 0,
        dayofWeek: '',
        incidentStatusId: 0,
        year: '',
        overallTaT: '',
        userId: 0,
      };
      state.isFilterApplied = false;
    },
    setIsFilterApplied: (state, { payload }) => {
      state.isFilterApplied = payload;
    },
  },
});

export const { setFilters, resetFilters, setIsFilterApplied } =
  searchIncidentSlice.actions;
export default searchIncidentSlice.reducer;
