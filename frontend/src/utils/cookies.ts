import Cookies from "js-cookie";

export const getToken = (): string | null => {
  const token = Cookies.get("token");
  if (token) {
    const expirationDate = getExpiryDateOfToken();
    const currentDate = new Date();
    if (expirationDate && currentDate > expirationDate) {
      removeToken();
      return null;
    }
    return token;
  }
  return null;
};

export const getExpiryDateOfToken = (): Date | undefined => {
  const token = Cookies.get("token");
  if (token) {
    try {
      const cookie = JSON.parse(token) as { expires?: string };
      if (cookie && cookie.expires) {
        return new Date(cookie.expires);
      }
    } catch (e) {
      console.error("Failed to parse token cookie:", e);
    }
  }
  return undefined;
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

  Cookies.set('token', JSON.stringify({ token, expires: expiryDate.toISOString() }), { expires: expiryDate });
};