import apiClient from "services/axiosConfig";
import {
  API_PASSWORD_RESET_URL,
  API_ACTIVATE_USER_URL,
  API_REGISTER_USER_URL,
  API_LOGIN_USER_URL,
  API_LOGOUT_USER_URL,
} from "config";
import { getToken, removeToken, setToken } from "utils/cookies";
import { apiErrorHandler } from "./apiErrorHandler";
import { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

interface LoginData {
  username: string;
  password: string;
  recaptcha: string;
}

interface RegisterData { 
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  recaptcha: string;
}

interface PasswordResetData {
  password: string;
  password_confirm: string;
  recaptcha: string;
}

interface PasswordRecoveryData {
  email: string;
  recaptcha: string;
}

interface AuthTokenResponse {
  token: string;
  expiry: string;
}

type ApiResponse<T = any> = AxiosResponse<T>;

const getHeaders = (additionalHeaders?: Record<string, string>): Record<string, string> => {
  return {
    ...apiClient.defaults.headers as Record<string, string>,
    ...additionalHeaders
  };
};

function handleApiError(error: unknown): void {
  if (error instanceof AxiosError) {
    apiErrorHandler(error);
  } else {
    console.error("An unexpected error occurred:", error);
    throw new Error("An unexpected error occurred");
  }
}

export async function postData(endpoint: string, data: Record<string, any>): Promise<ApiResponse | undefined> {
  try {
    const response = await apiClient.post(endpoint, data, {
      headers: getHeaders()
    });
    return response;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function postLogin({ username, password, recaptcha }: LoginData): Promise<ApiResponse<AuthTokenResponse> | undefined> {
  try {
    const authString = `${username}:${password}`;
    const encodedAuthString = btoa(authString);

    const response = await apiClient.post<AuthTokenResponse>(
      API_LOGIN_USER_URL,
      { recaptcha },
      {
        headers: getHeaders({
          Authorization: `Basic ${encodedAuthString}`
        })
      }
    );

    if (response.status === 200) {
      const { token, expiry } = response.data;
      const expire = new Date(expiry);
      setToken(token, expire);
    }
    return response;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function registerUser({ username, email, password, password_confirm, recaptcha }: RegisterData): Promise<ApiResponse | undefined> {
  try {
    const response = await apiClient.post(
      API_REGISTER_USER_URL,
      {
        username,
        email,
        password,
        password_confirm,
        recaptcha,
      },
      {
        headers: getHeaders()
      }
    );
    return response;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function getData(endpoint: string): Promise<ApiResponse | undefined> {
  try {
    const response = await apiClient.get(endpoint);
    return response;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function getDataUsingUserToken(endpoint: string, token: string): Promise<ApiResponse | undefined> {
  try {
    const response = await apiClient.get(endpoint, {
      headers: getHeaders({
        Authorization: `Token ${token}`
      })
    });
    return response;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function activateUser(token: string): Promise<ApiResponse | undefined> {
  try {
    const response = await apiClient.post(`${API_ACTIVATE_USER_URL}/${token}/`, {}, {
      headers: getHeaders()
    });
    return response;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function validatePasswordResetToken(token: string): Promise<ApiResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_PASSWORD_RESET_URL}/${token}/`, {
      headers: getHeaders()
    });
    return response;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function postPasswordReset(token: string, { password, password_confirm, recaptcha }: PasswordResetData): Promise<ApiResponse | undefined> {
  try {
    const response = await apiClient.post(
      `${API_PASSWORD_RESET_URL}/${token}/`,
      {
        password,
        password_confirm,
        recaptcha,
      },
      {
        headers: getHeaders()
      }
    );
    return response;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function postPasswordRecovery({ email, recaptcha }: PasswordRecoveryData): Promise<ApiResponse | undefined> {
  try {
    const response = await apiClient.post(
      API_PASSWORD_RESET_URL,
      {
        email,
        recaptcha,
      },
      {
        headers: getHeaders()
      }
    );
    return response;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function logoutUser(): Promise<void> {
  const token = getToken();
  try {
    if (token) {
      await apiClient.post(
        API_LOGOUT_USER_URL,
        {},
        {
          headers: getHeaders({
            Authorization: `Token ${token}`
          })
        }
      );
      
      console.log("Logged out successfully");
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response && error.response.status === 401) {
      console.log("Unauthorized: Already logged out or token invalid.");
      return;
    }
    handleApiError(error);
  } finally {
    removeToken();
  }
}
