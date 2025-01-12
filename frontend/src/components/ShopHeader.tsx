import React from "react";
import SignInButton from "./SignInButton";
import SearchBox from "./SearchBox";
import { Link } from "react-router-dom";
import "./Header.scss";
import LogoRacoon from "./LogoRacoon";
import CategoryDropdown from "./CategoryDropdown";
import { FaShoppingCart } from "react-icons/fa";
import { ArrowLeft } from "@mui/icons-material";
import { Grid2 } from "@mui/material";
import { Box, Button } from "@mui/material";
import { FRONTEND_BASE_URL, FRONTEND_CART_URL, FRONTEND_SHOP_URL } from "config";

const ShopHeader: React.FC = () => {
  return (
    <Box className="main-header" px={3}>
      <Box className="header" py={2}>
        {/* Top Header */}
        <Grid2 
          container 
          spacing={2} 
          className="top-header" 
          justifyContent="center" 
          alignItems="center"
        >
          {/* Logo */}
          <Grid2 sx={{ xs: 12 }} className="header-logo">
            <Link to={FRONTEND_SHOP_URL}>
              <LogoRacoon />
            </Link>
          </Grid2>

          {/* Leave Button */}
          <Grid2 sx={{ xs: 12 }} textAlign="center">
            <Link to={FRONTEND_BASE_URL}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowLeft />}
                className="base-url-button"
                sx={{ textTransform: "none" }}
              >
                ReDesignIT
              </Button>
            </Link>
          </Grid2>

          {/* Search Box */}
          <Grid2 sx={{ xs: 12 }} className="header-searchbar">
            <SearchBox />
          </Grid2>

          {/* Sign-in and Cart */}
          <Grid2 sx={{ xs: 12 }} textAlign="center">
            <Box className="header-signin" display="flex" gap={2} justifyContent="center" alignItems="center">
              <Link
                to={FRONTEND_CART_URL}
                className="shopping-cart-icon"
              >
                <FaShoppingCart size={40} />
              </Link>
              <SignInButton />
            </Box>
          </Grid2>
        </Grid2>

        {/* Navigation */}
        <Grid2 
          container 
          spacing={2} 
          className="header-nav" 
          my={2} 
          justifyContent="center"
        >
          <Grid2 sx={{ xs: 12 }} className="nav-element">
            <CategoryDropdown />
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default ShopHeader;
