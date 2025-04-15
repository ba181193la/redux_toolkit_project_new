import { createSlice } from '@reduxjs/toolkit';

const pageUtilitiesSlice = createSlice({
  name: 'pageUtilites',
  initialState: {
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
  },
});

export const { setPageIndex, setPageSize } = pageUtilitiesSlice.actions;
export default pageUtilitiesSlice.reducer;
