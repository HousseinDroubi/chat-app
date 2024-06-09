import themeReducer from "../features/themeSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
