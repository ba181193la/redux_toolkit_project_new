import { createSlice } from '@reduxjs/toolkit';
const integrationLogSlice = createSlice({
  name: 'integrationLog',
  initialState: {
    isFilterApplied: false,
    filters: {
      pageIndex: 0,
      pageSize: 25,
      logDate: '',
      headerFacility: '',
      loginUserId: '',
      moduleId: '',
      menuId: '',
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
        logDate: '',
        headerFacility: '',
        loginUserId: '',
        moduleId: '',
        menuId: '',
      };
      state.isFilterApplied = false;
    },
  },
});

export const { setFilters, setIsFilterApplied, resetFilters } =
  integrationLogSlice.actions;
export default integrationLogSlice.reducer;
