import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores/authStore";

const API_URL = import.meta.env.VITE_API_URL || "";

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && originalRequest) {
      // Try to refresh token
      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_URL}/api/v1/auth/refresh`,
            {},
            {
              params: { refresh_token: refreshToken },
            }
          );

          const { access_token, refresh_token } = response.data;

          // Update tokens in store
          useAuthStore.setState({
            token: access_token,
            refreshToken: refresh_token,
          });

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch {
          // Refresh failed, logout user
          useAuthStore.getState().logout();
        }
      } else {
        // No refresh token, logout user
        useAuthStore.getState().logout();
      }
    }

    // Extract error message
    const message =
      (error.response?.data as { detail?: string })?.detail ||
      error.message ||
      "An error occurred";

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
