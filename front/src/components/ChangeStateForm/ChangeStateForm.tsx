import {
  Dispatch,
  SetStateAction,
  useState,
  useCallback,
  FormEvent,
} from "react";
import Button from "../../UI/Button/Button";
import "./changeStateForm.scss";
import { ModalType } from "../../pages/Home";
import { useAppDispatch, useAppSelector } from "../../utils/reduxTypeHooks";
import { changeStateAction } from "../../store/leaveActions";
import { useRevalidator } from "react-router-dom";
import { uiActions } from "../../store/uiSlice";

const ChangeStateForm = (props: {
  setShowModal: Dispatch<SetStateAction<ModalType>>;
}) => {
  const [selectedState, setSelectedState] = useState("");
  const dispatch = useAppDispatch();
  const revalidator = useRevalidator();
  const leaveState = useAppSelector((state) => state.leave);
  const uiState = useAppSelector((state) => state.ui);
  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      try {
        await dispatch(changeStateAction(leaveState.id, selectedState));
        props.setShowModal("closed");
        revalidator.revalidate();
      } catch (error: any) {
        dispatch(
          uiActions.showError({
            message: error.message,
            id: "changeStateError",
          })
        );
      }
    },
    [selectedState, leaveState.id]
  );

  return (
    <>
      <form onSubmit={handleSubmit} className='change-state-form'>
        <span className='change-state--text'>Select State</span>
        <div className='change-state-form--item'>
          <Button
            className='change-button__green'
            onClick={() => setSelectedState("Approved")}
          >
            Approved
          </Button>
          <Button
            className='change-button__yellow'
            onClick={() => setSelectedState("Pending")}
          >
            Pending
          </Button>
          <Button
            className='change-button__red'
            onClick={() => setSelectedState("Cancelled")}
          >
            Cancelled
          </Button>
        </div>
        <Button type='submit' className='form--button'>
          Submit
        </Button>
      </form>
      {uiState.error.map((error) => (
        <span className='error--text' key={error.id}>
          {error.message}
        </span>
      ))}
    </>
  );
};

export default ChangeStateForm;
