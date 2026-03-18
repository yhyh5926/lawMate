import axiosInstance from "./axiosInstance";

export const answerApi = {
  /** 1. 특정 질문에 대한 답변 목록 조회 */
  getAnswersByQuestionId: (questionId) =>
    axiosInstance.get(`/answer/list`, { params: { questionId } }),

  /** 2. 변호사 답변 등록 */
  writeAnswer: (data) => axiosInstance.post("/answer/write", data),

  /** 3. 변호사 답변 수정 */
  updateAnswer: (data) =>
    axiosInstance.put(`/answer/update/${data.answerId}`, data),

  /** 4. 변호사 답변 삭제 */
  deleteAnswer: (answerId) =>
    axiosInstance.delete(`/answer/delete/${answerId}`),

  /** 5. 변호사 답변 채택 (핵심 로직) */
  adoptAnswer: (data) => axiosInstance.post("/answer/adopt", data),
};
