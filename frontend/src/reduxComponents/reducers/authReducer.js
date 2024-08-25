// src/redux/authReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postLogin, logoutUser } from "services/apiRequestsUser"; // Import your API functions
import { getToken, setToken } from "utils/cookies"; // Import cookie functions

// Thunk for handling user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password, recaptcha }, { rejectWithValue }) => {
    try {
      const response = await postLogin(username, password, recaptcha);
      if (response.status === 200) {
        const { token, expiry } = response.data; // Assuming response has token and expiry
        setToken(token, expiry); // Set token in cookies
        return { token, expiry, user: response.data.user }; // Return user info
      }
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : "Network Error");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser(); 
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : "Network Error");
    }
  }
);

const initialState = {
  isLoggedIn: Boolean(getToken()),
  user: null,
  token: getToken() || null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.user; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.token = null;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
