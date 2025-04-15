import { createSlice } from '@reduxjs/toolkit';
const homePageSettingSlice = createSlice({
  name: 'homePageSetting',
  initialState: {
    organizationLevelMenu: [],
    userLevelMenu: [],
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
    setOrganizationLevelMenu: (state, action) => {
      state.organizationLevelMenu = action.payload;
    },
    setUserLevelMenu: (state, action) => {
      state.userLevelMenu = action.payload;
    }
  },
});

export const {
  setPageIndex,
  setPageSize,
  setOrganizationLevelMenu,
  setUserLevelMenu
} = homePageSettingSlice.actions;
export default homePageSettingSlice.reducer;
