import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postLogin, logoutUser } from "services/apiRequestsUser"; // Import your API functions
import { getToken, setToken } from "utils/cookies"; // Import cookie functions

interface AuthState {
  isLoggedIn: boolean;
  user: string | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface LoginResponse {
  token: string;
  expiry: string;
  user: string;
}

export const loginUser = createAsyncThunk<LoginResponse, { username: string; password: string; recaptcha: string }>(
  "auth/loginUser",
  async ({ username, password, recaptcha }, { rejectWithValue }) => {
    try {
      const response = await postLogin({ username, password, recaptcha });
      if (response && response.status === 200) {
        const { token, expiry, user } = response.data as LoginResponse;
        setToken(token, expiry); 
        return { token, expiry, user };
      } else {
        return rejectWithValue("Unexpected response status");
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Error Response:", error.response);
        return rejectWithValue(error.response.data || "Server Error");
      } else if (error.request) {
        // Request was made but no response was received
        console.error("No Response Received:", error.request);
        return rejectWithValue("No response from server");
      } else {
        // Other errors (setting up request, etc.)
        console.error("Error during request setup:", error.message);
        return rejectWithValue("Request setup error");
      }
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser(); 
    } catch (error: any) {
      return rejectWithValue(error.response ? error.response.data : "Network Error");
    }
  }
);

const initialState: AuthState = {
  isLoggedIn: Boolean(getToken()),
  user: null,
  token: getToken() || null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
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
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
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
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;