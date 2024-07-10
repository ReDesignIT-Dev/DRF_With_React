import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Home from "pages/Home";
import About from "pages/About";
import Contact from "pages/Contact";
import Header from "components/Header";
import Footer from "components/Footer";
import NotFound from "pages/NotFound";
import PasswordReset from "pages/PasswordReset";
import UserActivation from "pages/UserActivation";
import PasswordRecovery from "pages/PasswordRecovery";
import Login from "pages/Login";
import Register from "pages/Register";

import { isUserLoggedIn } from "utils/validation";
import { logoutUser } from "services/apiRequests";

import {
  FRONTEND_PASSWORD_RESET_URL,
  FRONTEND_PASSWORD_RECOVERY_URL,
  FRONTEND_ACTIVATE_USER_URL,
  FRONTEND_LOGIN_URL,
  FRONTEND_REGISTER_URL,
} from "config";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());

  const handleLogout = () => {
    try {
      logoutUser();
      setIsLoggedIn(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const routes = [
    { path: "", element: <Home /> },
    { path: "about", element: <About /> },
    { path: "contact", element: <Contact /> },
    {
      path: FRONTEND_LOGIN_URL,
      element: <Login isLoggedIn={isLoggedIn} onLoginSuccess={setIsLoggedIn} />,
    },
    { path: FRONTEND_REGISTER_URL, element: <Register isLoggedIn={isLoggedIn} /> },
    { path: FRONTEND_PASSWORD_RECOVERY_URL, element: <PasswordRecovery /> },
    { path: FRONTEND_PASSWORD_RESET_URL, element: <PasswordReset /> },
    { path: FRONTEND_ACTIVATE_USER_URL, element: <UserActivation /> },
    { path: "*", element: <NotFound /> },
  ];

  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
        {routes.map(({ path, element }, index) => (
          <Route key={index} exact path={path} element={element} />
        ))}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
