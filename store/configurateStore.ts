import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";
import { persistReducer } from "redux-persist";
const initialState = {};
const middleware = [thunk];
import expireReducer from "redux-persist-expire";

const persistConfig = {
  key: "root",
  storage: require("redux-persist/lib/storage").default,
  blacklist: ["user", "status"],
  transforms: [
    // You can add more `expireReducer` calls here for different reducers
    // that you may want to expire
  ],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: middleware,
  preloadedState: initialState,
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
