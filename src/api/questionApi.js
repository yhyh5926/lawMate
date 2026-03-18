import axiosInstance from "./axiosInstance";

export const questionApi = {
  /** 1. 전체 질문 목록 조회 */
  getQuestionList: (params) =>
    axiosInstance.get("/question/list", {
      params: {
        page: params.page || 1,
        size: params.size || 10,
        caseType: params.caseType || undefined,
        title: params.title || undefined,
      },
    }),

  /** 2. 특정 질문 상세 내용 조회 */
  getQuestionDetail: (questionId) =>
    axiosInstance.get("/question/detail", { params: { questionId } }),

  /** 3. 새로운 법률 질문 작성 */
  writeQuestion: (formData) =>
    axiosInstance.post("/question/write", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  /** 4. 법률 질문 수정 */
  updateQuestion: (formData) => {
    const questionId = formData.get("questionId");
    return axiosInstance.put(`/question/update/${questionId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /** 5. 법률 질문 삭제 */
  deleteQuestion: (questionId) =>
    axiosInstance.delete(`/question/delete/${questionId}`),
};
