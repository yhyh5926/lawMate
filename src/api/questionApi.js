import axiosInstance from "./axiosInstance";

export const questionApi = {
  // 1. 전체 질문 목록 조회
  getQuestionList: (params) => axiosInstance.get("/question/list", { params }),

  // 2. 특정 질문 상세 내용 및 변호사 답변 조회
  getQuestionDetail: (questionId) =>
    axiosInstance.get(`/question/detail?questionId=${questionId}`),

  // 3. 새로운 법률 질문 작성 (TB_QUESTION)
  writeQuestion: (data) => axiosInstance.post("/question/write", data),

  // 4. 변호사 답변 등록 (TB_ANSWER)
  writeAnswer: (data) => axiosInstance.post("/question/answer/write", data),

  /**
   * 5. 변호사 답변 채택 (TB_QUESTION 상태 변경 + TB_ANSWER 채택 처리)
   * @param {Object} data - { questionId, lawyerId, memberId, answerId }
   */
  adoptAnswer: (data) => axiosInstance.post("/question/adopt", data),

  // 6. 질문 삭제 (필요 시)
  deleteQuestion: (questionId) =>
    axiosInstance.post(`/question/delete`, { questionId }),
};
