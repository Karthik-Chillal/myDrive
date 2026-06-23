import axios from 'axios';
import { useAuthStore } from '../../zustand/store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('login') &&
      !originalRequest.url?.includes('register') &&
      !originalRequest.url?.includes('refresh')
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.accessToken;
        
        useAuthStore.getState().setToken(newAccessToken);
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearToken();
        localStorage.removeItem('auth-store');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Fallback: if it's 401 and it's already a retry or refresh failed previously
    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes('login') &&
      !originalRequest.url?.includes('register') &&
      !originalRequest.url?.includes('refresh')
    ) {
      useAuthStore.getState().clearToken();
      localStorage.removeItem('auth-store');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
