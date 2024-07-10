/** @format */

import { createStore, applyMiddleware } from "redux";

import { thunk } from "redux-thunk";

import rootReducer from "./reducers";

// Compose enhancers including redux-thunk and redux-devtools-extension
const composedEnhancers = applyMiddleware(thunk);

// Create the store with combined enhancers
const store = createStore(rootReducer, composedEnhancers);

export default store;
