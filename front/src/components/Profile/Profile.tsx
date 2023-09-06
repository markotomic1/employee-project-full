import Button from "../../UI/Button/Button";
//import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import "./profile.scss";
import Modal from "../Modal/Modal";
import { useCallback, useState } from "react";
import { useAppSelector } from "../../utils/reduxTypeHooks";
import { ModalType } from "../../pages/Home";

const User = () => {
  const [showPasswordModal, setShowPasswordModal] =
    useState<ModalType>("closed");
  const userState = useAppSelector((state) => state.user);
  const changePasswordHandler = useCallback(() => {
    setShowPasswordModal("changePasswordForm");
  }, []);
  return (
    <>
      {showPasswordModal === "changePasswordForm" && (
        <Modal
          showModal={showPasswordModal}
          setShowModal={setShowPasswordModal}
        />
      )}
      <div className='user'>
        <div className='user-container'>
          <div className='user--icon-container'>
            <span className='profile--icon--text'>
              {userState.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className='user--info'>
            <div className='profile--item'>
              <span>Username: </span>
              <span>{userState.name}</span>
            </div>
            <div className='profile--item'>
              <span>Email: </span>
              <span>{userState.email}</span>
            </div>
          </div>
        </div>
        <div className='user--edit'>
          <Button className='update' onClick={changePasswordHandler}>
            <LockIcon /> Change Password
          </Button>
        </div>
      </div>
    </>
  );
};

export default User;
