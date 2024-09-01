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
import { AxiosResponse, AxiosHeaders, AxiosRequestConfig } from "axios";


interface CategoryResponse {
  categories: any[]; 
}

export async function validateIfCategoryExists(categorySlug: string): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_CATEGORY_URL}/${categorySlug}/validate`, {
      headers: new AxiosHeaders({
        ...apiClient.defaults.headers,
      }) as AxiosHeaders,
    });
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getAllProductsInCategory(categorySlug: string): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_CATEGORY_URL}/${categorySlug}/products`, {
      headers: new AxiosHeaders({
        ...apiClient.defaults.headers,
      }) as AxiosHeaders,
    });
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getAllCategoryNamesAndSlugs(): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(API_ALL_CATEGORIES, {
      headers: new AxiosHeaders({
        ...apiClient.defaults.headers,
      }) as AxiosHeaders,
    });
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getAllChildrenOfCategory(categorySlug: string): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_CATEGORY_URL}/${categorySlug}/children`, {
      headers: new AxiosHeaders({
        ...apiClient.defaults.headers,
      }) as AxiosHeaders,
    });
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getAllParentsOfCategory(categorySlug: string): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_CATEGORY_URL}/${categorySlug}/parents`, {
      headers: new AxiosHeaders({
        ...apiClient.defaults.headers,
      }) as AxiosHeaders,
    });
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getProduct(productSlug: string): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_PRODUCT_URL}/${productSlug}`, {
      headers: new AxiosHeaders({
        ...apiClient.defaults.headers,
      }) as AxiosHeaders,
    });
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getProductParentCategory(productSlug: string): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_PRODUCT_URL}/${productSlug}/parent-category`, {
      headers: new AxiosHeaders({
        ...apiClient.defaults.headers,
      }) as AxiosHeaders,
    });
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getAllSearchAssociatedCategories(searchString: string): Promise<AxiosResponse<CategoryResponse> | undefined> {
  try {
    const response = await apiClient.get(
      `${API_SEARCH_ASSOCIATED_CATEGORIES_URL}?string=${searchString}`,
      {
        headers: new AxiosHeaders({
          ...apiClient.defaults.headers,
        }) as AxiosHeaders,
      }
    );
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getAllSearchProducts(searchString: string): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_SEARCH_URL}?string=${searchString}`, {
      headers: new AxiosHeaders({
        ...apiClient.defaults.headers,
      }) as AxiosHeaders,
    });
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

// CART LOGIC BELOW

type Headers = Record<string, string | undefined>;

const getAuthHeaders = (): Headers => {
  const token = getToken();
  const headers: Headers = {
    Authorization: token ? `Token ${token}` : undefined,
    'Content-Type': apiClient.defaults.headers['Content-Type'] as string | undefined,
    Accept: apiClient.defaults.headers['Accept'] as string | undefined,
  };

  return headers;
};

interface ApiRequestConfig extends AxiosRequestConfig {
  data?: Record<string, unknown>; 
}


const apiRequest = async (
  method: string,
  url: string,
  data?: Record<string, unknown>
): Promise<AxiosResponse | undefined> => {
  try {
    const config: ApiRequestConfig = {
      method,
      url,
      headers: getAuthHeaders(), 
      ...(data ? { data } : {}) 
    };

    const response = await apiClient(config);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const getCart = (): Promise<AxiosResponse | undefined> => apiRequest('get', API_CART_URL);

export const addToCart = (itemSlug: string, quantity: number): Promise<AxiosResponse | undefined> => 
  apiRequest('post', `${API_CART_ITEM}/add`, { product_slug: itemSlug, quantity });

export const updateCartItemQuantity = (itemSlug: string, quantity: number): Promise<AxiosResponse | undefined> => 
  apiRequest('put', `${API_CART_ITEM}/update`, { product_slug: itemSlug, quantity });

export const deleteCartItem = (itemSlug: string): Promise<AxiosResponse | undefined> => 
  apiRequest('delete', `${API_CART_ITEM}/delete`, { product_slug: itemSlug });
