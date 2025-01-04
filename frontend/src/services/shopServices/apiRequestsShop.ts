import apiClient from "services/axiosConfig";
import { apiErrorHandler } from "../apiErrorHandler";
import {
  API_PRODUCT_URL,
  API_SEARCH_ASSOCIATED_CATEGORIES_URL,
  API_SEARCH_URL,
  API_CATEGORY_URL,
  API_ALL_CATEGORIES,
  BACKEND_SHOP_URL,
} from "config";
import { AxiosResponse } from "axios";


interface CategoryResponse {
  categories: any[]; 
}

export async function validateIfCategoryExists(categorySlug: string): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_CATEGORY_URL}/${categorySlug}/validate`);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getAllProductsInCategory(categorySlug: string): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_CATEGORY_URL}/${categorySlug}/products`);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getAllCategoryNamesAndSlugs(): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(API_ALL_CATEGORIES);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getAllChildrenOfCategory(categorySlug: string): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_CATEGORY_URL}/${categorySlug}/children`);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getAllParentsOfCategory(categorySlug: string): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_CATEGORY_URL}/${categorySlug}/parents`);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getProduct(productSlug: string): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_PRODUCT_URL}/${productSlug}`);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getProductParentCategory(productSlug: string): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_PRODUCT_URL}/${productSlug}/parent-category`);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getAllSearchAssociatedCategories(searchString: string): Promise<AxiosResponse<CategoryResponse> | undefined> {
  try {
    const response = await apiClient.get(
      `${API_SEARCH_ASSOCIATED_CATEGORIES_URL}${searchString}`
    );
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getAllSearchProducts(searchString: string): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_SEARCH_URL}${searchString}`);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

