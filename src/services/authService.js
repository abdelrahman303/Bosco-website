import axiosInstance from '../api/axiosInstance';
import { endpoints } from '../api/endpoints';

export const authService = {
  login: async (email, password) => {
    const { data } = await axiosInstance.post(endpoints.login, { email, password });
    return data;
  },
  me: async () => {
    const { data } = await axiosInstance.get(endpoints.me);
    return data.admin;
  },
};
