import React from "react";
import "./SignInButton.css";
import "react-bootstrap";

export default function SignInButton({ isLoggedIn, handleLogout, handleLoginClick }) {
  const handleClick = () => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      handleLoginClick();
    }
  };

  return (
    <div onClick={handleClick} className='loginicon'>
      <p>{isLoggedIn ? "Log Out" : "Log In / Signup"}</p>
    </div>
  );
}
