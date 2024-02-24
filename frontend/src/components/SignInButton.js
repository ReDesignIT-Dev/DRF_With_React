import React from "react";
import "./SignInButton.css";
import "react-bootstrap";

export default function SignInButton({ handleLoginClick }) {
  const handleClick = () => {
    handleLoginClick();
  };
  return (
      <div onClick={handleClick} className="loginicon">
          Sign In
      </div>
  );
}
