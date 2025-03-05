import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem("token") || null,
  error: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    logoutUser(state) {
      localStorage.removeItem("token");
      return { user: null, isAuthenticated: false, token: null, error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const loginUser = createAsyncThunk(
  "account/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      console.log(" Sending request:", { username, password });
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      return { user: username, token: response.data.token };
    } catch (error) {
      console.error(" Login failed:", error.response?.data?.message || error);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const { logoutUser } = accountSlice.actions;
export default accountSlice.reducer;
