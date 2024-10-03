import Cookies from "js-cookie";

export const getToken = (): string | null => {
  const token = Cookies.get("token");
  if (token) {
    return token;
  }
  return null;
};


export const removeToken = (): void => {
  Cookies.remove("token");
};

export const setToken = (token: string, expiry: string | Date): void => {
  const expiryDate = new Date(expiry);
  if (isNaN(expiryDate.getTime())) {
    console.error("Invalid expiry date:", expiry);
    throw new Error("Invalid expiry date format");
  }

  try {
    Cookies.set('token', token, { expires: expiryDate });
  } catch (error) {
    console.error("Failed to set token cookie:", error);
  }
};