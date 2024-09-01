import React, { ReactElement } from "react";
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
import Category from "pages/Category";
import Product from "pages/Product";
import Cart from "pages/Cart";

import {
  FRONTEND_PASSWORD_RESET_URL,
  FRONTEND_PASSWORD_RECOVERY_URL,
  FRONTEND_ACTIVATE_USER_URL,
  FRONTEND_LOGIN_URL,
  FRONTEND_REGISTER_URL,
  FRONTEND_PRODUCT_URL,
  FRONTEND_CATEGORY_URL,
  FRONTEND_SEARCH_URL,
  FRONTEND_CART_URL,
} from "config";
import SearchPage from "pages/SearchPage";

interface RouteConfig {
  path: string;
  element: ReactElement;
}

function App() {
  const routes: RouteConfig[] = [
    { path: "", element: <Home /> },
    { path: FRONTEND_LOGIN_URL, element: <Login /> },
    { path: FRONTEND_REGISTER_URL, element: <Register /> },
    { path: FRONTEND_PASSWORD_RECOVERY_URL, element: <PasswordRecovery /> },
    { path: FRONTEND_PASSWORD_RESET_URL, element: <PasswordReset /> },
    { path: FRONTEND_ACTIVATE_USER_URL, element: <UserActivation /> },
    { path: FRONTEND_CATEGORY_URL, element: <Category /> },
    { path: FRONTEND_PRODUCT_URL, element: <Product /> },
    { path: FRONTEND_SEARCH_URL, element: <SearchPage /> },
    { path: FRONTEND_CART_URL, element: <Cart /> },
    { path: "*", element: <NotFound /> },
  ];

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {routes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
