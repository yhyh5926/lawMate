import axiosInstance from './axiosInstance';

export const getPostList = async (sortType = "latest") => {
  const response = await axiosInstance.get("/posts", {
    params: { sortType }
  });

  return response.data;
};

export const getPost = async (postId) => {
  const response = await axiosInstance.get(`/detail/${postId}`);
  return response.data; // 받은 객체에서 json만 꺼내온 것
};

export const getPostWithoutView = async (postId) => {
  const response = await axiosInstance.get(`/detail/viewless/${postId}`);
  return response.data; // 좋아요 누른 후 새로고침 조회수 안들어가게
};

export const writePost = async (payload) => {
  const response = await axiosInstance.post("/write", payload);
  return response.data;
};

export const updatePost = async (payload) => {
  const response = await axiosInstance.put("/edit", payload);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await axiosInstance.delete(`/posts/${postId}`);
  return response.data;
};

// 좋아요
export const getTopLikedPosts = async () => {
  const response = await axiosInstance.get("/posts/topLiked");
  return response.data;
};

export const togglePostLike = async (postId, memberId) => {
  const response = await axiosInstance.post(`/posts/${postId}/like`, {
    memberId
  });
  return response.data;
};

export const getPostLikeStatus = async (postId, memberId) => {
  const response = await axiosInstance.get(`/posts/${postId}/like/${memberId}`);
  return response.data;
};

// 댓글
export const getComments = async (postId) => {
  const response = await axiosInstance.get(`/comment/list/${postId}`);
  return response.data; // 받은 객체에서 json만 꺼내온 것
};

// 투표게시물
export const getPollList = async () => {
  const response = await axiosInstance.get("/polls");
  return response.data; // 받은 객체에서 json만 꺼내온 것
};

export const getPollDetail = async (pollId) => {
  const response = await axiosInstance.get(`/poll/${pollId}`);
  return response.data;
};

export const getPollOptions = async (pollId) => {
  const response = await axiosInstance.get(`/poll/${pollId}/options`);
  return response.data;
};

export const votePoll = async (voteData) => {
  const response = await axiosInstance.post(`/poll/vote`, voteData);
  return response.data;
};

export const checkVoted = async (pollId, memberId) => {
  const res = await axiosInstance.get(`/poll/${pollId}/check/${memberId}`);
  return res.data;
};

