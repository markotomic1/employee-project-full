import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../utils/reduxTypeHooks";

const AuthLayout = () => {
  const userState = useAppSelector((state) => state.user);
  if (userState.isLoggedIn) {
    return <Navigate to='/' replace />;
  }
  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthLayout;
