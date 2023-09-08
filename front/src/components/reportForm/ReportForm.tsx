import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import "./reportForm.scss";
import { ModalType } from "../../pages/Home";
import Button from "../../UI/Button/Button";
import { useAppDispatch, useAppSelector } from "../../utils/reduxTypeHooks";
import { generateReportAction } from "../../store/leaveActions";
import { uiActions } from "../../store/uiSlice";
const ReportForm = (props: {
  setShowModal: Dispatch<SetStateAction<ModalType>>;
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const uiState = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  const submitHandler = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      try {
        await dispatch(generateReportAction({ startDate, endDate }));
        props.setShowModal("closed");
      } catch (error: any) {
        console.error(error);
        dispatch(
          uiActions.showError({
            message: error.message,
            id: "generateReportError",
          })
        );
      }
    },
    [startDate, endDate]
  );
  return (
    <div className='report'>
      <span className='report--heading'>
        Select interval to generate report
      </span>
      <form className='report--form' onSubmit={submitHandler}>
        <label htmlFor='startDateReport'>Start Date</label>
        <input
          type='date'
          id='startDateReport'
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor='endDateReport'>End Date</label>
        <input
          type='date'
          id='endDateReport'
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button className='form--button' type='submit'>
          Generate
        </Button>
      </form>
      {uiState.error.map((error) => (
        <span className='error--text' key={error.id}>
          {error.message}
        </span>
      ))}
    </div>
  );
};

export default ReportForm;
