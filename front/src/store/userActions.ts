import { AppDispatch } from "./store";
import { userActions } from "./userSlice";
import { uiActions } from "./uiSlice";
import { axiosInstance } from "../utils/axiosRequest";
export const loginAction = (
  email: string,
  password: string,
  actionType: string
): ((dispatch: AppDispatch) => Promise<void>) => {
  return async (dispatch) => {
    dispatch(uiActions.loading());

    try {
      const { data } = await axiosInstance.post<{ token: string }>(
        "/users/" + actionType,
        {
          email,
          password,
        }
      );
      if (actionType === "login") {
        const token = data.token;
        dispatch(userActions.login({ token }));
        dispatch(userActions.setUser({ email }));
      }
      dispatch(uiActions.stopLoading());
      dispatch(uiActions.removeError("loginError"));
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  };
};

export const changePasswordAction = (
  newPassword: string
): ((dispatch: AppDispatch) => Promise<void>) => {
  return async (dispatch: AppDispatch) => {
    try {
      await axiosInstance.patch("/users/changePassword", {
        password: newPassword,
      });
      dispatch(uiActions.removeError("changePassError"));
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  };
};

export const checkOldPasswordHandler = (
  email: string,
  password: string
): ((dispatch: AppDispatch) => Promise<void>) => {
  return async (dispatch: AppDispatch) => {
    try {
      await axiosInstance.post("/users/login", { email, password });
      dispatch(uiActions.removeError("oldPassError"));
    } catch (error: any) {
      //koristim login rutu pa da li trebam drugu poruku poslat a ne od logina
      throw new Error("Wrong password!");
    }
  };
};

export const getLoggedInUser = (): ((
  dispatch: AppDispatch
) => Promise<void>) => {
  return async (dispatch: AppDispatch) => {
    try {
      const { data } = await axiosInstance.get<string>("/users/me");
      dispatch(userActions.setUser({ email: data }));
      dispatch(uiActions.removeError("getLoggedInUserError"));
    } catch (error: any) {
      dispatch(
        uiActions.showError({
          message: error.response?.data,
          id: "getLoggedInUserError",
        })
      );
    }
  };
};
