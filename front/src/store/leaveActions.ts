import { LeaveData } from "../components/LeaveForm/LeaveFormModal";
import { AppDispatch } from "./store";
import { leaveActions } from "./leaveSlice";
import { axiosInstance } from "../utils/axiosRequest";
import { uiActions } from "./uiSlice";
import { generateCSVFile } from "../utils/helpersXls";

type Leave = {
  _id: string;
  "Reason for leave": string;
  "Leave type": string;
  "Start date of leave": string;
  "End date of leave": string;
  "User identifier": string;
  "Date of creation": string;
  "Count of working days between set dates": number;
  state: "Pending" | "Approved" | "Cancelled";
};

export const leaveFormAction = (
  data: LeaveData,
  method: string,
  id?: string
): ((dispatch: AppDispatch) => Promise<void>) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(uiActions.loading());
      if (method === "POST") {
        await axiosInstance.post("/apply", data);
      } else {
        await axiosInstance.patch("/apply/" + id, data);
      }
      dispatch(uiActions.stopLoading());
      dispatch(uiActions.removeError("applyError"));
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  };
};
export const autofillUpdateAction = (
  id: string
): ((dispatch: AppDispatch) => Promise<void>) => {
  return async (dispatch: AppDispatch) => {
    try {
      const { data } = await axiosInstance.get<Leave>("/apply/" + id);

      dispatch(leaveActions.setData({ ...data, edit: true, id }));
      dispatch(uiActions.removeError("autofillDataError"));
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  };
};
export const deleteLeaveAction = (
  id: string
): ((dispatch: AppDispatch) => Promise<void>) => {
  return async (dispatch: AppDispatch) => {
    try {
      await axiosInstance.delete("/apply/" + id);
      dispatch(uiActions.removeError("deleteLeaveError"));
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  };
};
export const changeStateAction = (
  id: string,
  state: string
): ((dispatch: AppDispatch) => Promise<void>) => {
  return async (dispatch: AppDispatch) => {
    try {
      if (state === "") {
        dispatch(
          uiActions.showError({
            message: "Please select a state!",
            id: "changeStateSelectError",
          })
        );
      }
      await axiosInstance.patch("/apply/changeState/" + id, { state });
      dispatch(uiActions.removeError("changeStateError"));
      dispatch(uiActions.removeError("changeStateSelectError"));
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  };
};

export const generateReportAction = (dateData: {
  startDate: string;
  endDate: string;
}): ((dispatch: AppDispatch) => Promise<void>) => {
  return async (dispatch: AppDispatch) => {
    try {
      const { data } = await axiosInstance.post("/apply/report", {
        ...dateData,
      });

      generateCSVFile(data);
      dispatch(uiActions.removeError("generateReportError"));
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  };
};
