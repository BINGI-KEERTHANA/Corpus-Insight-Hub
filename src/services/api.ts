import axios from "axios";
import { API_BASE_URL } from "../constants/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add the access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ===== API Functions =====

export const getRecords = () => api.get("/api/v1/records/");

export const getLanguages = () => api.get("/api/v1/languages");

export const getCategories = () => api.get("/api/v1/categories/");

export const getUsers = () => api.get("/api/v1/users/");

export const getHealth = () => api.get("/health");

// =========================

export default api;