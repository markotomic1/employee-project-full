import Button from "../../UI/Button/Button";
import "./table.scss";
import { formatDateToYYYYMMDD } from "../../utils/dateFormat";
import { LeaveType } from "../LeavesDisplayContainer/LeavesDisplayContainer";
import { useAppSelector } from "../../utils/reduxTypeHooks";

const Table = (props: {
  leaves: [LeaveType];
  onUpdate: (id: string) => {};
  onDelete: (id: string) => {};
  onState: (id: string) => {};
}) => {
  const userState = useAppSelector((state) => state.user);

  return (
    <table className='table'>
      <thead>
        <tr>
          <th>Reason For Leave</th>
          <th>Leave Type</th>
          <th>Leave Start Date</th>
          <th>Leave End Date</th>
          <th>Status</th>
          <th>Total Leave Days</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.leaves.map((leave) => {
          let leaveStatusClass = "";
          if (leave.state === "Approved") {
            leaveStatusClass = "change-button__green";
          } else if (leave.state === "Pending") {
            leaveStatusClass = "change-button__yellow";
          } else {
            leaveStatusClass = "change-button__red";
          }
          return (
            <tr key={leave._id}>
              <td>{leave["Reason for leave"]}</td>
              <td>{leave["Leave type"]}</td>
              <td>
                {formatDateToYYYYMMDD(new Date(leave["Start date of leave"]))}
              </td>
              <td>
                {formatDateToYYYYMMDD(new Date(leave["End date of leave"]))}
              </td>
              <td className={leaveStatusClass}>{leave.state}</td>
              <td>{leave["Count of working days between set dates"]}</td>
              <td>
                <div className='table--buttons'>
                  {(leave.state === "Pending" ||
                    userState.name === "admin") && (
                    <Button
                      className='button__edit'
                      onClick={() => props.onUpdate(leave._id)}
                    >
                      Update
                    </Button>
                  )}
                  <Button
                    className='button__delete'
                    onClick={() => props.onDelete(leave._id)}
                  >
                    Delete
                  </Button>
                  {userState.name === "admin" && (
                    <Button
                      className='button__change-state'
                      onClick={() => props.onState(leave._id)}
                    >
                      Change State
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
