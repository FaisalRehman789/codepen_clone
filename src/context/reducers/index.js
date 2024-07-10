/** @format */

import { combineReducers } from "redux";
import userAuthReducer from "./userAuthReducer";
import projectReducer from "./projectReducer";
import searchReducer from "./searchReducer";
import collectionReducer from "./collectionReducer";

const rootReducer = combineReducers({
  user: userAuthReducer,
  projects: projectReducer,
  searchTerm: searchReducer,
  collections: collectionReducer,
});

export default rootReducer;
