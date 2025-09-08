import { combineReducers } from "@reduxjs/toolkit";
import searchReducer from "./slices/searchSlice";

const combineRedu = combineReducers({
  search: searchReducer,
});

export default combineRedu;
