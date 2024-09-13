import { combineReducers } from '@reduxjs/toolkit';
import categoryReducer from './categoryReducer';
import authReducer from "./authReducer";

const rootReducer = combineReducers({
  categories: categoryReducer,
  auth: authReducer,
});

export default rootReducer;