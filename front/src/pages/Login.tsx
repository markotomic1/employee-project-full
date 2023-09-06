import { useNavigate } from "react-router-dom";
import MainForm from "../components/MainForm/MainForm";
import { useAppSelector } from "../utils/reduxTypeHooks";
import { useEffect } from "react";
const Login = () => {
  const userState = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (userState.isLoggedIn) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <MainForm type='login' />
    </>
  );
};

export default Login;
