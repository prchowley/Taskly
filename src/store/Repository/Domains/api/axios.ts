import { FB_ID_TOKEN } from "@/lib/utils";
import { getAuth } from "firebase/auth";
import axios from 'axios';

const baseUrl = "http://localhost:8888/api";
export const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor for firebase token injection
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(FB_ID_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor for firebase token expiration check
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and this is the first retry
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const newToken = await user.getIdToken(true);
          localStorage.setItem(FB_ID_TOKEN, newToken);

          // Update the Authorization header and retry
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (tokenRefreshError) {
        console.error("Token refresh failed:", tokenRefreshError);
        /// TODO: Need to reset the local cache for idToken and todos
      }
    }

    return Promise.reject(error);
  }
);

