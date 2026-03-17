// src/api/adminApi.js
import axiosInstance from "./axiosInstance";

export const adminApi = {
  // 관리자 대시보드 통계 데이터를 가져오는 API
  getStats: () => axiosInstance.get("/admin/stats"),

  // 플랫폼에 가입된 전체 회원 목록을 조회하는 API
  getMemberList: (params) =>
    axiosInstance.get("/admin/member/list", { params }),

  // 문제가 있는 회원의 계정을 정지 처리하는 API
  suspendMember: (data) => axiosInstance.post("/admin/member/delete", data),

  // 가입 후 관리자 승인을 대기 중인 변호사 목록을 조회하는 API
  getPendingLawyers: () => axiosInstance.get("/admin/lawyer/approve"),

  // 대기 중인 변호사 회원의 가입을 승인하거나 반려하는 API
  approveLawyer: (data) => axiosInstance.post("/admin/lawyer/approve", data),

  // 플랫폼 전체 사건 진행 현황을 모니터링하기 위해 목록을 가져오는 API
  getCaseList: (params) => axiosInstance.get("/admin/case/list", { params }),

  // 커뮤니티 관리를 위해 자유게시판, 질문글, 의견조사 등 통합 게시글 목록을 조회하는 API
  getBoardList: () => axiosInstance.get("/admin/board/list"),

  // 관리자가 판단하여 부적절한 게시글을 삭제 처리하는 API
  deleteBoardItem: (data) => axiosInstance.post("/admin/board/delete", data),

  // 유저들이 접수한 전체 신고 내역 목록을 조회하는 API
  getReportList: (params) =>
    axiosInstance.get("/admin/report/list", { params }),

  // 관리자가 확인하려는 특정 신고 건의 상세 정보를 조회하는 API
  getReportDetail: (reportId) =>
    axiosInstance.get("/admin/report/detail", { params: { reportId } }),

  // 신고 내용을 확인한 뒤 대상자에게 제재를 집행하거나 처리 완료하는 API
  processSanction: (data) => axiosInstance.post("/admin/report/process", data),

  // 서비스 내에서 이루어진 전체 결제 내역을 조회하는 API
  getPaymentList: (params) =>
    axiosInstance.get("/admin/payment/list", { params }),
};