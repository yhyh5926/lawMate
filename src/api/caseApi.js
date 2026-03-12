// vs코드
// 파일 위치: src/api/caseApi.js

import axiosInstance from "./axiosInstance";

export const caseApi = {
  getMyCaseList: (memberId) =>
    axiosInstance.get(`/cases/list?memberId=${memberId}`),

  getCaseDetail: (caseId) =>
    axiosInstance.get(`/cases/detail?caseId=${caseId}`),

  registerCase: (data) => axiosInstance.post("/cases/register", data),

  // 💡 [신규 추가] 변호사가 마이페이지에서 수동으로 사건 등록 (의뢰인 ID, 제목 등)
  createCaseManual: (data) =>
    axiosInstance.post("/cases/manual-register", data),

  // 변호사 - 사건 진행 상태 업데이트 (이전/다음 스텝)
  updateCaseStatus: (caseId, status) =>
    axiosInstance.put(`/cases/${caseId}/status`, { status }),

  // 💡 [수정] 변호사 - 사건 상세 정보 수정 및 다중 파일 업로드 (FormData 사용)
  updateCaseInfo: (caseId, formData) =>
    axiosInstance.put(`/cases/${caseId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // 의뢰인(일반) - 사건 종료 후 별점 및 후기 등록
  submitReview: (caseId, data) =>
    axiosInstance.post(`/cases/${caseId}/review`, data),
};
