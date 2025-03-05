import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const res = await fetch(`${API_BASE_URL}/app/products`);

  console.log("Full URL used:", `${API_BASE_URL}/app/products`);
  console.log("res", res);

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
