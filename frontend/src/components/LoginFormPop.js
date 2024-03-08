import React, { useState } from "react";
import "./LoginFormPop.scss";
import "react-bootstrap"

const LoginFormPop = ({ isShowLogin, handleXClick }) => {
  // login logic
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // signup logic
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // login errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // signup errors
  const [signupEmailError, setSignupEmailError] = useState("");
  const [signupPasswordError, setSignupPasswordError] = useState("");
  const [signupPasswordRepeatError, setSignupPasswordRepeatError] = useState("");
  // detect if in login or signup mode
  const [state, setState] = useState("login");

  const handleEscape = () => {
    handleXClick();
  };

  const toggleState = () => {
    state === 'login' ? setState('signup') : setState('login');
  };

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
    setSignupEmailError("");
    setSignupPasswordError("");
    setSignupPasswordRepeatError("");
  }

  const isEmailValid = (emailToTest) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(emailToTest)) {
      return true;
    }
    return false;
  }

  const isEmpty = (inputText) => {
    if (inputText === ""){
      return true;
    }
    return false;
  }

  const isPasswordValid = (passwordToValidate) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(passwordToValidate);
  };

  const onSubmitClick = () => {
    clearErrors();

    if (state === "login"){

      if (isEmpty(email)){
        setEmailError("Please enter your email");
        return
      }

      if (!isEmailValid(email)){
        setEmailError("Please enter a valid email");
        return;
      }


    }
    else if (state === "signup"){


    }
    else {
      console.log("state is not login nor signup")
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter your email");
      return;
    }

    if ("" === password) {
      setPasswordError("Please enter a password");
      return;
    }

    if (password.length < 8) {
      setPasswordError("The password must be 8 characters or longer");
      return;
    }
    if (state === "login") {
      console.log('Form submitted with email: ', email, 'and password:', password);
    }
    else if (state === "signup") {
      console.log('REGISTER with data:', email, 'and password:', password, 'and name:', signupName);
    }
  };

  return (
    <div className={`${isShowLogin ? "active " : ""} show login-form`}>
      <div className={`form-box solid app--is-${state} d-flex flex-column justify-content-center`}>

        <div className="d-flex justify-content-end close-button-div">
          <button className="close-button" onClick={handleEscape}> X </button>
        </div>
        <div className={`form-block-wrapper form-block-wrapper--is-${state}`} ></div>
        <section className={`form-block form-block--is-${state}`}>
          <header className="form-block__header d-flex flex-column">
            <h1 className="text-center">{state === 'login' ? 'Welcome back!' : 'Sign up'}</h1>
            <div className="form-block__toggle-block d-flex flex-row">
              <div className="toggle-text">
                <span className="text-nowrap d-flex align-items-center">{state === 'login' ? 'Don\'t' : 'Already'} have an account? Click here &#8594;</span>
              </div>
              <div className="toggle-slider">
                <input id="form-toggler" type="checkbox" onClick={() => {
                  toggleState();
                  clearErrors();
                }} />
                <label className="flex-shrink-1" htmlFor="form-toggler"></label>
              </div>
            </div>
          </header>

          <form onSubmit={(e) => {
            e.preventDefault();
            onSubmitClick();
          }}>
            <div className="form-block__input-wrapper">
              <div className="form-group form-group--login">
                <Input type="text" id="email" label="email" value={email} disabled={state === 'signup'} onChange={(ev) => setEmail(ev.target.value)} />
                <ErrorLabel error={emailError} state={state} groupState="login" />
                <Input type="password" id="password" label="password" disabled={state === 'signup'} onChange={(ev) => setPassword(ev.target.value)}/>
                <ErrorLabel error={passwordError} state={state} groupState="login" />
              </div>
              <div className="form-group form-group--signup">
                <Input type="text" id="fullname" label="full name" disabled={state === 'login'} onChange={(ev) => setSignupName(ev.target.value)} />
                <Input type="text" id="email" label="email" disabled={state === 'login'} onChange={(ev) => setSignupEmail(ev.target.value)} />
                <ErrorLabel error={signupEmailError} state={state} groupState="signup" />
                <Input type="password" id="createpassword" label="password" disabled={state === 'login'} onChange={(ev) => setCreatePassword(ev.target.value)} />
                <ErrorLabel error={signupPasswordError} state={state} groupState="signup" />
                <Input type="password" id="repeatpassword" label="repeat password" disabled={state === 'login'} onChange={(ev) => setRepeatPassword(ev.target.value)} />
                <ErrorLabel error={signupPasswordRepeatError} state={state} groupState="signup" />
              </div>
            </div>
            <button className="button button--primary d-flex align-items-center justify-content-center p-3 mt-4 mx-auto" type="submit">{state === 'login' ? 'Log In' : 'Sign Up'}</button>
          </form>
        </section>
      </div>
    </div>
  );
};

const Input = ({ id, type, label, disabled, value, onChange }) => (
  <input className="form-group__input" type={type} id={id} placeholder={label} disabled={disabled} onChange={onChange} value={value} />
);

const ErrorLabel = ({ error, groupState, state }) => (
  <label className={`${groupState === state ? "" : "hidden"} errorLabel d-flex justify-content-center text-center px-2`} >{error}</label>
);

export default LoginFormPop;