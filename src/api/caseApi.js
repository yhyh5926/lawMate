// vs코드
// 파일 위치: src/api/caseApi.js
// 설명: 마이페이지 의뢰인 사건 목록/상세 조회 및 변호사 사건 전환(등록) API 호출

import axiosInstance from "./axiosInstance";

export const caseApi = {
  // 내 사건 목록 조회 (파라미터로 memberId 전달)
  getMyCaseList: (memberId) =>
    axiosInstance.get(`/cases/list?memberId=${memberId}`),

  // 사건 상세 및 진행 스텝 정보 조회
  getCaseDetail: (caseId) =>
    axiosInstance.get(`/cases/detail?caseId=${caseId}`),

  // [변호사] 답변 채택 후 정식 사건 전환/등록
  registerCase: (data) => axiosInstance.post("/register", data),

  // 💡 [신규 추가] 변호사 - 사건 진행 상태 업데이트 (접수 -> 진행 중 등)
  updateCaseStatus: (caseId, status) => 
    axiosInstance.put(`/cases/${caseId}/status`, { status }),

  // 💡 [신규 추가] 변호사 - 사건 상세 정보(내용, 파일, 코멘트) 수정
  updateCaseInfo: (caseId, data) => 
    axiosInstance.put(`/cases/${caseId}`, data),

  // 💡 [신규 추가] 의뢰인(일반) - 사건 종료 후 별점 및 후기 등록
  submitReview: (caseId, data) => 
    axiosInstance.post(`/cases/${caseId}/review`, data),
};