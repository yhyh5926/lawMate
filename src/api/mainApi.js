// src/api/mainApi.js
import axiosInstance from "./axiosInstance.js";

export const mainApi = {
  async getMainData() {
    const res = await axiosInstance.get("/main");
    return res.data;
  },

  async getNoticeDetail(id) {
    const res = await axiosInstance.get(`/notices/${id}`);
    return res.data;
  },
};