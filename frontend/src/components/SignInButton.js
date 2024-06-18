import React, { useEffect, useState } from "react";
import "./SignInButton.css";
import "react-bootstrap";
import { getToken, removeToken } from "utils/cookies";
import { logoutUser } from "services/apiRequests";

export default function SignInButton({ handleLoginClick }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      const token = getToken();
      try {
        logoutUser(token);
      } catch (error) {
        console.log(error.message);
      }
      removeToken();
      setIsLoggedIn(false);
    } else {
      handleLoginClick();
    }
  };

  return (
    <div onClick={handleClick} className="loginicon">
      {isLoggedIn ? "Log Out" : "Sign In"}
    </div>
  );
}
