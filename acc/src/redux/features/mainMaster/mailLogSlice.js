import { createSlice } from '@reduxjs/toolkit';

const mailLogSlice = createSlice({
  name: 'mailLog',
  initialState: {
    isFilterApplied: false,
    filters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacility: '',
      loginUserId: '',
      moduleId: '',
      menuId: '',
      moduleName: 0,
      pageName: 0,
      sendDateFrom: '',
      sendDateTO: '',
      toUserId: '',
      facilityId: '',
      referenceNo: '',
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
        headerFacility: '',
        loginUserId: '',
        moduleId: '',
        menuId: '',
        moduleName: 0,
        pageName: 0,
        sendDateFrom: '',
        sendDateTO: '',
        toUserId: '',
        facilityId: '',
        referenceNo: '',
      };
      state.isFilterApplied = false;
    },
    setIsFilterApplied: (state, { payload }) => {
      state.isFilterApplied = payload;
    },
  },
});

export const { setFilters, resetFilters, setIsFilterApplied } =
  mailLogSlice.actions;
export default mailLogSlice.reducer;
