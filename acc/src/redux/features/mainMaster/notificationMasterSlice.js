import { createSlice } from '@reduxjs/toolkit';

const notificationMasterSlice = createSlice({
  name: 'notificationMaster',
  initialState: {
    isFilterApplied: false,
    designationList: [],
    roleList: [],
    defaultRoleList: [],
    staffList: [],
    pageName: '',
    task: '',
    mailTaskId: '',
    pageNameData: [],
    filters: {
      pageIndex: 0,
      pageSize: 25,
      loginUserId: '',
      moduleId: '',
      menuId: '',
      mailTaskId: 0,
      pageMenuId: 0,
    },
  },
  reducers: {
    setFilters: (state, { payload }) => {
      state.filters = payload;
    },
    setPageName: (state, { payload }) => {
      state.pageName = payload;
    },
    setTask: (state, { payload }) => {
      state.task = payload;
    },
    setMailTaskId: (state, { payload }) => {
      state.mailTaskId = payload;
    },
    setDesignationList(state, action) {
      state.designationList = action.payload;
    },
    setRoleList(state, action) {
      state.roleList = action.payload;
    },
    setDefaultRoleList(state, action) {
      state.defaultRoleList = action.payload;
    },
    setStaffList(state, action) {
      state.staffList = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        pageIndex: 0,
        pageSize: 25,
        loginUserId: '',
        moduleId: '',
        menuId: '',
        mailTaskId: 0,
        pageMenuId: 0,
      };
      state.isFilterApplied = false;
    },
    setIsFilterApplied: (state, { payload }) => {
      state.isFilterApplied = payload;
    },
    setPageNameData: (state, { payload }) => {
      state.pageNameData = payload;
    },
  },
});

export const {
  setFilters,
  resetFilters,
  setIsFilterApplied,
  setPageName,
  setTask,
  setMailTaskId,
  setDesignationList,
  setRoleList,
  setStaffList,
  setDefaultRoleList,
  setPageNameData,
} = notificationMasterSlice.actions;

export default notificationMasterSlice.reducer;
