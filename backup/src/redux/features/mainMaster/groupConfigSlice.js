import { createSlice } from '@reduxjs/toolkit';
const groupConfigSlice = createSlice({
  name: 'groupConfig',
  initialState: {
    groupConfigData: {
      sidebarSkinColor:'#0083c0',
      headerSkinColor:'#fff'
    },
    loading: false,
    error: null,
    records: [],
    labelDetails: [],
    pageIndex: 0,
    pageSize: 25,
    mailType: ''
  },
  reducers: {
    setPageIndex: (state, { payload }) => {
      state.pageIndex = payload;
    },
    setPageSize: (state, { payload }) => {
      state.pageSize = payload;
    },
    setGroupConfigData:(state, { payload })=>{      
      state.groupConfigData.sidebarSkinColor = payload?.SidebarSkinColor;
      state.groupConfigData.headerSkinColor = payload?.HeaderSkinColor;
    },
    setMailType: (state, { payload }) => {
      state.mailType = payload
    }
  },
});

export const { setPageIndex, setPageSize ,setGroupConfigData, setMailType} = groupConfigSlice.actions;
export default groupConfigSlice.reducer;
