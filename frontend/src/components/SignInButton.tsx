import React, { useCallback } from "react";
import "./SignInButton.css";
import "react-bootstrap";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "reduxComponents/reducers/authReducer";
import { useAuth } from "hooks/useAuth";
import { AppDispatch } from "reduxComponents/store" 
import { useNavigate } from "react-router-dom";
import { FRONTEND_LOGIN_URL, FRONTEND_SHOP_URL } from "config";
import { debounce } from "lodash";


const SignInButton: React.FC = () => {
  const isLoggedIn = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleClick = useCallback(
    debounce(() => {
      if (isLoggedIn) {
        dispatch(logout());
      } else {
        navigate(`${FRONTEND_SHOP_URL}${FRONTEND_LOGIN_URL}`);
      }
    }, 300), // Adjust debounce delay as needed
    [isLoggedIn, dispatch, navigate]
  );

  return (
    <div onClick={handleClick} className='loginicon'>
      {isLoggedIn ? <p className='my-auto px-3'>Log Out</p> : <FaRegUserCircle size={"40px"} />}
    </div>
  );
};

export default SignInButton;