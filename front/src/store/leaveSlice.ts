import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { formatDateToYYYYMMDD } from "../utils/dateFormat";
type LeaveSliceData = {
  "Reason for leave": string;
  "Leave type": string;
  "Start date of leave": string;
  "End date of leave": string;
  state: "Pending" | "Approved" | "Cancelled";
  id: string;
  edit: boolean;
};

const initialState: LeaveSliceData = {
  "Reason for leave": "",
  "Leave type": "",
  "Start date of leave": "",
  "End date of leave": "",
  state: "Pending",
  id: "",
  edit: false,
};

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<LeaveSliceData>) => {
      state["Reason for leave"] = action.payload["Reason for leave"];
      state["Leave type"] = action.payload["Leave type"];
      state["Start date of leave"] = formatDateToYYYYMMDD(
        new Date(action.payload["Start date of leave"])
      );
      state["End date of leave"] = formatDateToYYYYMMDD(
        new Date(action.payload["End date of leave"])
      );
      state.edit = true;
      state.id = action.payload.id;
      state.state = action.payload.state;
    },

    setEdit: (state) => {
      state.edit = false;
    },
  },
});
export const leaveActions = leaveSlice.actions;
export default leaveSlice.reducer;
