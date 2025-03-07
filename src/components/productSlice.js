import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
console.log("API_BASE_URL:", API_BASE_URL); // Debugging line

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized: No token found");

  const res = await fetch(`${API_BASE_URL}/app/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  return data;
});

const productSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
