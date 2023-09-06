import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface ErrorType {
  id: string;
  status: boolean;
  message: string;
}
interface UiState {
  loading: boolean;
  error: ErrorType[];
}
const initialState: UiState = {
  loading: false,
  error: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    loading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    showError: (
      state,
      action: PayloadAction<{ message: string; id: string }>
    ) => {
      state.loading = false;
      let pom = 0;
      state.error.forEach((obj) => {
        if (obj?.message === action.payload.message) {
          pom = 1;
        }
      });
      if (pom === 0)
        state.error.push({
          status: true,
          message: action.payload.message,
          id: action.payload.id,
        });
    },
    removeError: (state, action: PayloadAction<string>) => {
      state.error = state.error.filter((error) => error?.id !== action.payload);
    },
    removeAllErrors: (state) => {
      state.error = [];
    },
    showToastError: (
      state,
      action: PayloadAction<{ message: string; id: string }>
    ) => {
      toast.error(action.payload.message);
      state.loading = false;
    },
  },
});
export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
