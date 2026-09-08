import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY } from './config';
import { STATIC_API, staticApiAdapter } from './staticAdapter';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  adapter: STATIC_API ? staticApiAdapter : undefined,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (STATIC_API && config.data && typeof config.data === 'string') {
    try {
      config.data = JSON.parse(config.data);
    } catch {
      /* keep raw body */
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Request failed.';
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
