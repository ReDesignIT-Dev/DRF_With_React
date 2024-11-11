// config.ts
export const BASE_URL: string = "http://localhost:8000";
export const FRONTEND_SHOP_URL: string = "/shop";


// user login/register based
export const FRONTEND_LOGIN_URL: string = "/login";
export const FRONTEND_REGISTER_URL: string = "/register";
export const FRONTEND_ACTIVATE_USER_URL: string = "/activate/:token";
export const FRONTEND_PASSWORD_RECOVERY_URL: string = "/password-recovery";
export const FRONTEND_PASSWORD_RESET_URL: string = "/password-reset/:token";

// shop based
export const FRONTEND_PRODUCT_URL: string = "/product";
export const FRONTEND_CATEGORY_URL: string = "/category";
export const FRONTEND_SEARCH_URL: string = "/search";
export const FRONTEND_CART_URL: string = "/cart";

// API urls should match the django urls
export const API_LOGOUT_USER_URL: string = "/logout";
export const API_LOGIN_USER_URL: string = "/login";
export const API_ACTIVATE_USER_URL: string = "/activate";
export const API_REGISTER_USER_URL: string = "/register";
export const API_PASSWORD_RESET_URL: string = "/password-reset";

// API shop based
export const API_PRODUCT_URL: string = "/product";
export const API_CATEGORY_URL: string = "/category";
export const API_ALL_CATEGORIES: string = "/categories";
export const API_SEARCH_URL: string = "/search";
export const API_SEARCH_ASSOCIATED_CATEGORIES_URL: string = "/search-associated-categories";
export const API_CART_URL: string = "/cart";
export const API_CART_ITEM: string = "/cart/item";
