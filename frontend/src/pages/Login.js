import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import Navbar from "../components/Navbar";

export function Login() {

      const [isShowLogin, setIsShowLogin] = useState(true);
    
      const handleLoginClick = () => {
        setIsShowLogin((isShowLogin) => !isShowLogin);
      };
      const repeatedText = Array.from({ length: 100 }, (_, index) => (
        <React.Fragment key={index}>
          text <br />
        </React.Fragment>
      ));
      return (
        <div className="Login">
          <Navbar handleLoginClick={handleLoginClick} />
          <LoginForm isShowLogin={isShowLogin} />
          {repeatedText}
        </div>
      );
    


}