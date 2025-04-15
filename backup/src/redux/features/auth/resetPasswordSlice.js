import { createSlice } from '@reduxjs/toolkit';

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState: {
    data: {
        DefaultFacilityId : '',
        EmployeeID : '',
        UserId : '',
        UserImage : '',
        UserName: ''
    }
  },
  reducers: {
    setResetPasswordUserDetail: (state, { payload }) => {
      state.data = payload;
    },
}
});
export const { setResetPasswordUserDetail } =
resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;