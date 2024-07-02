import Cookies from "js-cookie";

export const getToken = () => {
  return Cookies.get("token");
};

export const removeToken = () => {
  Cookies.remove("token");
};

export const setToken = (token, expire) => {
  const expiryDate = new Date(expire);
  Cookies.set("token", token, { secure: true, sameSite: "Strict", expires: expiryDate });
};
