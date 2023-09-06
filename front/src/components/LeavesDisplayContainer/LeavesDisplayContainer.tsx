import "./leavesDisplayContainer.scss";
import { useRevalidator } from "react-router-dom";
import "react-toastify/dist/ReactToastify.min.css";
import { useAppDispatch, useAppSelector } from "../../utils/reduxTypeHooks";
import {
  autofillUpdateAction,
  deleteLeaveAction,
} from "../../store/leaveActions";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import Table from "../table/Table";
import Button from "../../UI/Button/Button";
import Card from "../card/Card";
import { ModalType } from "../../pages/Home";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { ToastContainer } from "react-toastify";
import { uiActions } from "../../store/uiSlice";

export type LeaveType = {
  _id: string;
  "Reason for leave": string;
  state: "Pending" | "Approved" | "Cancelled";
  "Leave type": string;
  "Start date of leave": string;
  "End date of leave": string;
  "Count of working days between set dates": number;
};
const LeavesDisplayContainer = (props: {
  leaves: [LeaveType];
  setShowModal: Dispatch<SetStateAction<ModalType>>;
}) => {
  const [cardView, setCardView] = useState(false);
  const { width } = useWindowDimensions();
  const revalidator = useRevalidator();
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);

  const deleteHandler = useCallback(async (id: string) => {
    try {
      await dispatch(deleteLeaveAction(id));
      revalidator.revalidate();
    } catch (error: any) {
      dispatch(
        uiActions.showToastError({
          message: error.message,
          id: "deleteLeaveError",
        })
      );
    }
  }, []);

  const updateHandler = useCallback(async (id: string) => {
    try {
      await dispatch(autofillUpdateAction(id));
      props.setShowModal("leaveForm");
    } catch (error: any) {
      dispatch(
        uiActions.showToastError({
          message: error.message,
          id: "autofillDataError",
        })
      );
    }
  }, []);
  const displayHandler = useCallback(() => {
    setCardView((prev) => !prev);
  }, []);
  const changeFormState = useCallback(async (id: string) => {
    try {
      await dispatch(autofillUpdateAction(id));
      props.setShowModal("changeStateForm");
    } catch (error: any) {
      dispatch(
        uiActions.showToastError({
          message: error.message,
          id: "changeStateError",
        })
      );
    }
  }, []);

  const reportHandler = useCallback(() => {
    props.setShowModal("reportForm");
  }, []);
  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className='home--button-group'>
        <div className='home--button-group__admin'>
          <Button onClick={() => props.setShowModal("leaveForm")}>
            Apply For Leave
          </Button>
          {userState.name === "admin" && (
            <Button onClick={reportHandler}>Generate Report</Button>
          )}
        </div>
        {width > 768 && (
          <Button onClick={displayHandler}>
            {cardView ? "Table View" : "Card View"}
          </Button>
        )}
      </div>
      {!cardView && width > 768 ? (
        <Table
          leaves={props.leaves}
          onUpdate={updateHandler}
          onDelete={deleteHandler}
          onState={changeFormState}
        />
      ) : (
        <div className='card-container'>
          {props.leaves.map((leave) => (
            <Card
              leave={leave}
              key={leave._id}
              onUpdate={updateHandler}
              onDelete={deleteHandler}
              onState={changeFormState}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default LeavesDisplayContainer;
