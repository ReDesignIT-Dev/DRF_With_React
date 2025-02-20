import apiClient from "services/axiosConfig";
import { apiErrorHandler } from "../apiErrorHandler";
import {
  API_PRODUCT_URL,
  API_SEARCH_ASSOCIATED_CATEGORIES_URL,
  API_SEARCH_URL,
  API_CATEGORY_URL,
  API_ALL_CATEGORIES_TREE,
  API_ALL_CATEGORIES_FLAT,
} from "config";
import { AxiosResponse } from "axios";


export async function getAllProductsInCategory(categoryId: number): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_CATEGORY_URL}/${categoryId}/products`);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getCategoriesTree(): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(API_ALL_CATEGORIES_TREE);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getAllCategories(): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(API_ALL_CATEGORIES_FLAT);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getAllChildrenOfCategory(categoryId: number): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_CATEGORY_URL}/${categoryId}/children`);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getAllParentsOfCategory(categoryId: number): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_CATEGORY_URL}/${categoryId}/parents`);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getProduct(productId: number): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_PRODUCT_URL}/${productId}`);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getCategory(categoryId: number): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_CATEGORY_URL}/${categoryId}`);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getProductParentCategory(productId: number): Promise<AxiosResponse | undefined> {
  try {
    const response = await apiClient.get(`${API_PRODUCT_URL}/${productId}/parent-category`);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getAllSearchAssociatedCategories(searchString: string): Promise<AxiosResponse<CategoryNode[]> | undefined> {
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

