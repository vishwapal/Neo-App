import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import accountReducer from "./accountSlice";
import cartReducer from "./cartSlice";
import productSlice from "./productSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedAccountReducer = persistReducer(persistConfig, accountReducer);

const store = configureStore({
  reducer: {
    account: persistedAccountReducer,
    cart: cartReducer,
    products: productSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { persistor, store };
