import apiClient from "services/axiosConfig";
import {
  API_CATEGORY_URL,
  API_ALL_CATEGORIES
} from "config";
import { apiErrorHandler } from "./apiErrorHandler";

// TODO optimize later to query one by one
export async function getAllProductsInCategory(category) {
    try {
      const response = await apiClient.get(`${API_CATEGORY_URL}/${category}`, {
        headers: {
          ...apiClient.defaults.headers,
        },
      });
      return response;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  export async function getAllCategoryNamesAndSlugs() {
    try {
      const response = await apiClient.get(API_ALL_CATEGORIES, {
        headers: {
          ...apiClient.defaults.headers,
        },
      });
      return response;
    } catch (error) {
      apiErrorHandler(error);
    }
  }