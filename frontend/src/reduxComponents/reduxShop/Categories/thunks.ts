import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCategories, getCategoriesTree } from "services/shopServices/apiRequestsShop";

export const fetchCategoryTree = createAsyncThunk(
    "categories/fetchCategoryTree",
    async () => {
      const response = await getCategoriesTree();
      if (response && response.data) {
        return response.data as CategoryNode[];
      } else {
        throw new Error("Failed to fetch categories");
      }
    },
    {
      condition: (_, { getState }) => {
        const state = getState() as { categoriesTree: CategoryTreeStore };
        return !state.categoriesTree.isLoading;
      }
      
    }
  );

  
  export const fetchCategoryFlat = createAsyncThunk(
    "categories/fetchCategoryFlat",
    async () => {
      const response = await getAllCategories();
      if (response && response.data) {
        return response.data as Category[];
      } else {
        throw new Error("Failed to fetch categories");
      }
    },
    {
      condition: (_, { getState }) => {
        const state = getState() as { categories: CategoryStore };
        return !state.categories.isLoading;
      }
      
    }
  );