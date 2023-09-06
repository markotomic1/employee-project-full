import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import uiReducer from "./uiSlice";
import leaveReducer from "./leaveSlice";
const store = configureStore({
  reducer: { user: userReducer, ui: uiReducer, leave: leaveReducer },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
