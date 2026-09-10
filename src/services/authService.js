import axiosInstance from '../api/axiosInstance';
import { endpoints } from '../api/endpoints';

export const authService = {
  login: async (email, password) => {
    const { data } = await axiosInstance.post(endpoints.login, { email, password });
    return data;
  },
  refresh: async (refreshToken) => {
    const { data } = await axiosInstance.post(endpoints.refresh, { refreshToken });
    return data;
  },
  logout: async (refreshToken) => {
    try {
      await axiosInstance.post(endpoints.logout, { refreshToken });
    } catch {
      /* ignore network/logout errors */
    }
  },
  me: async () => {
    const { data } = await axiosInstance.get(endpoints.me);
    return data.admin;
  },
};
