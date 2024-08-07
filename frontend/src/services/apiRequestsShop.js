import apiClient from "services/axiosConfig";
import {
  API_CATEGORY_URL,
  API_ALL_CATEGORIES,
} from "config";
import { apiErrorHandler } from "./apiErrorHandler";
import { API_PRODUCT_URL } from "config";
import { API_SEARCH_URL } from "config";

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
  
  export async function getProduct(productSlug) {
    try {
      const response = await apiClient.get(`${API_PRODUCT_URL}/${productSlug}`, {
        headers: {
          ...apiClient.defaults.headers,
        },
      });
      return response;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  export async function getProductParentCategory(productSlug) {
    try {
      const response = await apiClient.get(`${API_PRODUCT_URL}/${productSlug}/parent-category`, {
        headers: {
          ...apiClient.defaults.headers,
        },
      });
      return response;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  export async function getAllSearchAssociatedCategories(searchString) {
    try {
      const response = await apiClient.get(`${API_SEARCH_URL}?string=${searchString}`, {
        headers: {
          ...apiClient.defaults.headers,
        },
      });
      return response;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  export async function getAllSearchProducts(searchString) {
    try {
      const response = await apiClient.get(`${API_SEARCH_URL}?string=${searchString}`, {
        headers: {
          ...apiClient.defaults.headers,
        },
      });
      return response;
    } catch (error) {
      apiErrorHandler(error);
    }
  }