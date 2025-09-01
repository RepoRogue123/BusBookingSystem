import axios from "axios";

export const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Global response interceptor to surface Forbidden actions to the user
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error.message;
    if (status === 403) {
      // Lightweight alert for forbidden content access
      try {
        // Prefer Ant Design message if available
        const { message: antdMessage } = require("antd");
        antdMessage.error("Forbidden: You are not allowed to perform this action.");
      } catch (_) {
        // Fallback to browser alert without blocking build in SSR
        if (typeof window !== 'undefined') {
          window.alert("Forbidden: You are not allowed to perform this action.");
        }
      }
    }
    if (status === 401) {
      // Optional: sign the user out on auth failure
      // localStorage.removeItem('token');
      // localStorage.removeItem('user_id');
    }
    return Promise.reject(error);
  }
);
