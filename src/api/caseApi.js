// vs코드
// 파일 위치: src/api/caseApi.js
// 설명: 마이페이지 의뢰인 사건 목록/상세 조회 및 변호사 사건 전환(등록) API 호출

import axiosInstance from "./axiosInstance";

export const caseApi = {
  // 내 사건 목록 조회 (파라미터로 memberId 전달)
  getMyCaseList: (memberId) => axiosInstance.get(`/api/cases/list.do?memberId=${memberId}`),
  
  // 사건 상세 및 진행 스텝 정보 조회
  getCaseDetail: (caseId) => axiosInstance.get(`/api/cases/detail.do?caseId=${caseId}`),
  
  // [변호사] 답변 채택 후 정식 사건 전환/등록
  registerCase: (data) => axiosInstance.post("/case/register.do", data),
};