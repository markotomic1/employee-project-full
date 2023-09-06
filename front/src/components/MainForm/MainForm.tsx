import Button from "../../UI/Button/Button";
import Wrapper from "../../UI/Wrapper/Wrapper";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useCallback } from "react";
import { useState } from "react";
import { loginAction } from "../../store/userActions";
import "./mainForm.scss";
import { useAppDispatch, useAppSelector } from "../../utils/reduxTypeHooks";
import { uiActions } from "../../store/uiSlice";

const MainForm = (props: { type: "login" | "register" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const uiState = useAppSelector((state) => state.ui);
  const navigate = useNavigate();

  const submitHandler = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      try {
        await dispatch(loginAction(email, password, props.type));
        if (props.type === "register") {
          navigate("/login");
        }
      } catch (error: any) {
        dispatch(
          uiActions.showError({
            message: error.message,
            id: "loginError",
          })
        );
      }
    },
    [email, password, props.type]
  );
  return (
    <div className='form-container'>
      <Wrapper>
        <h1 className='form--heading'>
          {props.type === "login" ? "Login" : "Register"}
        </h1>
        <form className='form' onSubmit={submitHandler}>
          <div className='form--group'>
            <label htmlFor='email' className='form--label'>
              Email
            </label>
            <input
              type='email'
              id='email'
              className='form--input'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='form--group'>
            <label htmlFor='password' className='form--label'>
              Password
            </label>
            <input
              type='password'
              id='password'
              className='form--input'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='button-group'>
            <span className='button-group--text'>
              {props.type === "login"
                ? "Do not have an Account."
                : "Already have an Account."}
              <Link
                to={props.type === "login" ? "/register" : "/login"}
                className='link'
              >
                {props.type === "login" ? " Register" : " Login"}
              </Link>
            </span>
            <Button
              type='submit'
              className='log-reg-button'
              disabled={uiState.loading}
            >
              Submit
            </Button>
          </div>
        </form>
        {uiState.error.map((error) => {
          return (
            <span className='error--text' key={error?.id}>
              {error?.message}
            </span>
          );
        })}
      </Wrapper>
    </div>
  );
};

export default MainForm;
