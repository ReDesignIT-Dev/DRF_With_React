import { RootState } from "reduxComponents/store";

export const selectTreeCategories = (state: RootState) => state.categoriesTree.categories;

export const selectFlatCategories = (state: RootState) => state.categoriesFlat.categories;

export const selectIsTreeLoading = (state: RootState) => state.categoriesTree.isLoading;

export const selectIsFlatLoading = (state: RootState) => state.categoriesFlat.isLoading;

export const selectTreeCategoriesError = (state: RootState) => state.categoriesTree.error;

export const selectFlatCategoriesError = (state: RootState) => state.categoriesFlat.error;

export const selectTreeCategoryBySlug = (state: RootState, slug: string) =>
  state.categoriesTree.categories.find((cat) => cat.slug === slug);

export const selectFlatCategoryBySlug = (state: RootState, slug: string) =>
  state.categoriesFlat.categories.find((cat) => cat.slug === slug);
