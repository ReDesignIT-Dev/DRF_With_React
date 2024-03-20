import { useState, useEffect } from "react";
import "./LoginFormPop.scss";
import "react-bootstrap";
import { postData } from "services/apiRequests";
import { Icon } from "react-icons-kit";
import { eye, eyeOff } from "react-icons-kit/feather";
import Input from "./Input";
import ErrorLabel from "./ErrorLabel";
import {
  isEmpty,
  isEmailValid,
  isPasswordValid,
  isTheSamePassword,
  isLengthValid,
  isUppercaseValid,
  isLowercaseValid,
  isDigitValid,
  isSpecialCharValid,
} from "utils/validation";

const LoginFormPop = ({ isShowLogin, handleXClick }) => {
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [icon, setIcon] = useState(eyeOff);

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

  // detect if in login or signup mode
  const [state, setState] = useState("login");

  const toggleState = () => {
    state === "login" ? setState("signup") : setState("login");
    setSignupPassword("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setIcon(showPassword ? eye : eyeOff);
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
    if (state === "login") {
      handleLogin();
    } else if (state === "signup") {
      handleSignup();
    } else {
      handleInvalidState();
    }
  };

  useEffect(() => {
    if (message !== null) {
      console.log("Message:", message);
    }
  }, [message]);

  async function registerUser(userData) {
    try {
      const response = await postData("register/", userData);
      setMessage(response.message);
    } catch (error) {
      console.log(error);
    }
  }

  async function loginUser(userData) {
    try {
      const response = await postData("login/", userData);
      setMessage(response.message);
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogin = () => {
    if (isEmpty(email)) {
      setEmailError("Please enter your email");
      return;
    }

    if (!isEmailValid(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if (isEmpty(password)) {
      setPasswordError("Please enter a password");
      return;
    }

    console.log("Form submitted with email:", email, "and password:", password);

    const userData = {
      email: email,
      password: password,
    };

    loginUser(userData);
  };

  const handleSignup = () => {
    if (isEmpty(signupName)) {
      setSignupNameError("Please enter username");
      return;
    }

    if (isEmpty(signupEmail)) {
      setSignupEmailError("Please enter your email");
      return;
    }

    if (!isEmailValid(signupEmail)) {
      setSignupEmailError("Please enter a valid email");
      return;
    }

    if (isEmpty(signupPassword)) {
      setSignupRepeatPasswordError("Password required");
      return;
    }

    if (!isPasswordValid(signupPassword)) {
      setSignupRepeatPasswordError("Invalid password");
      return;
    }

    if (isEmpty(signupRepeatPassword)) {
      setSignupRepeatPasswordError("Please repeat password");
      return;
    }

    if (!isTheSamePassword(signupPassword, signupRepeatPassword)) {
      setSignupRepeatPasswordError("Passwords do not match");
      return;
    }

    console.log("REGISTER with data:", signupEmail, "and password:", signupPassword, "and name:", signupName);

    const userData = {
      username: signupName,
      email: signupEmail,
      password: signupPassword,
    };

    registerUser(userData);
  };

  const handleInvalidState = () => {
    console.log("Invalid state. The state must be either 'login' or 'signup'");
  };

  const renderLoginFormFields = () => (
    <div className="form-group form-group--login">
      <Input type="text" id="email" label="email" value={email} disabled={state === "signup"} onChange={(ev) => setEmail(ev.target.value)} />
      <ErrorLabel error={emailError} state={state} groupState="login" />
      <Input
        type={showPassword ? "text" : "password"}
        id="password"
        label="password"
        value={password}
        disabled={state === "signup"}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <span class="flex justify-around items-center" onClick={togglePasswordVisibility}>
        <Icon class="absolute mr-10" icon={icon} size={25} />
      </span>
      <ErrorLabel error={passwordError} state={state} groupState="login" />
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
        type="text"
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
