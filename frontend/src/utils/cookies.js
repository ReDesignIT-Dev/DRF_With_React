import Cookies from "js-cookie";

export const getToken = () => {
  const token = Cookies.get("token");
  if (token){
    const expirationDate = getExpiryDateOfToken();
    const currentDate = new Date();
    if (currentDate > expirationDate){
      removeToken();
      return null;
    }
  }
  return token;
};

export const getExpiryDateOfToken = () => {
  return Cookies.get("token").expires;
};

export const removeToken = () => {
  Cookies.remove("token");
};

export const setToken = (token, expire) => {
  
  Cookies.set("token", token, { secure: true, sameSite: "Strict", expires: expire });
};
