import { createStore, combineReducers } from "redux";
import loginReducer from "./reducers/loginModal"; 
import filterReducer from "./reducers/filterReducer"; 

const rootReducer = combineReducers({
  loginModal: loginReducer, 
  filters: filterReducer,  
});

const store = createStore(rootReducer);
export type RootState = ReturnType<typeof rootReducer>;

export default store;
