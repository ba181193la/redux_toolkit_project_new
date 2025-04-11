import { createSlice } from '@reduxjs/toolkit';

const auditLogSlice = createSlice({
  name: 'auditLog',
  initialState: {
    isFilterApplied: false,
    isUserSessionFilterApplied: false,
    filters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacility: '',
      loginUserId: '',
      moduleId: '',
      menuId: '',
      moduleName: 0,
      pageName: 0,
      staffName:'',
      from: '',
      to: '',
      logUserId: '',
      facilityId: '',
      referenceNo: '',
    },
    userSessionFilters: {
      pageIndex: 0,
      pageSize: 25,
      employeeId: '',
      fromDate: '',
      toDate: '',
      headerFacility: '',
      loginUserId: '',
      moduleId: '',
      menuId: '',
      facilityId:'',
      logUserId:''
    },
  },
 
  reducers: {
    setFilters: (state, { payload }) => {
      state.filters = payload;
    },
    setIsFilterApplied: (state, { payload }) => {
      state.isFilterApplied = payload;
    },
    resetFilters: (state) => {
      state.filters = {
        pageIndex: 0,
        pageSize: 25,
        headerFacility: '',
        loginUserId: '',
        moduleId: '',
        menuId: '',
        moduleName: 0,
        pageName: 0,
        staffName:'',
        fromDate: '',
        toDate: '',
        logUserId: '',
        facilityId: '',
        referenceNo: '',
      };
      state.isFilterApplied = false;
    },
    setUserSeesionFilters: (state, { payload }) => {
      state.userSessionFilters = payload;
    },
    resetUserSessionFilters: (state) => {      
      state.userSessionFilters = {
        pageIndex: 0,
        pageSize: 25,
        employeeId: '',
        fromDate: '',
        toDate: '',
        headerFacility: '',
        loginUserId: '',
        moduleId: '',
        menuId: '',
        facilityId:'',
        logUserId:''
      };
      state.isUserSessionFilterApplied = false;
    },
    setIsUserSessionFilterApplied: (state, { payload }) => {
      state.isUserSessionFilterApplied = payload;
    },
  },
});

export const { setFilters, resetFilters,setIsFilterApplied,setUserSeesionFilters,resetUserSessionFilters,setIsUserSessionFilterApplied } =
  auditLogSlice.actions;
export default auditLogSlice.reducer;
