import React, { useState } from "react";
import LoginFormPop from "./LoginFormPop";
import SignInButton from "./SignInButton";
import SearchBox from "./SearchBox";
import { Link } from "react-router-dom";
import "./Header.scss";
import logo from "images/racoon-logo.png";

function Header() {

  const [isShowLogin, setIsShowLogin] = useState(true);

  const handleLoginClick = () => {
    setIsShowLogin((isShowLogin) => !isShowLogin);
  };

  return (
    <div className="header d-flex flex-column py-2">
      <div className="top-header d-flex flex-row gap-2 justify-content-center align-items-center">
        <div className="header-logo"><Link to="/"> <img src={logo} alt="LOGO" /></Link></div>
        <div className="header-searchbar"><SearchBox/></div>
        <div className="header-signin"><SignInButton handleLoginClick={handleLoginClick} /></div>
      </div>

      <div className="header-nav d-flex flex-row gap-2">
        <div className="nav-element"><Link to="/"> Home </Link></div>
        <div className="nav-element"><Link to="/contact"> Contact </Link></div>
        <div className="nav-element"><Link to="/about"> About </Link></div>
        <div className="nav-element"><Link to="/login"> Login </Link></div>
        <div className="nav-element"><Link to="/about/history"> History </Link></div>
        
      </div>
      <LoginFormPop isShowLogin={isShowLogin} handleXClick={handleLoginClick} />
    </div>
  );
}

export default Header;