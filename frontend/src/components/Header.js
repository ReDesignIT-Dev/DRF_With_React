import React, { useState } from "react";
import LoginFormPop from "./LoginFormPop";
import SignInButton from "./SignInButton";
import SearchBox from "./SearchBox";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";
import LogoRacoon from "./LogoRacoon";
import CategoryDropdown from "./CategoryDropdown";
import { FaShoppingCart } from "react-icons/fa";

function Header({ isLoggedIn, handleLogout }) {
  const [isShowLogin, setIsShowLogin] = useState(true);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsShowLogin((isShowLogin) => !isShowLogin);
  };

  return (
    <div className='main-header px-3'>
      <div className='header d-flex flex-column py-2'>
        <div className='top-header d-flex gap-2 justify-content-center align-items-center'>
          <div className='header-logo d-flex justify-content-center align-items-center'>
            <Link to='/'>
              <LogoRacoon />
            </Link>
          </div>
          <div className='header-searchbar'>
            <SearchBox />
          </div>

          <div className='header-signin d-flex flex-row gap-2 justify-content-center align-items-center'>
          <div
            className='shopping-cart-icon d-flex justify-content-center align-items-center'
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart size={'1x'}/>
          </div>
            <SignInButton
              isLoggedIn={isLoggedIn}
              handleLogout={handleLogout}
              handleLoginClick={handleLoginClick}
            />
          </div>
        </div>

        <div className='header-nav d-flex flex-row gap-2 my-2'>
          <div className='nav-element'>
            <CategoryDropdown />
          </div>
          <div className='nav-element'>
            <Link to='/'> Home </Link>
          </div>
          <div className='nav-element'>
            <Link to='/contact'> Contact </Link>
          </div>
          <div className='nav-element'>
            <Link to='/about'> About </Link>
          </div>
          <div className='nav-element'>
            <Link to='/about/history'> History </Link>
          </div>
        </div>

        <LoginFormPop isShowLogin={isShowLogin} handleXClick={handleLoginClick} />
      </div>
    </div>
  );
}

export default Header;
