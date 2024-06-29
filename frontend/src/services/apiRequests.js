import apiClient from "services/axiosConfig";
import { PASSWORD_RESET_API_URL } from "config";

export async function postData(endpoint, data) {
  try {
    const response = await apiClient.post(endpoint, data, {
      headers: {
        ...apiClient.defaults.headers,
      },
    });
    return response;
  } catch (error) {
    handleApiError(error);
  }
}

export async function postLogin(username, password, recaptcha) {
  try {
    const authString = `${username}:${password}`;
    const encodedAuthString = btoa(authString);

    const response = await apiClient.post(
      "login/",
      { recaptcha: recaptcha },
      {
        headers: {
          ...apiClient.defaults.headers,
          Authorization: `Basic ${encodedAuthString}`,
        },
      }
    );
    return response;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getData(endpoint) {
  try {
    const response = await apiClient.get(endpoint);
    return response;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getDataUsingUserToken(endpoint, token) {
  try {
    const response = await apiClient.get(endpoint, {
      headers: {
        ...apiClient.defaults.headers,
        Authorization: `Token ${token}`,
      },
    });
    return response;
  } catch (error) {
    handleApiError(error);
  }
}

export async function validatePasswordResetToken(token) {
  try {
    const response = await apiClient.get(`${PASSWORD_RESET_API_URL}${token}/`, {
      headers: {
        ...apiClient.defaults.headers,
        Authorization: `Token ${token}`,
      },
    });
    return response;
  } catch (error) {
    handleApiError(error);
  }
}

export async function postPasswordReset(password, password_confirm, recaptcha) {
  try {
    const response = await apiClient.post(`${PASSWORD_RESET_API_URL}${token}/`, { 
      password, 
      password_confirm,
      recaptcha
    }, {
      headers: {
        ...apiClient.defaults.headers,
      },
    });
    return response;
  } catch (error) {
    handleApiError(error);
  }
}

export async function postPasswordRecovery(email, recaptcha) {
  try {
    const response = await apiClient.post(`${PASSWORD_RESET_API_URL}`, { 
      email, 
      recaptcha
    }, {
      headers: {
        ...apiClient.defaults.headers,
      },
    });
    return response;
  } catch (error) {
    handleApiError(error);
  }
}

export async function logoutUser(token) {
  try {
    const response = await apiClient.post(
      "logout/",
      {},
      {
        headers: {
          ...apiClient.defaults.headers,
          Authorization: `Token ${token}`,
        },
      }
    );
    console.log("Bye");
    return response;
  } catch (error) {
    handleApiError(error);
  }
}

function handleApiError(error) {
  if (error.response) {
    // Server responded with a status other than 200 range
    console.error("API Error:", error.response.data);
    throw new Error(`API Error: ${error.response.statusText}`);
  } else if (error.request) {
    // Request was made but no response was received
    console.error("Network Error:", error.request);
    throw new Error("Network Error: Please check your internet connection.");
  } else {
    // Something else caused the error
    console.error("Error:", error.message);
    throw new Error(`Error: ${error.message}`);
  }
}
