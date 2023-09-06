import Button from "../../UI/Button/Button";
import "./card.scss";
import { LeaveType } from "../LeavesDisplayContainer/LeavesDisplayContainer";
import { formatDateToYYYYMMDDLocal } from "../../utils/dateFormat";
import { useAppSelector } from "../../utils/reduxTypeHooks";

const Card = (props: {
  leave: LeaveType;
  onUpdate: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onState: (id: string) => Promise<void>;
}) => {
  const userState = useAppSelector((state) => state.user);

  let leaveStatusClass = "";
  if (props.leave.state === "Approved") {
    leaveStatusClass = "change-button__green";
  } else if (props.leave.state === "Pending") {
    leaveStatusClass = "change-button__yellow";
  } else {
    leaveStatusClass = "change-button__red";
  }
  return (
    <div className='card'>
      <div className='card--item'>
        <span>Reason For Leave:</span>
        <span className='card--item--text'>
          {props.leave["Reason for leave"]}
        </span>
      </div>
      <div className='card--item'>
        <span>Leave Type:</span>
        <span className='card--item--text'>{props.leave["Leave type"]}</span>
      </div>
      <div className='card--item'>
        <span>Leave Start Date:</span>
        <span className='card--item--text'>
          {formatDateToYYYYMMDDLocal(
            new Date(props.leave["Start date of leave"])
          )}
        </span>
      </div>
      <div className='card--item'>
        <span>Leave End Date:</span>
        <span className='card--item--text'>
          {formatDateToYYYYMMDDLocal(
            new Date(props.leave["End date of leave"])
          )}
        </span>
      </div>
      <div className='card--item'>
        <span>Status:</span>
        <span
          className={`card--item--text card--item--status ${leaveStatusClass}`}
        >
          {props.leave.state}
        </span>
      </div>
      <div className='card--item'>
        <span>Total Leave Days:</span>
        <span className='card--item--text'>
          {props.leave["Count of working days between set dates"]}
        </span>
      </div>
      <div className='card--button-container'>
        {(props.leave.state === "Pending" || userState.name === "admin") && (
          <Button
            className='button__edit'
            onClick={() => props.onUpdate(props.leave._id)}
          >
            Update
          </Button>
        )}
        <Button
          className='button__delete'
          onClick={() => props.onDelete(props.leave._id)}
        >
          Delete
        </Button>
        {userState.name === "admin" && (
          <Button
            className='button__change-state'
            onClick={() => props.onState(props.leave._id)}
          >
            Change State
          </Button>
        )}
      </div>
    </div>
  );
};

export default Card;
