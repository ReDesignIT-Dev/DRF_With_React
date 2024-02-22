import React, { useState } from "react";
import LoginFormPop from "./LoginFormPop";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import "./Header.scss";

function Header() {

  const [isShowLogin, setIsShowLogin] = useState(true);

  const handleLoginClick = () => {
    setIsShowLogin((isShowLogin) => !isShowLogin);
  };

  return (
    <div className="header">
      <div className="top-header-info"></div>
      <div className="header-nav">
        <div className="nav-element"><Link to="/"> Home </Link></div>
        <div className="nav-element"><Link to="/contact"> Contact </Link></div>
        <div className="nav-element"><Link to="/about"> About </Link></div>
        <div className="nav-element"><Link to="/login"> Login </Link></div>
        <div className="nav-element"><Link to="/about/history"> History </Link></div>
      </div>

      <Navbar handleLoginClick={handleLoginClick} />
      <LoginFormPop isShowLogin={isShowLogin} />
    </div>
  );
}

export default Header;