import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// BASE URL of your backend API
const API_BASE_URL = 'http://localhost:5000'; // Change this to match your server

// Thunks for API calls

// CREATE user (POST)
export const createUser = createAsyncThunk('user/createUser', async (formData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/createUser`, formData);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

// FETCH all users (GET)
export const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user`);
    return response.data.userData;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

// GET single user details (GET by ID)
export const getUserDetails = createAsyncThunk('user/getUserDetails', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${id}`);
    return response.data.userData;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

// UPDATE user (PUT or PATCH)
export const updateUser = createAsyncThunk('user/updateUser', async ({ id, formData }, thunkAPI) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/user/${id}`, formData);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

// DELETE user (DELETE)
export const deleteUser = createAsyncThunk('user/deleteUser', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_BASE_URL}/user/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    singleUser: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload.userData);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Get Single User
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.singleUser = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u._id === action.payload.userData._id);
        if (index !== -1) {
          state.users[index] = action.payload.userData;
        }
      })

      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export default userSlice.reducer;
