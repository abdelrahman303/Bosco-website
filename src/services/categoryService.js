import axiosInstance from '../api/axiosInstance';
import { endpoints } from '../api/endpoints';

export const categoryService = {
  list: async () => {
    const { data } = await axiosInstance.get(endpoints.categories);
    return data.data;
  },
  get: async (slug) => {
    const { data } = await axiosInstance.get(endpoints.category(slug));
    return data.data;
  },
  create: async (payload) => {
    const { data } = await axiosInstance.post(endpoints.categories, payload);
    return data.data;
  },
  update: async (id, payload) => {
    const { data } = await axiosInstance.put(endpoints.category(id), payload);
    return data.data;
  },
  remove: async (id) => {
    await axiosInstance.delete(endpoints.category(id));
  },
};
