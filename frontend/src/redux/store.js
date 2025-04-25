
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/slice/userSlice';
import { userApi } from '../redux/apiService/userApi';

const store = configureStore({
    reducer: {
      user: userReducer,
      [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(userApi.middleware),
  });

export default store;