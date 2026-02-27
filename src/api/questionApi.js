// vs코드
// 파일 위치: src/api/questionApi.js
// 설명: 법률 질문 등록, 전체 목록 조회, 상세 조회 및 답변 채택 API 호출

import axiosInstance from "./axiosInstance";

export const questionApi = {
  // 전체 질문 목록 조회 (사건 유형, 상태 필터 파라미터 포함 가능)
  getQuestionList: (params) => axiosInstance.get("/question/list.do", { params }),
  
  // 특정 질문 상세 내용 및 변호사 답변 조회
  getQuestionDetail: (questionId) => axiosInstance.get(`/question/detail.do?questionId=${questionId}`),
  
  // 새로운 법률 질문 작성
  writeQuestion: (data) => axiosInstance.post("/question/write.do", data),
};