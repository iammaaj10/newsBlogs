// src/redux/store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import blogsSlice from "./blogsSlics.js";
import notificationSlice from "./notificationSlice.js"; // Add this import

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user'], // Only persist user data
};

const rootReducer = combineReducers({
  user: userSlice,
  blogs: blogsSlice,
  notifications: notificationSlice // Add notifications reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['notifications.socket'] // Ignore socket in serialization check
      },
    }),
});

export default store;