// config.ts
export const BACKEND_BASE_URL: string = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8000";
export const FRONTEND_BASE_URL: string = process.env.REACT_APP_FRONTEND_BASE_URL || "http://localhost:3000";
export const BACKEND_SHOP_URL: string =  "/shop";
export const FRONTEND_SHOP_URL: string = "/shop";
export const BACKEND_USER_URL: string = "/user";
export const BACKEND_HOME_URL: string = "/home";
export const RECAPTCHA_SITEKEY: string = process.env.REACT_APP_RECAPTCHA_SITEKEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"

// main page
export const FRONTEND_ABOUT_URL: string = "/about";
export const FRONTEND_CONTACT_URL: string = "/contact";

// user login/register - SHOP BASED
export const ROUTE_PATH_LOGIN: string = "/login";
export const FRONTEND_LOGIN_URL: string = `${FRONTEND_SHOP_URL}${ROUTE_PATH_LOGIN}`;
export const ROUTE_PATH_REGISTER: string = "/register";
export const FRONTEND_REGISTER_URL: string = `${FRONTEND_SHOP_URL}${ROUTE_PATH_REGISTER}`;
export const ROUTE_PATH_ACTIVATE_USER: string = "/activate/:token";
export const FRONTEND_ACTIVATE_USER_URL: string = `${FRONTEND_SHOP_URL}${ROUTE_PATH_ACTIVATE_USER}`;
export const ROUTE_PATH_PASSWORD_RECOVERY: string = "/password-recovery";
export const FRONTEND_PASSWORD_RECOVERY_URL: string = `${FRONTEND_SHOP_URL}${ROUTE_PATH_PASSWORD_RECOVERY}`;
export const ROUTE_PATH_PASSWORD_RESET: string = "/passwrod-reset/:token";
export const FRONTEND_PASSWORD_RESET_URL: string = `${FRONTEND_SHOP_URL}${ROUTE_PATH_PASSWORD_RESET}`;

// shop based
export const ROUTE_PATH_PRODUCT: string = "/product/:slug";
export const FRONTEND_PRODUCT_URL: string = `${FRONTEND_SHOP_URL}${ROUTE_PATH_PRODUCT}`;
export const ROUTE_PATH_CATEGORY: string = "/category/:slug";
export const FRONTEND_CATEGORY_URL: string = `${FRONTEND_SHOP_URL}${ROUTE_PATH_CATEGORY}`;
export const ROUTE_PATH_SEARCH: string = "/search";
export const FRONTEND_SEARCH_URL: string = `${FRONTEND_SHOP_URL}${ROUTE_PATH_SEARCH}`;
export const ROUTE_PATH_CART: string = "/cart";
export const FRONTEND_CART_URL: string = `${FRONTEND_SHOP_URL}${ROUTE_PATH_CART}`;

// API urls should match the django urls
export const API_LOGOUT_USER_URL: string = `${BACKEND_USER_URL}/logout`;
export const API_LOGIN_USER_URL: string = `${BACKEND_USER_URL}/login`;
export const API_ACTIVATE_USER_URL: string = `${BACKEND_USER_URL}/activate`;
export const API_REGISTER_USER_URL: string = `${BACKEND_USER_URL}/register`;
export const API_PASSWORD_RESET_URL: string = `${BACKEND_USER_URL}/password-reset`;

// API shop based
export const API_PRODUCT_URL: string = `${BACKEND_SHOP_URL}/product`;
export const API_CATEGORY_URL: string = `${BACKEND_SHOP_URL}/category`;
export const API_ALL_CATEGORIES: string = `${BACKEND_SHOP_URL}/categories`;
export const API_SEARCH_URL: string = `${BACKEND_SHOP_URL}/search?string=`;
export const API_SEARCH_ASSOCIATED_CATEGORIES_URL: string = `${BACKEND_SHOP_URL}/search-associated-categories?string=`;
export const API_CART_URL: string = `${BACKEND_SHOP_URL}/cart`;
export const API_ADD_TO_CART_URL: string = `${API_CART_URL}/add`
export const API_UPDATE_CART_URL: string = `${API_CART_URL}/update`
export const API_DELETE_FROM_CART_URL: string = `${API_CART_URL}/delete`

// API home based
export const API_PROJECTS_ALL_URL: string = `${BACKEND_HOME_URL}/projects`;
