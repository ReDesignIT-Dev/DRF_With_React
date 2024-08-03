import apiClient from "services/axiosConfig";
import {
  API_CATEGORY_URL,
  API_ALL_CATEGORIES,
} from "config";
import { apiErrorHandler } from "./apiErrorHandler";

// TODO optimize later to query one by one
export async function getAllProductsInCategory(categorySlug) {
    try {
      const response = await apiClient.get(`${API_CATEGORY_URL}/${categorySlug}/products`, {
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

  export async function getAllChildrenOfCategory(categorySlug) {
    try {
      const response = await apiClient.get(`${API_CATEGORY_URL}/${categorySlug}/children`, {
        headers: {
          ...apiClient.defaults.headers,
        },
      });
      return response;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  export async function getAllParentsOfCategory(categorySlug) {
    try {
      const response = await apiClient.get(`${API_CATEGORY_URL}/${categorySlug}/parents`, {
        headers: {
          ...apiClient.defaults.headers,
        },
      });
      return response;
    } catch (error) {
      apiErrorHandler(error);
    }
  }