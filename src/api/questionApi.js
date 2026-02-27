import axiosInstance from "./axiosInstance";

export const questionApi = {
  // 1. 전체 질문 목록 조회
  getQuestionList: (params) =>
    axiosInstance.get("/question/list.do", { params }),

  // 2. 특정 질문 상세 내용 및 변호사 답변 조회
  getQuestionDetail: (questionId) =>
    axiosInstance.get(`/question/detail.do?questionId=${questionId}`),

  // 3. 새로운 법률 질문 작성 (TB_QUESTION)
  writeQuestion: (data) => axiosInstance.post("/question/write.do", data),

  // --- 추가된 API ---

  // 4. 변호사 답변 등록 (TB_ANSWER)
  // data: { questionId, content } -> lawyerId는 서버 세션/토큰에서 추출 권장
  writeAnswer: (data) => axiosInstance.post("/question/answer/write.do", data),

  // 5. 답변 채택 (TB_ANSWER.IS_ADOPTED = 'Y')
  // answerId를 통해 특정 답변을 채택하고 질문 상태를 CLOSED로 변경 유도
  adoptAnswer: (answerId) =>
    axiosInstance.post(`/question/answer/adopt.do`, { answerId }),

  // 6. 질문 삭제 (필요 시)
  deleteQuestion: (questionId) =>
    axiosInstance.post(`/question/delete.do`, { questionId }),
};
