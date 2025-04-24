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

export const isUserAdmin = (): boolean => {
  return Cookies.get("isAdmin") === "true";
};

export const setIsUserAdmin = (isUserAdmin: boolean): void => {
  Cookies.set("isAdmin", isUserAdmin.toString());
};

export const removeUserData = (): void => {
  Cookies.remove('isAdmin');
}
