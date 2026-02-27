// vs코드
// 파일 위치: src/api/adminApi.js
// 설명: 관리자 페이지의 통계, 회원/변호사 관리, 결제, 신고 제재 도메인 API 호출

import axiosInstance from "./axiosInstance";

export const adminApi = {
  // 관리자 대시보드 통계
  getStats: () => axiosInstance.get("/admin/stats.do"),
  
  // 전체 회원 목록 조회
  getMemberList: (params) => axiosInstance.get("/admin/member/list.do", { params }),
  
  // 승인 대기 전문회원 목록 조회
  getPendingLawyers: () => axiosInstance.get("/admin/lawyer/approve.do"),
  
  // 전문회원 승인/반려 처리 (LawyerVO 형태로 백엔드 전달)
  approveLawyer: (data) => axiosInstance.post("/admin/lawyer/approve.do", data),
  
  // 신고 접수 목록 조회
  getReportList: (params) => axiosInstance.get("/admin/report/list.do", { params }),
  
  // 신고 대상 제재 처리 (정지, 강퇴 등)
  processSanction: (data) => axiosInstance.post("/admin/report/detail.do", data),
  
  // 전체 결제 내역 조회
  getPaymentList: (params) => axiosInstance.get("/admin/payment/list.do", { params }),
  
  // 플랫폼 전체 사건 현황 모니터링
  getCaseList: (params) => axiosInstance.get("/admin/case/list.do", { params }),
};