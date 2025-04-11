import { createSlice } from '@reduxjs/toolkit';

const ActionIncidentSlice = createSlice({
  name: 'ActionIncident',
  initialState: {
    
    isFilterApplied: false,
    filters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacilityId: '',
      loginUserId: '',
      moduleId: '',
      menuId: '',
      facilityIds: "",
      incidentFromDate: "",
      incidentToDate: "",
      deadlineFromDate: "",
      deadlineToDate: "",
      responsibleStaff: 0,
      responsibleDepartment: 0,
      responsibleSpeciality: 0 ,
      incidentId: 0

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
      facilityIds: "",
      incidentFromDate: "",
      incidentToDate: "",
      deadlineFromDate: "",
      deadlineToDate: "",
      responsibleStaff: 0,
      responsibleDepartment: 0,
      responsibleSpeciality: 0,
      incidentId: 0

      };
      state.isFilterApplied = false;
    },
    setIsFilterApplied: (state, { payload }) => {
      state.isFilterApplied = payload;
    },
  },
});

export const { setFilters, resetFilters, setIsFilterApplied } =
ActionIncidentSlice.actions;
export default ActionIncidentSlice.reducer;
