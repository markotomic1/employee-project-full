import { useEffect } from "react";
import Navigation from "../components/Navigation/Navigation";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../utils/reduxTypeHooks";
import { getLoggedInUser } from "../store/userActions";
const RootLayout = () => {
  //const location = useLocation().pathname;
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);

  useEffect(() => {
    const getUser = async () => {
      await dispatch(getLoggedInUser());
    };
    getUser();
  }, []);

  return (
    <>
      {userState.isLoggedIn && <Navigation />}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
