import axiosInstance from '../api/axiosInstance';
import { endpoints } from '../api/endpoints';

export const mailService = {
  status: async () => {
    const { data } = await axiosInstance.get(endpoints.mailStatus);
    return data.data;
  },
  history: async () => {
    const { data } = await axiosInstance.get(endpoints.mailHistory);
    return data.data;
  },
  send: async (payload) => {
    const { data } = await axiosInstance.post(endpoints.mailSend, payload);
    return data;
  },
  resend: async (id) => {
    const { data } = await axiosInstance.post(endpoints.mailResend(id));
    return data;
  },
};
