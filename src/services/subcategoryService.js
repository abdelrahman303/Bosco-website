import axiosInstance from '../api/axiosInstance';
import { endpoints } from '../api/endpoints';

export const subcategoryService = {
  list: async (categoryId) => {
    const { data } = await axiosInstance.get(endpoints.subcategories, {
      params: categoryId ? { categoryId } : undefined,
    });
    return data.data;
  },
  get: async (slug) => {
    const { data } = await axiosInstance.get(endpoints.subcategory(slug));
    return data.data;
  },
  create: async (payload) => {
    const { data } = await axiosInstance.post(endpoints.subcategories, payload);
    return data.data;
  },
  update: async (id, payload) => {
    const { data } = await axiosInstance.put(endpoints.subcategory(id), payload);
    return data.data;
  },
  remove: async (id) => {
    await axiosInstance.delete(endpoints.subcategory(id));
  },
};
