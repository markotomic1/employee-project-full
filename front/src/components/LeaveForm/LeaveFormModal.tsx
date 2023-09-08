import { useRevalidator } from "react-router-dom";
import Button from "../../UI/Button/Button";
import { ModalType } from "../../pages/Home";
import {
  autofillUpdateAction,
  leaveFormAction,
} from "../../store/leaveActions";
import { leaveActions } from "../../store/leaveSlice";
import { uiActions } from "../../store/uiSlice";
import { useAppDispatch, useAppSelector } from "../../utils/reduxTypeHooks";
import "./leaveFormModal.scss";
import React, { FormEvent, useCallback, useEffect, useState } from "react";

export type LeaveData = {
  "Reason for leave": string;
  "Leave type": string;
  "Start date of leave": string;
  "End date of leave": string;
};

const LeaveFormModal = (props: {
  setShowModal: React.Dispatch<React.SetStateAction<ModalType>>;
}) => {
  const dispatch = useAppDispatch();
  const [reasonForLeave, setReasonForLeave] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const leaveState = useAppSelector((state) => state.leave);
  const uiState = useAppSelector((state) => state.ui);
  const revalidator = useRevalidator();

  const preCompleteData = useCallback(async (data: LeaveData) => {
    try {
      await dispatch(autofillUpdateAction(leaveState.id));
      setReasonForLeave(data["Reason for leave"]);
      setLeaveType(data["Leave type"]);
      setStartDate(data["Start date of leave"]);
      setEndDate(data["End date of leave"]);
    } catch (error: any) {
      dispatch(
        uiActions.showError({
          message: error.message,
          id: "autofillDataError",
        })
      );
    }
  }, []);

  useEffect(() => {
    if (leaveState.edit) {
      preCompleteData(leaveState);
    }
  }, []);

  const submitHandler = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const currentDate = new Date().toLocaleDateString("en-US");
      const dataToSend = {
        "Reason for leave": reasonForLeave,
        "Date of creation": currentDate,
        "Leave type": leaveType,
        "Start date of leave": startDate,
        "End date of leave": endDate,
      };

      try {
        if (leaveState.edit) {
          await dispatch(leaveFormAction(dataToSend, "PATCH", leaveState.id));
          dispatch(leaveActions.setEdit());
        } else {
          await dispatch(leaveFormAction(dataToSend, "POST"));
        }
        revalidator.revalidate();
        props.setShowModal("closed");
      } catch (error: any) {
        console.error(error);
        dispatch(
          uiActions.showError({
            message: error.message,
            id: "applyError",
          })
        );
      }
    },
    [reasonForLeave, leaveType, startDate, endDate, uiState, leaveState]
  );

  return (
    <>
      <form className='leave-form' onSubmit={submitHandler}>
        <label htmlFor='reasonForLeave'>Reason For Leave</label>
        <input
          type='text'
          id='reasonForLeave'
          className='input--leave'
          value={reasonForLeave}
          onChange={(e) => setReasonForLeave(e.target.value)}
        />
        <label htmlFor='Leave Type'>Leave Type</label>
        <input
          type='text'
          id='Leave Type'
          className='input--leave'
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
        />
        <label htmlFor='startDate'>Start Date Of Leave</label>
        <input
          type='date'
          id='startDate'
          className='input--leave'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor='endDate'>End Date Of Leave</label>
        <input
          type='date'
          id='endDate'
          className='input--leave'
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button type='submit' className='form--button'>
          Submit
        </Button>
      </form>
      {uiState.error.map((error) => (
        <span className='error--text' key={error?.id}>
          {error?.message}
        </span>
      ))}
    </>
  );
};

export default LeaveFormModal;
