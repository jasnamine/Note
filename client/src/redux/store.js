import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slice/authSlice";
import noteReducer from "./slice/noteSlice";
import userReducer from "./slice/userSlice";
import drawingReducer from "./slice/drawingSlice"
import tagReducer from "./slice/tagSlice"
import remindReducer from "./slice/remindSlice"
// import imageReducer from "./slice/imageSlice";
import tagNoteReducer from "./slice/tagNoteSlice"
import notifyReducer from "./slice/notifySlice"
import formReducer from "./slice/formSlice";
import historyReducer from "./slice/historySlice"

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
};

const appReducer = combineReducers({
  auth: authReducer,
  notes: noteReducer,
  user: userReducer,
  drawing: drawingReducer,
  tag: tagReducer,
  remind: remindReducer,
  // image: imageReducer,
  tagNote: tagNoteReducer,
  notify: notifyReducer,
  form: formReducer,
  history: historyReducer,
});

// Root reducer với logic reset
const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    storage.removeItem("persist:root");
    state = undefined; 
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Action để reset store
export const resetStore = () => ({
  type: "RESET_STORE",
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "RESET_STORE",
        ],
      },
    }),
});

export let persistor = persistStore(store);
