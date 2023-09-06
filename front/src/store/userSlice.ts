import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  name: string;
  email: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  name: "",
  email: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.name = "";
      state.email = "";
      localStorage.removeItem("token");
    },
    setUser: (state, action: PayloadAction<{ email: string }>) => {
      state.email = action.payload.email;
      state.name = action.payload.email.split("@")[0];
      state.isLoggedIn = true;
    },
    login: (state, action: PayloadAction<{ token: string }>) => {
      localStorage.setItem("token", action.payload.token);
      state.isLoggedIn = true;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
