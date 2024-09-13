import React from "react";
import "./SignInButton.css";
import "react-bootstrap";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "reduxComponents/reducers/authReducer";
import { useAuth } from "hooks/useAuth";
import { AppDispatch } from "reduxComponents/store" // Adjust the import path as necessary

interface SignInButtonProps {
  handleIconClick: () => void;
}

const SignInButton: React.FC<SignInButtonProps> = ({ handleIconClick }) => {
  const isLoggedIn = useAuth();
  const dispatch = useDispatch<AppDispatch>();

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
};

export default SignInButton;