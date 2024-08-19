import React from "react";
import "./SignInButton.css";
import "react-bootstrap";
import { FaRegUserCircle } from "react-icons/fa";

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
      {isLoggedIn ? (<p className="my-auto px-3">Log Out</p>) : <FaRegUserCircle size={'1x'} />}
    </div>
  );
}
