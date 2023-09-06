import { useCallback } from "react";
import Button from "../../UI/Button/Button";
import Wrapper from "../../UI/Wrapper/Wrapper";
import { useAppDispatch } from "../../utils/reduxTypeHooks";
import ChangePasswordForm from "../ChangePasswordForm/ChangePasswordForm";
import LeaveFormModal from "../LeaveForm/LeaveFormModal";
import "./modal.scss";
import ReactDOM from "react-dom";
import { uiActions } from "../../store/uiSlice";
import ChangeStateForm from "../ChangeStateForm/ChangeStateForm";
import { ModalType } from "../../pages/Home";
import ReportForm from "../reportForm/ReportForm";
import { leaveActions } from "../../store/leaveSlice";

const Modal = (props: {
  setShowModal: React.Dispatch<React.SetStateAction<ModalType>>;
  showModal: string;
}) => {
  const dispatch = useAppDispatch();

  const closeModal = useCallback(() => {
    dispatch(uiActions.removeAllErrors());
    dispatch(leaveActions.setEdit());
    props.setShowModal("closed");
  }, []);

  const Backdrop = () => {
    return <div className='backdrop' onClick={closeModal} />;
  };

  const ModalOverlay = () => {
    return (
      <Wrapper className='modal-wrapper'>
        <div className='modal'>
          <Button onClick={closeModal} className='modal--close-button'>
            X
          </Button>
          {props.showModal === "leaveForm" ? (
            <LeaveFormModal setShowModal={props.setShowModal} />
          ) : props.showModal === "changePasswordForm" ? (
            <ChangePasswordForm setShowModal={props.setShowModal} />
          ) : props.showModal === "changeStateForm" ? (
            <ChangeStateForm setShowModal={props.setShowModal} />
          ) : (
            <ReportForm setShowModal={props.setShowModal} />
          )}
        </div>
      </Wrapper>
    );
  };
  return (
    <>
      {ReactDOM.createPortal(<Backdrop />, document.body)}
      {ReactDOM.createPortal(<ModalOverlay />, document.body)}
    </>
  );
};

export default Modal;
