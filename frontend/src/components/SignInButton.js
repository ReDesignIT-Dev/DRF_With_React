import React, { useState } from "react";
import "./SignInButton.css";
import "react-bootstrap";
import { logoutUser } from "services/apiRequests";
import { isUserLoggedIn } from "utils/validation";

export default function SignInButton({isLoggedIn, handleLogout, handleLoginClick }) {

  const handleClick = () => {
    if (isLoggedIn) {
        handleLogout();
    } else {
      handleLoginClick();
    }
  };

  return (
    <div onClick={handleClick} className='loginicon'>
      {isLoggedIn ? "Log Out" : "Sign In"}
    </div>
  );
}
