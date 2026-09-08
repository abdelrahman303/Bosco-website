import axiosInstance from '../api/axiosInstance';
import { endpoints } from '../api/endpoints';

export const productService = {
  list: async (params = {}) => {
    const { data } = await axiosInstance.get(endpoints.products, { params });
    return data.data;
  },
  get: async (slug) => {
    const { data } = await axiosInstance.get(endpoints.product(slug));
    return data;
  },
  create: async (payload) => {
    const { data } = await axiosInstance.post(endpoints.products, payload);
    return data.data;
  },
  update: async (id, payload) => {
    const { data } = await axiosInstance.put(endpoints.product(id), payload);
    return data.data;
  },
  remove: async (id) => {
    await axiosInstance.delete(endpoints.product(id));
  },
  upload: async (file) => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await axiosInstance.post(endpoints.upload, form);
    return data.url;
  },
};
