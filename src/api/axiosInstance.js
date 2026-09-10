import axios from 'axios';
import { API_BASE_URL, REFRESH_TOKEN_KEY, TOKEN_KEY } from './config';
import { STATIC_API, staticApiAdapter } from './staticAdapter';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  adapter: STATIC_API ? staticApiAdapter : undefined,
});

let refreshPromise = null;

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new Error('Missing refresh token');
  }

  const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
  const accessToken = data.accessToken || data.token;
  if (!accessToken || !data.refreshToken) {
    throw new Error('Invalid refresh response');
  }

  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  return accessToken;
}

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
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = String(original?.url || '');
    const isAuthRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/logout');

    if (status === 401 && original && !original._retry && !isAuthRoute && !STATIC_API) {
      original._retry = true;
      try {
        refreshPromise = refreshPromise || refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const accessToken = await refreshPromise;
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(original);
      } catch {
        clearSession();
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/admin/login')) {
          window.location.assign('/admin/login');
        }
      }
    }

    const message = error.response?.data?.message || error.message || 'Request failed.';
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
