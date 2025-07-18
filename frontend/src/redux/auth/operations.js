import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../index.js"

export const register = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post("/api/auth/register", credentials, {
        headers: {
        'Content-Type': 'multipart/form-data',
      },
      });
      const { name, email, accessToken, avatarUrl } = response.data.data;



      return {
        user: { name, email, avatarUrl },
        token: accessToken,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Unknown error";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logIn = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post("/api/auth/login", credentials);
      const { name, email, avatarUrl, accessToken } = response.data.data;


      return {
        user: { name, email, avatarUrl },
        token: accessToken,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Unknown error";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await api.post("/api/auth/logout");

  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Unknown error";
    return thunkAPI.rejectWithValue(message);
  }
});

export const refresh = createAsyncThunk("auth/refresh", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No token found");

    const response = await api.get("/api/auth/refresh", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { accessToken } = response.data.data;
    localStorage.setItem("accessToken", accessToken);

    return { token: accessToken };
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Refresh failed";
    return thunkAPI.rejectWithValue(message);
  }
});
