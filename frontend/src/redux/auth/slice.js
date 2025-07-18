import { createSlice } from "@reduxjs/toolkit";
import { register, logIn, logOut, refresh } from "./operations.js";

const initialState = {
  user: {
    name: null,
    email: null,
    avatarUrl: null,
  },
  token: null,
  isLoggedIn: false,
  error: null,
  isLoading: false,
  isRefreshing: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = {
        name: action.payload.user?.name || null,
        email: action.payload.user?.email || null,
      };
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    clearAuthError(state) {
      state.error = null;
    },
    logout() {
      return initialState;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user || { name: null, email: null };
        state.token = action.payload.token || null;
        state.isLoggedIn = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.error =
          action.payload || action.error?.message || "Something went wrong";
        state.isLoading = false;
      })
      .addCase(logIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.user = action.payload.user || { name: null, email: null };
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.error = action.payload || action.error?.message;
        state.isLoading = false;
      })
      .addCase(logOut.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logOut.fulfilled, () => {
        return initialState;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.error = action.payload || action.error?.message;
        state.isLoading = false;
      })
      .addCase(refresh.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(refresh.rejected, (state, action) => {
        state.error = action.payload || action.error?.message;
        state.isRefreshing = false;
      }),
});

export const { setCredentials, clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
