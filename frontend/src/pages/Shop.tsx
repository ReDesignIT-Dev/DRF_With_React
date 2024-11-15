import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import ShopHome from "pages/ShopHome";
import ShopHeader from "components/ShopHeader";
import ShopFooter from "components/ShopFooter";
import Login from "pages/Login";
import Register from "pages/Register";
import PasswordRecovery from "pages/PasswordRecovery";
import PasswordReset from "pages/PasswordReset";
import UserActivation from "pages/UserActivation";
import Category from "pages/Category";
import Product from "pages/Product";
import Cart from "pages/Cart";
import SearchPage from "pages/SearchPage";
import NotFound from "pages/NotFound";
import { Box } from "@mui/material";
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

function Shop() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ShopHeader />
      <Box sx={{ flex: 1 }}>
        <Routes>
          <Route path="" element={<ShopHome />} />
          <Route path={FRONTEND_LOGIN_URL} element={<Login />} />
          <Route path={FRONTEND_REGISTER_URL} element={<Register />} />
          <Route path={FRONTEND_PASSWORD_RECOVERY_URL} element={<PasswordRecovery />} />
          <Route path={FRONTEND_PASSWORD_RESET_URL} element={<PasswordReset />} />
          <Route path={FRONTEND_ACTIVATE_USER_URL} element={<UserActivation />} />
          <Route path={`${FRONTEND_CATEGORY_URL}/:slug`} element={<Category />} />
          <Route path={`${FRONTEND_PRODUCT_URL}/:slug`} element={<Product />} />
          <Route path={FRONTEND_SEARCH_URL} element={<SearchPage />} />
          <Route path={FRONTEND_CART_URL} element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
      <ShopFooter />
    </Box>
  );
}

export default Shop;
