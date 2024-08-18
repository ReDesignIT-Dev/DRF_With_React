import { GeneralApiError, MultipleFieldErrors } from "./CustomErrors";

export function apiErrorHandler(error) {
    if (error.response) {
      const errors = [];
  
      if (error.response.data.username) {
        errors.push({ field: "username", message: error.response.data.username.join(", ") });
      }
      if (error.response.data.email) {
        errors.push({ field: "email", message: error.response.data.email.join(", ") });
      }
      if (error.response.data.detail) {
        errors.push({ field: "detail", message: error.response.data.detail });
      }
  
      if (errors.length > 0) {
        throw new MultipleFieldErrors(errors);
      }
  
      throw new GeneralApiError(`API Error: ${error.response.statusText}`);
    } else if (error.request) {
      console.error("My hanlder Network Error:", error.request);
      throw new GeneralApiError("Network Error: Please check your internet connection.");
    } else {
      console.error("My hanlder Error:", error.message);
      throw new GeneralApiError(`Error: ${error.message}`);
    }
  }