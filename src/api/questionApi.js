import axiosInstance from "./axiosInstance";

export const questionApi = {
  /**
   * 1. 전체 질문 목록 조회 (검색, 카테고리 필터, 페이지네이션)
   * @param {Object} params - { caseType, title, page, size }
   * page: 1부터 시작 (백엔드 설정에 따라 0일 수 있음)
   * size: 한 페이지당 보여줄 게시글 수
   */
  getQuestionList: (params) =>
    axiosInstance.get("/question/list", {
      params: {
        page: params.page || 1,
        size: params.size || 10,
        caseType: params.caseType || undefined,
        title: params.title || undefined,
      },
    }),

  /**
   * 2. 특정 질문 상세 내용 및 변호사 답변 조회
   * @param {number|string} questionId
   */
  getQuestionDetail: (questionId) =>
    axiosInstance.get("/question/detail", { params: { questionId } }),

  /**
   * 3. 새로운 법률 질문 작성 (TB_QUESTION)
   * @param {Object} data - { memberId, title, content, caseType }
   */
  writeQuestion: (data) => axiosInstance.post("/question/write", data),

  /**
   * 4. 변호사 답변 등록 (TB_ANSWER)
   * @param {Object} data - { questionId, lawyerId, content }
   */
  writeAnswer: (data) => axiosInstance.post("/question/answer/write", data),

  /**
   * 5. 변호사 답변 채택
   * @param {Object} data - { questionId, lawyerId, memberId, answerId }
   */
  adoptAnswer: (data) => axiosInstance.post("/question/adopt", data),
};
