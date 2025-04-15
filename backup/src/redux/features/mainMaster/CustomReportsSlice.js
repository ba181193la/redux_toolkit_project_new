import { createSlice } from '@reduxjs/toolkit';

const CustomReportsApi = createSlice({
  name: 'CustomReports',
  initialState: {
    isFilterApplied: false,
    filters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacilityId: '',
      loginUserId: '',
      moduleId: '',
      menuId: '',
      listingTabNo: '',
      facilityId: '',
      incidentTypeId: '',
      incidentDetail: '',
      harmLevel: '',
      incidentRiskLevel: '',
      incidentDepartment: '',
      personInvoled: '',
      year: '',
      incidentDateFrom: '',
      incidentDateTo: '',
        },
        tableFilters: {
      
      headerFacility: '',
      loginUserId: '',
      moduleId: '',
      menuId: '',
      facilityId: '',
      incidentTypeId: '',
      incidentDetail: '',
      harmLevel: '',
      incidentRiskLevel: '',
      incidentDepartment: '',
      year: '',
      incidentDateFrom: '',
      incidentDateTo: '',
      selectedGraphType: '',
      personInvoled: '',
      customProperty: '',
      pageIndex: 0,
      pageSize: 10,
        },
        tableClosed: false,

    
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
      listingTabNo: '',
      facilityId: '',
      incidentTypeId: '',
      incidentDetail: '',
      harmLevel: '',
      incidentRiskLevel: '',
      incidentDepartment: '',
      year: '',
      incidentDateFrom: '',
      incidentDateTo: '',
      };
      state.isFilterApplied = false;
    },
    setIsFilterApplied: (state, { payload }) => {
      state.isFilterApplied = payload;
    },
    setTableFilters: (state, { payload }) => {
      state.tableFilters = payload;
    },
    setTableClosed: (state, { payload }) => {
      state.tableClosed = payload;
    },


  },
});

export const { setFilters, resetFilters, setIsFilterApplied, setTableFilters, setTableClosed } =
CustomReportsApi.actions;
export default CustomReportsApi.reducer;
