// src/api/adminApi.js

import axiosInstance from "./axiosInstance";

export const adminApi = {
  // 관리자 대시보드 통계
  getStats: () => axiosInstance.get("/admin/stats.do"),
  
  // 전체 회원 목록 조회
  getMemberList: (params) => axiosInstance.get("/admin/member/list.do", { params }),
  
  // 승인 대기 전문회원 목록 조회
  getPendingLawyers: () => axiosInstance.get("/admin/lawyer/approve.do"),
  
  // 전문회원 승인/반려 처리
  approveLawyer: (data) => axiosInstance.post("/admin/lawyer/approve.do", data),
  
  // 플랫폼 전체 사건 현황 모니터링 (기존 기능 보존)
  getCaseList: (params) => axiosInstance.get("/admin/case/list.do", { params }),

  // 💡 커뮤니티 관리 통합 게시글(일반/Q&A) 조회 (신규)
  getBoardList: () => axiosInstance.get("/admin/board/list.do"),
  
  // 💡 커뮤니티 관리 통합 게시글 삭제 (신규)
  deleteBoardItem: (data) => axiosInstance.post("/admin/board/delete.do", data),
  
  // 신고 접수 목록 조회 
  getReportList: (params) => axiosInstance.get("/admin/report/list.do", { params }),

  // 신고 상세 정보 조회
  getReportDetail: (reportId) => axiosInstance.get("/admin/report/detail.do", { params: { reportId } }),
  
  // 신고 대상 제재 집행 처리
  processSanction: (data) => axiosInstance.post("/admin/report/process.do", data),
  
  // 전체 결제 내역 조회
  getPaymentList: (params) => axiosInstance.get("/admin/payment/list.do", { params }),
};