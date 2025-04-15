import { createSlice } from '@reduxjs/toolkit';
const ReportGeneratorSlice = createSlice({
  name: 'reportGenerator',
  initialState: {
    loading: false,
    error: null,
    records: [],
    labelDetails: [],
    pageIndex: 0,
    pageSize: 5,
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

export const { setPageIndex, setPageSize } = ReportGeneratorSlice.actions;
export default ReportGeneratorSlice.reducer;
