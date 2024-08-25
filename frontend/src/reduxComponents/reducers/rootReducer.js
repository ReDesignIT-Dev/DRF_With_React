import { combineReducers } from 'redux';
import categoryReducer from './categoryReducer'; // Import your slice reducer
import authReducer from "./authReducer";

const rootReducer = combineReducers({
  categories: categoryReducer,
  auth: authReducer,
});

export default rootReducer;
