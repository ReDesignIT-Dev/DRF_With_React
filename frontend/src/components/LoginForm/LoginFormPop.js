import React, { useState, useRef } from "react";
import "./LoginFormPop.scss";
import "react-bootstrap";
import { registerUser, postLogin } from "services/apiRequests";
import { Icon } from "react-icons-kit";
import { eye, eyeOff } from "react-icons-kit/feather";
import Input from "./Input";
import ErrorLabel from "./ErrorLabel";
import ReCAPTCHA from "react-google-recaptcha";
import {
  isEmailValid,
  isPasswordValid,
  isLengthValid,
  isUppercaseValid,
  isLowercaseValid,
  isDigitValid,
  isSpecialCharValid,
} from "utils/validation";
import { setToken } from "utils/cookies";
import { useNavigate } from 'react-router-dom';

const LoginFormPop = ({ isShowLogin, handleXClick }) => {
  //ReCAPTCHA
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef();

  const [showPassword, setShowPassword] = useState(false);

  // login logic
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // signup logic
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRepeatPassword, setSignupRepeatPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // signup errors
  const [signupNameError, setSignupNameError] = useState("");
  const [signupEmailError, setSignupEmailError] = useState("");
  const [signupPasswordRepeatError, setSignupRepeatPasswordError] = useState("");

  const [apiError, setApiError] = useState(null);

  const navigate = useNavigate();

  const devRecaptchaToken = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

  // detect if in login or signup mode
  const [state, setState] = useState("login");

  const toggleState = () => {
    state === "login" ? setState("signup") : setState("login");
    setSignupPassword("");
  };

  const clearErrors = () => {
    setSignupNameError("");
    setEmailError("");
    setPasswordError("");
    setSignupEmailError("");
    setSignupRepeatPasswordError("");
  };

  const onSubmitClick = () => {
    clearErrors();
    handleReCaptcha();
    if (state === "login") {
      handleLogin();
    } else if (state === "signup") {
      handleSignup();
    } else {
      handleInvalidState();
    }
    recaptchaRef.current.reset();
    setRecaptchaToken("");
  };


  const handleReCaptcha = () => {
    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA verification.");
      return;
    }
  };

  async function loginUser(email, password, recaptcha) {
    try {
      const response = await postLogin(email, password, recaptcha);
      const token = response.data.token;
      setToken(token);
      if (response.status === 200) {
        handleXClick();
        navigate("");
      }
    } catch (error) {
      setApiError(error.message);
      console.log(apiError); //TODO DELETE LATER
    }
  }

  const handleLogin = () => {
    if (!email) {
      setEmailError("Please enter your email");
      return;
    }

    if (!isEmailValid(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if (!password) {
      setPasswordError("Please enter a password");
      return;
    }

    console.log("Form submitted with email:", email, "and password:", password, "and token:", recaptchaToken);

    loginUser(email, password, recaptchaToken);
  };

  const handleSignup = () => {
    if (!signupName) {
      setSignupNameError("Please enter username");
      return;
    }

    if (!signupEmail) {
      setSignupEmailError("Please enter your email");
      return;
    }

    if (!isEmailValid(signupEmail)) {
      setSignupEmailError("Please enter a valid email");
      return;
    }

    if (!signupPassword) {
      setSignupRepeatPasswordError("Password required");
      return;
    }

    if (!isPasswordValid(signupPassword)) {
      setSignupRepeatPasswordError("Invalid password");
      return;
    }

    if (signupRepeatPassword === "") {
      setSignupRepeatPasswordError("Please repeat password");
      return;
    }

    if (signupPassword !== signupRepeatPassword) {
      setSignupRepeatPasswordError("Passwords do not match");
      return;
    }

    console.log("REGISTER with data:", signupEmail, "and password:", signupPassword, "and name:", signupName, "and recaptcha:", recaptchaToken);

    registerUser(signupName, signupEmail, signupPassword, signupRepeatPassword, recaptchaToken);
  };

  const handleInvalidState = () => {
    console.log("Invalid state. The state must be either 'login' or 'signup'");
  };

  const renderLoginFormFields = () => (
    <div className="form-group form-group--login">
      <Input type="email" id="email" label="email" value={email} disabled={state === "signup"} onChange={(ev) => setEmail(ev.target.value)} />
      <ErrorLabel error={emailError} state={state} groupState="login" />
      <Input
        type={showPassword ? "text" : "password"}
        id="password"
        label="password"
        value={password}
        disabled={state === "signup"}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <span
        className="d-flex justify-content-center btn btn-link p-0 m-0 text-white text-decoration-none"
        onClick={() => setShowPassword(!showPassword)}
      >
        <span>Show password</span>
        <Icon className="absolute mx-1" icon={showPassword ? eyeOff : eye} size={25} />
      </span>
      <ErrorLabel error={passwordError} state={state} groupState="login" />
      <ReCAPTCHA className="my-1" ref={recaptchaRef} sitekey={devRecaptchaToken} onChange={(token) => setRecaptchaToken(token)} />
    </div>
  );

  const renderSignupFormFields = () => (
    <div className="form-group form-group--signup">
      <Input
        type="text"
        id="username"
        label="username"
        value={signupName}
        disabled={state === "login"}
        onChange={(ev) => setSignupName(ev.target.value)}
      />
      <ErrorLabel error={signupNameError} state={state} groupState="signup" />
      <Input
        type="email"
        id="signupEmail"
        label="email"
        value={signupEmail}
        disabled={state === "login"}
        onChange={(ev) => setSignupEmail(ev.target.value)}
      />
      <ErrorLabel error={signupEmailError} state={state} groupState="signup" />
      <Input
        type="password"
        id="createpassword"
        label="password"
        disabled={state === "login"}
        onChange={(ev) => setSignupPassword(ev.target.value)}
      />
      <div className="password-validation d-flex flex-column align-items-center">
        <div className={isLengthValid(signupPassword) ? "valid" : "invalid"}>Minimum length - 8 characters</div>
        <div className={isUppercaseValid(signupPassword) ? "valid" : "invalid"}>At least one uppercase letter</div>
        <div className={isLowercaseValid(signupPassword) ? "valid" : "invalid"}>At least one lowercase letter</div>
        <div className={isDigitValid(signupPassword) ? "valid" : "invalid"}>At least one numeric digit</div>
        <div className={isSpecialCharValid(signupPassword) ? "valid" : "invalid"}>At least one special character</div>
      </div>
      <Input
        type="password"
        id="repeatpassword"
        label="repeat password"
        disabled={state === "login"}
        onChange={(ev) => {
          setSignupRepeatPassword(ev.target.value);
          setSignupRepeatPasswordError("");
        }}
      />
      <ErrorLabel error={signupPasswordRepeatError} state={state} groupState="signup" />
      <ReCAPTCHA ref={recaptchaRef} sitekey={devRecaptchaToken} onChange={(token) => setRecaptchaToken(token)} />
    </div>
  );

  const renderFormFields = () => {
    if (state === "login") {
      return renderLoginFormFields();
    } else if (state === "signup") {
      return renderSignupFormFields();
    } else {
      return null;
    }
  };

  return (
    <div className={`${isShowLogin ? "active " : ""} show login-form`}>
      <div className={`form-box solid app--is-${state} d-flex flex-column justify-content-center`}>
        <div className="d-flex justify-content-end close-button-div">
          <button className="close-button" onClick={handleXClick}>
            {" "}
            X{" "}
          </button>
        </div>
        <div className={`form-block-wrapper form-block-wrapper--is-${state}`}></div>
        <section className={`form-block form-block--is-${state}`}>
          <header className="form-block__header d-flex flex-column">
            <h1 className="text-center">{state === "login" ? "Welcome back!" : "Sign up"}</h1>
            <div className="form-block__toggle-block d-flex flex-row">
              <div className="toggle-text">
                <span className="text-nowrap d-flex align-items-center">
                  {state === "login" ? "Don't" : "Already"} have an account? Click here &#8594;
                </span>
              </div>
              <div className="toggle-slider">
                <input
                  id="form-toggler"
                  type="checkbox"
                  onClick={() => {
                    toggleState();
                    clearErrors();
                  }}
                />
                <label className="flex-shrink-1" htmlFor="form-toggler"></label>
              </div>
            </div>
          </header>

          <form
            className="login-signup-form"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitClick();
            }}
          >
            <div className="form-block__input-wrapper">{renderFormFields()}</div>
            <button className="button button--primary d-flex align-items-center justify-content-center p-3 mt-4 mx-auto" type="submit">
              {state === "login" ? "Log In" : "Sign Up"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default LoginFormPop;
