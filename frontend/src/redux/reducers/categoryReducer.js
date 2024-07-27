import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCategoryNamesAndSlugs } from "services/apiRequestsShop";

export const fetchCategories = createAsyncThunk("fetchCategories", async () => {
  const response = await getAllCategoryNamesAndSlugs();
  return response.data;
},
{
  condition: (_, {getState}) => {
    const state = getState();
    if (state.fulfilled || state.isLoading){
      return false;
    }
  }
}
);

const initialState = { categories: [], isLoading: false, error: false };

const categorySlice = createSlice({
  name: "categories",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
    });
    builder.addCase(fetchCategories.rejected, (state) => {
      state.error = true;
    });
  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
