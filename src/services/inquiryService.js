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
  get: async (id) => {
    const { data } = await axiosInstance.get(endpoints.inquiry(id));
    return data.data;
  },
  updateStatus: async (id, status) => {
    const { data } = await axiosInstance.patch(endpoints.inquiryStatus(id), { status });
    return data.data;
  },
  stats: async () => {
    const { data } = await axiosInstance.get(endpoints.stats);
    return data.data;
  },
};
