import { configureStore } from "@reduxjs/toolkit";
import combineRedu from "./combinedSlice.ts";
export const store = configureStore({
  reducer: combineRedu,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
