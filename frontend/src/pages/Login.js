import React, { useState } from "react";
import LoginFormPop from "../components/LoginFormPop";
import Navbar from "../components/Navbar";

export function Login() {

      const [isShowLogin, setIsShowLogin] = useState(true);
    
      const handleLoginClick = () => {
        setIsShowLogin((isShowLogin) => !isShowLogin);
      };

      return (
        <div className="Login">
          <Navbar handleLoginClick={handleLoginClick} />
          <LoginFormPop isShowLogin={isShowLogin} />
        </div>
      );
    


}