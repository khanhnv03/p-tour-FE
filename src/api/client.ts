import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const ACCESS_TOKEN_KEY = 'access_token';
export const API_BASE_URL = API_URL;
export const API_ORIGIN = new URL(API_URL, window.location.origin).origin;

const AUTH_ROUTES = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
]);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));
      localStorage.removeItem(ACCESS_TOKEN_KEY);

      const requestUrl = String(error.config?.url ?? '');
      if (hadToken && !AUTH_ROUTES.has(requestUrl) && window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
