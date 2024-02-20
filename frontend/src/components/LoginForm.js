import React from "react";
import "./LoginForm.scss";
import LoginFormPop from "./LoginFormPop";
import "react-bootstrap"

const LoginForm = ({ isShowLogin }) => {

  return (
    <div className={`${isShowLogin ? "active" : ""} show`}>
      <div className="login-form">
        <div className="form-box solid">
           <LoginFormPop />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
