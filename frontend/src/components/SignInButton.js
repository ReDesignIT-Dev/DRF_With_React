import React from "react";
import "./SignInButton.css";
import "react-bootstrap";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "reduxComponents/reducers/authReducer";
import { useAuth } from "hooks/useAuth";

export default function SignInButton({handleIconClick}) {
  const isLoggedIn = useAuth();
  const dispatch = useDispatch();

  const handleClick = () => {
    if (isLoggedIn) {
      dispatch(logout());
    } else {
      handleIconClick();
    }
  };

  return (
    <div onClick={handleClick} className='loginicon'>
      {isLoggedIn ? <p className='my-auto px-3'>Log Out</p> : <FaRegUserCircle size={"1x"} />}
    </div>
  );
}
