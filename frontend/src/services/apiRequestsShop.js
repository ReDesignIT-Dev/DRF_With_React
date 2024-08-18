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
import { getToken } from "utils/cookies";

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

// CART LOGIC BELOW

const getAuthHeaders = () => {
  const token = getToken();
  return {
    ...apiClient.defaults.headers,
    Authorization: `Token ${token}`,
  };
};

const apiRequest = async (method, url, data = null) => {
  try {
    const config = {
      method,
      url,
      headers: getAuthHeaders(),
    };

    if (data) {
      config.data = data;
    }

    const response = await apiClient(config);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const getCart = () => apiRequest('get', API_CART_URL);

export const addToCart = (itemSlug, quantity) => 
  apiRequest('post', `${API_CART_ITEM}/add`, { product_slug: itemSlug, quantity });

export const updateCartItemQuantity = (itemSlug, quantity) => 
  apiRequest('put', `${API_CART_ITEM}/update`, { product_slug: itemSlug, quantity });

export const deleteCartItem = (itemSlug) => 
  apiRequest('delete', `${API_CART_ITEM}/delete`, { product_slug: itemSlug });
