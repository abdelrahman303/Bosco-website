import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY } from './config';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
