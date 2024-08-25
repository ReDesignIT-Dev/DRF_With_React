import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootReducer"; // Import your root reducer

const store = configureStore({
  reducer: rootReducer,
});

export default store;
