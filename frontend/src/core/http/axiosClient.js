import axios from "axios";
import { setupCache } from "axios-cache-interceptor";
import { readStoredUser, clearStoredUser } from "../auth/authStorage.js";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5000/api";

const baseAxios = axios.create({
  baseURL: API_BASE_URL,
});

const axiosClient = setupCache(baseAxios, {
  ttl: 1000 * 60 * 5, // 5 minutes
});

axiosClient.interceptors.request.use(
  (config) => {
    // Disable cache for admin and auth routes
    if (config.url && (config.url.includes('/admin') || config.url.includes('/auth'))) {
      config.cache = false;
    }

    const user = readStoredUser();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredUser();
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
