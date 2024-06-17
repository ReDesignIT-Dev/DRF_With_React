import Cookies from "js-cookie";

export const getToken = () => {
  return Cookies.get("token");
};

export const removeToken = () => {
  Cookies.remove("token");
};

export const setToken = (token) => {
  Cookies.set("token", token, { secure: true, sameSite: "Strict", expires: 1 }); // expires in 1 day
};
