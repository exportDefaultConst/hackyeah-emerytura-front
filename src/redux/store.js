import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import pensionReducer from "./slices/pensionSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "persist",
  storage,
  blacklist: ["loading", "error"],
};

const rootReducer = combineReducers({
  user: persistReducer(persistConfig, userReducer),
  pension: persistReducer(persistConfig, pensionReducer),
});

const persistedReducer = rootReducer;

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
