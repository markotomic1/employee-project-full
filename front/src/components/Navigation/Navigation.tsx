import { Link, useNavigate } from "react-router-dom";
import { userActions } from "../../store/userSlice";
import { useAppDispatch, useAppSelector } from "../../utils/reduxTypeHooks";
import { useCallback, useState } from "react";
import "./navigation.scss";
import Button from "../../UI/Button/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import Person2Icon from "@mui/icons-material/Person2";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Navigation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
  const [showNav, setShowNav] = useState(false);
  const user = useAppSelector((state) => state.user);
  const { width } = useWindowDimensions();

  const logoutHandler = useCallback(() => {
    dispatch(userActions.logout());
    navigate("/login");
  }, []);
  const toggleMenuHandler = useCallback(() => {
    setProfileMenuOpen((prev) => !prev);
  }, []);
  const navigationOpenHandler = () => {
    setShowNav(true);
  };
  const navigationCloseHandler = () => {
    setShowNav(false);
  };
  return (
    <nav className='navigation'>
      {width < 768 && (
        <div className='navigation--menu-icon'>
          {!showNav ? (
            <Button className='menu--button' onClick={navigationOpenHandler}>
              <MenuIcon />
            </Button>
          ) : (
            <Button className='menu--button' onClick={navigationCloseHandler}>
              <CloseIcon />
            </Button>
          )}
        </div>
      )}
      <ul className={`nav-list ${showNav ? "show" : ""}`}>
        <li className='nav-list--item'>
          <h1 className='navigation--heading'>Walter Code d.o.o.</h1>
        </li>
        <li className='nav-list--item'>
          <Link
            to='/'
            className='nav--link link'
            onClick={navigationCloseHandler}
          >
            My Leaves
          </Link>
        </li>
        {user.name === "admin" && (
          <li className='nav-list--item'>
            <Link
              to='/?allLeaves=true'
              className='nav--link link'
              onClick={navigationCloseHandler}
            >
              All Leaves
            </Link>
          </li>
        )}
        {user.name === "admin" && (
          <li className='nav-list--item'>
            <Link
              to='/?allLeaves=true&state=Approved'
              className='nav--link link'
              onClick={navigationCloseHandler}
            >
              Approved Leaves
            </Link>
          </li>
        )}
        {user.name === "admin" && (
          <li className='nav-list--item'>
            <Link
              to='/?allLeaves=true&state=Pending'
              className='nav--link link'
              onClick={navigationCloseHandler}
            >
              Pending Leaves
            </Link>
          </li>
        )}
      </ul>
      <div className='profile-container'>
        <div className='nav--group'>
          <div className='icon-container'>
            <Person2Icon /> {user.name}
          </div>
          <div className='icon-container icon-container__hover'>
            <Button onClick={toggleMenuHandler} className='menu--button'>
              <SettingsIcon />
            </Button>
          </div>
        </div>
        {profileMenuOpen && (
          <div className='profile--menu'>
            <Link
              to='/user'
              className='link link__white'
              onClick={toggleMenuHandler}
            >
              <div className='icon-container'>
                <AccountCircleIcon />
                <span className='icon--text'>Your Profile</span>
              </div>
            </Link>
            <div className='icon-container'>
              <LogoutIcon />
              <Button onClick={logoutHandler} className='menu--button'>
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
