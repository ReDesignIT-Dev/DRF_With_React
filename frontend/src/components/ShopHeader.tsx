import React from "react";
import SignInButton from "./SignInButton";
import SearchBox from "./SearchBox";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";
import LogoRacoon from "./LogoRacoon";
import CategoryDropdown from "./CategoryDropdown";
import { FaShoppingCart } from "react-icons/fa";
import {
  FRONTEND_BASE_URL,
  FRONTEND_CART_URL,
  FRONTEND_SHOP_URL,
} from "config";
import { ArrowLeft } from "@mui/icons-material";
const ShopHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="main-header px-3">
      <div className="header d-flex flex-column py-2">
        <div className="top-header d-flex gap-2 justify-content-center align-items-center">
          <div className="header-logo d-flex justify-content-center align-items-center">
            <Link to={FRONTEND_SHOP_URL}>
              <LogoRacoon />
            </Link>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <Link to={FRONTEND_BASE_URL}>
              <button className="base-url-button btn btn-primary ms-3">
                <ArrowLeft />
                {`Leave the Shop App`}
              </button>
            </Link>
          </div>
          <div className="header-searchbar">
            <SearchBox />
          </div>

          <div className="header-signin d-flex flex-row gap-2 justify-content-center align-items-center">
            <Link
              to={`${FRONTEND_SHOP_URL}${FRONTEND_CART_URL}`}
              className="shopping-cart-icon d-flex justify-content-center align-items-center"
            >
              <FaShoppingCart size={"40px"} />
            </Link>
            <SignInButton />
          </div>
        </div>

        <div className="header-nav d-flex flex-row gap-2 my-2">
          <div className="nav-element">
            <CategoryDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
