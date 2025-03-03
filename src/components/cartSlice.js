import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
      state.totalQuantity += 1;
      state.totalPrice += action.payload.price * action.payload.quantity;
    },
    removeItem: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.totalQuantity -= state.items[index].quantity;
        state.totalPrice -=
          state.items[index].price * state.items[index].quantity;
        state.items.splice(index, 1);
      }
    },
    increaseItem: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        state.totalQuantity += 1;
        state.totalPrice += item.price;
      }
    },
    decreaseItem: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 0) {
        item.quantity -= 1;
        state.totalQuantity -= 1;
        state.totalPrice -= item.price;
      }
    },
    emptyCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addItem, removeItem, increaseItem, decreaseItem, emptyCart } =
  cartSlice.actions;
export default cartSlice.reducer;
