import "./changePasswordForm.scss";
import { useState, useCallback, SetStateAction, Dispatch } from "react";
import Button from "../../UI/Button/Button";
import { useAppDispatch, useAppSelector } from "../../utils/reduxTypeHooks";
import {
  changePasswordAction,
  checkOldPasswordHandler,
} from "../../store/userActions";
import { uiActions } from "../../store/uiSlice";
import { ModalType } from "../../pages/Home";

const ChangePasswordForm = (props: {
  setShowModal: Dispatch<SetStateAction<ModalType>>;
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const dispatch = useAppDispatch();

  const uiState = useAppSelector((state) => state.ui);
  const userState = useAppSelector((state) => state.user);

  const submitHandler = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (newPassword === repeatNewPassword) {
        try {
          await dispatch(changePasswordAction(newPassword));
          dispatch(uiActions.removeError("repeatPassError"));
          props.setShowModal("closed");
        } catch (error: any) {
          dispatch(
            uiActions.showError({
              message: error.message,
              id: "changePassError",
            })
          );
        }
      } else {
        dispatch(
          uiActions.showError({
            message: "Passwords must match!",
            id: "repeatPassError",
          })
        );
      }
    },
    [newPassword, repeatNewPassword]
  );
  const oldPasswordHandler = useCallback(async () => {
    try {
      await dispatch(checkOldPasswordHandler(userState.email, oldPassword));
    } catch (error: any) {
      dispatch(
        uiActions.showError({
          message: error.message,
          id: "oldPassError",
        })
      );
    }
  }, [userState.email, oldPassword]);
  return (
    <>
      <form className='change-password-form' onSubmit={submitHandler}>
        <label htmlFor='oldPass'>Old password</label>
        <input
          type='password'
          id='oldPass'
          className='change-password--input'
          onChange={(e) => setOldPassword(e.target.value)}
          onBlur={oldPasswordHandler}
        />
        <label htmlFor='newPass'>New Password</label>
        <input
          type='password'
          id='newPass'
          className='change-password--input'
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label htmlFor='repeatNewPass'>Repeat New Password</label>
        <input
          type='password'
          id='repeatNewPass'
          className='change-password--input'
          onChange={(e) => setRepeatNewPassword(e.target.value)}
        />
        <Button type='submit' className='form--button'>
          Change
        </Button>
      </form>
      {uiState.error.map((error) => (
        <p className='error--text' key={error?.id}>
          {error?.message}
        </p>
      ))}
    </>
  );
};

export default ChangePasswordForm;
