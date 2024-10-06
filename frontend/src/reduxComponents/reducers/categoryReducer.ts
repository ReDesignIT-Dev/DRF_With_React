import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAllCategoryNamesAndSlugs } from "services/shopServices/apiRequestsShop";

interface Category {
  name: string;
  slug: string;
  children?: Category[];
}

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: boolean;
}

const initialState: CategoryState = { categories: [], isLoading: false, error: false };

export const fetchCategories = createAsyncThunk(
  "fetchCategories",
  async () => {
    const response = await getAllCategoryNamesAndSlugs();
    if (response && response.data) {
      return response.data as Category[];
    } else {
      throw new Error("Failed to fetch categories");
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as CategoryState;
      if (state.isLoading) {
        return false;
      }
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
      state.isLoading = false;
      state.categories = action.payload;
    });
    builder.addCase(fetchCategories.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
    });
  },
});

export default categorySlice.reducer;