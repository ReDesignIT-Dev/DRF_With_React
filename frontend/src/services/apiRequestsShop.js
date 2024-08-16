import apiClient from "services/axiosConfig";
import { apiErrorHandler } from "./apiErrorHandler";
import {
  API_PRODUCT_URL,
  API_SEARCH_ASSOCIATED_CATEGORIES_URL,
  API_SEARCH_URL,
  API_CATEGORY_URL,
  API_ALL_CATEGORIES,
  API_CART_URL,
  API_CART_ITEM,
} from "config";

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
    const response = await apiClient.get(
      `${API_SEARCH_ASSOCIATED_CATEGORIES_URL}?string=${searchString}`,
      {
        headers: {
          ...apiClient.defaults.headers,
        },
      }
    );
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

export async function getCart() {
  try {
    const response = await apiClient.get(API_CART_URL, {
      headers: {
        ...apiClient.defaults.headers,
      },
    });
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function updateCartQuantity(itemId, quantity) {
  try {
    const response = await apiClient.put(`${API_CART_ITEM}/${itemId}`, {
      quantity,
      headers: {
        ...apiClient.defaults.headers,
      },
    });
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}