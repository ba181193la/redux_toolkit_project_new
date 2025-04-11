import { createSlice } from '@reduxjs/toolkit';

const commonSlice = createSlice({
  name: 'common',
  initialState: {
    dynamicFormData: null,
  },
  reducers: {
    setDynamicFormData: (state, { payload }) => {
      state.dynamicFormData = {
        ...state.dynamicFormData,
        [payload.menuId]: payload.data,
      };
    },
  },
});

export const { setDynamicFormData } = commonSlice.actions;
export default commonSlice.reducer;
