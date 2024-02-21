import React, { useState } from "react";
import LoginFormPop from "./LoginFormPop";
import Navbar from "./Navbar";

function Header() {

      const [isShowLogin, setIsShowLogin] = useState(true);
    
      const handleLoginClick = () => {
        setIsShowLogin((isShowLogin) => !isShowLogin);
      };

      return (
        <div className="header">
          <Navbar handleLoginClick={handleLoginClick} />
          <LoginFormPop isShowLogin={isShowLogin} />
        </div>
      );
}

export default Header;