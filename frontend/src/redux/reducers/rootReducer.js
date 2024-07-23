import { combineReducers } from 'redux';
import categoryReducer from './categoryReducer'; // Import your slice reducer

const rootReducer = combineReducers({
  categories: categoryReducer,
  // Add other reducers here
});

export default rootReducer;
