import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import Navbar from "../components/Navbar";
import "./Login.scss";

export function Login() {


      const [isShowLogin, setIsShowLogin] = useState(true);
    
      const handleLoginClick = () => {
        setIsShowLogin((isShowLogin) => !isShowLogin);
      };
    
      return (
        <div className="Login">
          <Navbar handleLoginClick={handleLoginClick} />
          <LoginForm isShowLogin={isShowLogin} />
        </div>
      );
    


}