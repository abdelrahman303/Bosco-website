import axiosInstance from '../api/axiosInstance';
import { endpoints } from '../api/endpoints';

export const inquiryService = {
  create: async (payload) => {
    const { data } = await axiosInstance.post(endpoints.inquiries, payload);
    return data;
  },
  list: async () => {
    const { data } = await axiosInstance.get(endpoints.inquiries);
    return data.data;
  },
  stats: async () => {
    const { data } = await axiosInstance.get(endpoints.stats);
    return data.data;
  },
};
