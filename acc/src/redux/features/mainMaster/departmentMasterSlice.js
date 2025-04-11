import { createSlice } from '@reduxjs/toolkit';

const departmentMasterSlice = createSlice({
  name: 'departmentMaster',
  initialState: {
    isLocationTypeFilterApplied: false,
    isDepartmentFilterApplied: false,
    isDesignationFilterApplied: false,
    locationTypeFilters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacilityId: '',
      loginUserId: '',
      moduleId: '',
      menuId: '',
      locationId: 0,
      facilityIds: '',
    },
    departmentFilters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacilityId: 0,
      loginUserId: 0,
      moduleId: 0,
      menuId: 0,
      departmentId: 0,
      locationId: 0,
      hodId: 0,
      facilityIds: '',
    },
    designationFilters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacilityId: 0,
      loginUserId: 0,
      moduleId: 0,
      menuId: 0,
      designationId: 0,
      departmentId: 0,
      facilityIds: '',
    },
    departmentGroup: {
      loading: false,
      error: null,
      records: [],
      labelDetails: [],
      pageIndex: 0,
      pageSize: 25,
    },
  },
  reducers: {
    //* Location Type Reducers
    setLocationTypePageIndex: (state, { payload }) => {
      state.locationTypeFilters.pageIndex = payload;
    },
    setLocationTypePageSize: (state, { payload }) => {
      state.locationTypeFilters.pageSize = payload;
    },
    setLocationTypeFilters: (state, { payload }) => {
      state.locationTypeFilters = payload;
    },
    resetLocationTypeFilters: (state) => {
      state.locationTypeFilters = {
        pageIndex: 0,
        pageSize: 25,
        headerFacilityId: '',
        loginUserId: '',
        moduleId: '',
        menuId: '',
        locationId: 0,
        facilityIds: '',
      };
      state.isLocationTypeFilterApplied = false;
    },
    setIsLocationTypeFilterApplied: (state, { payload }) => {
      state.isLocationTypeFilterApplied = payload;
    },

    //* Department Reducers
    setDepartmentPageIndex: (state, { payload }) => {
      state.departmentFilters.pageIndex = payload;
    },
    setDepartmentPageSize: (state, { payload }) => {
      state.departmentFilters.pageSize = payload;
    },
    setDepartmentFilters: (state, { payload }) => {
      state.departmentFilters = payload;
    },
    resetDepartmentFilters: (state) => {
      state.departmentFilters = {
        pageIndex: 0,
        pageSize: 25,
        headerFacilityId: 0,
        loginUserId: 0,
        moduleId: 0,
        menuId: 0,
        departmentId: 0,
        locationId: 0,
        hodId: 0,
        facilityIds: '',
      };
      state.isDepartmentFilterApplied = false;
    },
    setIsDepartmentFilterApplied: (state, { payload }) => {
      state.isDepartmentFilterApplied = payload;
    },

    //* Designation Reducers
    setDesignationPageIndex: (state, { payload }) => {
      state.designationFilters.pageIndex = payload;
    },
    setDesignationPageSize: (state, { payload }) => {
      state.designationFilters.pageSize = payload;
    },
    setDesignationFilters: (state, { payload }) => {
      state.designationFilters = payload;
    },
    resetDesignationtFilters: (state) => {
      state.designationFilters = {
        pageIndex: 0,
        pageSize: 25,
        headerFacilityId: 0,
        loginUserId: 0,
        moduleId: 0,
        menuId: 0,
        designationId: 0,
        departmentId: 0,
        facilityIds: '',
      };
      state.isDesignationFilterApplied = false;
    },
    setIsDesignationFilterApplied: (state, { payload }) => {
      state.isDesignationFilterApplied = payload;
    },

    //* Department Group Reducers
    setDepartmentGroupPageIndex: (state, { payload }) => {
      state.departmentGroup.pageIndex = payload;
    },
    setDepartmentGroupPageSize: (state, { payload }) => {
      state.departmentGroup.pageSize = payload;
    },
  },
});

export const {
  setLocationTypePageIndex,
  setLocationTypePageSize,
  setLocationTypeFilters,
  resetLocationTypeFilters,
  setIsLocationTypeFilterApplied,

  setDepartmentPageIndex,
  setDepartmentPageSize,
  setDepartmentFilters,
  resetDepartmentFilters,
  setIsDepartmentFilterApplied,

  setDesignationPageIndex,
  setDesignationPageSize,
  setDesignationFilters,
  resetDesignationtFilters,
  setIsDesignationFilterApplied,

  setDepartmentGroupPageIndex,
  setDepartmentGroupPageSize,
} = departmentMasterSlice.actions;
export default departmentMasterSlice.reducer;
