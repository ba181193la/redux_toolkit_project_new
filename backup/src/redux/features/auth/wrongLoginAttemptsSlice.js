import { createSlice } from '@reduxjs/toolkit';

const wrongLoginAttemptsSlice = createSlice({
  name: 'wrongLoginAttempts',
  initialState: {},
  reducers: {
    increment: (state, action) => {
      const employeeID = action.payload;
      if (!state[employeeID]) {
        state[employeeID] = 0;
      }
      state[employeeID] += 1;
    },
    reset: (state, action) => {
      const employeeID = action.payload;
      state[employeeID] = 0;
    },
  },
});

export const { increment, reset } = wrongLoginAttemptsSlice.actions;
export default wrongLoginAttemptsSlice.reducer;
