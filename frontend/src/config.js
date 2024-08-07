export const BASE_URL = "http://localhost:8000";

// user login/register based
export const FRONTEND_LOGIN_URL = "/login";
export const FRONTEND_REGISTER_URL = "/register";
export const FRONTEND_ACTIVATE_USER_URL = "/activate/:token";
export const FRONTEND_PASSWORD_RECOVERY_URL = "/password-recovery";
export const FRONTEND_PASSWORD_RESET_URL = "/password-reset/:token";

// shop based
export const FRONTEND_PRODUCT_URL = "/product/:slug";
export const FRONTEND_CATEGORY_URL = "/category/:slug";
export const FRONTEND_SEARCH_URL = "/search";

// API urls should match the django urls
export const API_LOGOUT_USER_URL = "/logout";
export const API_LOGIN_USER_URL = "/login";
export const API_ACTIVATE_USER_URL = "/activate";
export const API_REGISTER_USER_URL = "/register";
export const API_PASSWORD_RESET_URL = "/password-reset";

// API shop based
export const API_PRODUCT_URL = "/product";
export const API_CATEGORY_URL = "/category";
export const API_ALL_CATEGORIES = "/categories";
export const API_SEARCH_URL = "/search";