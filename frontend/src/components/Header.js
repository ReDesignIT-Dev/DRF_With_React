import React, { useState } from "react";
import LoginFormPop from "./LoginFormPop";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

function Header() {

  const [isShowLogin, setIsShowLogin] = useState(true);

  const handleLoginClick = () => {
    setIsShowLogin((isShowLogin) => !isShowLogin);
  };

  return (
    <div className="header">
      <Link to="/"> Home </Link>
      <Link to="/contact"> Contact </Link>
      <Link to="/about"> About </Link>
      <Link to="/login"> Login </Link>
      <Link to="/about/history"> History </Link>
      <Navbar handleLoginClick={handleLoginClick} />
      <LoginFormPop isShowLogin={isShowLogin} />
    </div>
  );
}

export default Header;