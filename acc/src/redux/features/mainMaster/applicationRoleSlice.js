import { createSlice } from '@reduxjs/toolkit';
const applicationRoleSlice = createSlice({
  name: 'applicationRole',
  initialState: {
    incidentRoles: [],
    mainMasterRoles: [],
    loading: false,
    error: null,
    records: [],
    labelDetails: [],
    pageIndex: 0,
    pageSize: 25,
  },
  reducers: {
    setPageIndex: (state, { payload }) => {
      state.pageIndex = payload;
    },
    setPageSize: (state, { payload }) => {
      state.pageSize = payload;
    },
    setIncidentRoles: (state, action) => {
      state.incidentRoles = action.payload;
    },
    setMainMasterRoles: (state, action) => {
      state.mainMasterRoles = action.payload;
    },
  },
});

export const {
  setPageIndex,
  setPageSize,
  setIncidentRoles,
  setMainMasterRoles,
} = applicationRoleSlice.actions;
export default applicationRoleSlice.reducer;
