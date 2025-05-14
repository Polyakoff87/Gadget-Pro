import { configureStore, combineReducers } from "@reduxjs/toolkit";
import navReducer from "../features/navSlice";
import { rtkApi } from "../api/rtkApi";
import { setupListeners } from "@reduxjs/toolkit/query";

const rootReducer = combineReducers({
  nav: navReducer,
  [rtkApi.reducerPath]: rtkApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkApi.middleware),
});

setupListeners(store.dispatch);

export default store;
