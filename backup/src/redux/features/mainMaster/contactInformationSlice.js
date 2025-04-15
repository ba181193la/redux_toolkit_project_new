import { createSlice } from '@reduxjs/toolkit';

const contactInformationSlice = createSlice({
  name: 'contactInformationMaster',
  initialState: {
    loading: false,
    error: null,
    records: [],
    labelDetails: [],
    pageIndex: 0,
    pageSize: 25,
    facilityPageIndex:0,
    facilityPageSize:25
  },
  reducers: {
    setPageIndex: (state, { payload }) => {
      state.pageIndex = payload;
    },
    setPageSize: (state, { payload }) => {
      state.pageSize = payload;
    },
    setFacilityPageIndex:(state, { payload })=>{      
      state.facilityPageIndex = payload;

    },
    setFacilityPageSize:(state, { payload })=>{
      state.facilityPageSize = payload;
    }
  },
});

export const { setPageIndex, setPageSize,setFacilityPageIndex,setFacilityPageSize } = contactInformationSlice.actions;
export default contactInformationSlice.reducer;
