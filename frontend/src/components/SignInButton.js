import React from "react";
import "./SignInButton.css";
import "react-bootstrap";
import Icon from "react-icons-kit";
import {user} from 'react-icons-kit/fa/user'

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
      <p>{isLoggedIn ? "Log Out" : <Icon icon={user} />}</p>
    </div>
  );
}
