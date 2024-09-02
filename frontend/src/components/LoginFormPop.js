import "./LoginFormPop.scss";
import { useState } from "react";
import LoginFormComponent from "./LoginFormComponent";
import RegisterFormComponent from "./RegisterFormComponent";

const LoginFormPop = ({ isShowLogin, handleXClick }) => {

  const [state, setState] = useState("login");

  const toggleState = () => {
    state === "login" ? setState("signup") : setState("login");
  };


  const renderLoginFormFields = () => (
    <div className="form-group form-group--login">
      <LoginFormComponent onSuccessfulSubmit={handleXClick}/>
    </div>
  );

  const renderSignupFormFields = () => (
    <div className="form-group form-group--signup">
      <RegisterFormComponent onSuccessfulSubmit={handleXClick}/>
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
                  }}
                />
                <label className="flex-shrink-1" htmlFor="form-toggler"></label>
              </div>
            </div>
          </header>

            <div className="form-block__input-wrapper">{renderFormFields()}</div>
        </section>
      </div>
    </div>
  );
};

export default LoginFormPop;
