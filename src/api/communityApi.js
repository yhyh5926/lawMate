import axiosInstance from './axiosInstance';

export const getPostList = async () => {
  const response = await axiosInstance.get("/posts");
  return response.data; // 받은 객체에서 json만 꺼내온 것
};

export const getPost = async (postId) => {
  const response = await axiosInstance.get(`/detail/${postId}`);
  return response.data; // 받은 객체에서 json만 꺼내온 것
};

export const getComments = async (postId) => {
  const response = await axiosInstance.get(`/comment/list/${postId}`);
  return response.data; // 받은 객체에서 json만 꺼내온 것
};