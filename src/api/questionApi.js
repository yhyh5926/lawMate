import axiosInstance from "./axiosInstance";

export const questionApi = {
  /**
   * 1. 전체 질문 목록 조회 (검색, 카테고리 필터, 페이지네이션)
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
   */
  getQuestionDetail: (questionId) =>
    axiosInstance.get("/question/detail", { params: { questionId } }),

  /**
   * 3. 새로운 법률 질문 작성 (파일 포함 가능)
   * @param {FormData} formData - FormData 객체 (title, content, caseType, files 등 포함)
   */
  writeQuestion: (formData) =>
    axiosInstance.post("/question/write", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  /**
   * 3-1. 법률 질문 수정 (파일 수정 포함 가능)
   * @param {FormData} formData - FormData 객체 (questionId 필수 포함)
   */
  updateQuestion: (formData) => {
    // FormData에서 questionId를 꺼내서 URL에 넣어야 함 (전달 방식에 따라 다름)
    const questionId = formData.get("questionId");
    return axiosInstance.put(`/question/update/${questionId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  /**
   * 3-2. 법률 질문 삭제 (PathVariable 방식 적용)
   * @param {number|string} questionId
   */
  deleteQuestion: (questionId) =>
    axiosInstance.delete(`/question/delete/${questionId}`),

  /**
   * 4. 변호사 답변 등록 (TB_ANSWER)
   */
  writeAnswer: (data) => axiosInstance.post("/question/answer/write", data),

  /**
   * 5. 변호사 답변 채택
   */
  adoptAnswer: (data) => axiosInstance.post("/question/adopt", data),

  /**
   * 6. 변호사 답변 수정
   */
  updateAnswer: (data) =>
    axiosInstance.put(`/question/answer/update/${data.answerId}`, data),

  /**
   * 7. 변호사 답변 삭제
   */
  deleteAnswer: (answerId) =>
    axiosInstance.delete(`/question/answer/delete/${answerId}`),
};
