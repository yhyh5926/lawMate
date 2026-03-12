// src/api/memberApi.js
import axiosInstance from "./axiosInstance";

export const memberApi = {
  // 아이디 중복 확인
  checkId: (loginId) =>
    axiosInstance.get(`/member/check-id?loginId=${loginId}`),

  // 일반/전문 회원가입 처리 (파일 업로드 지원)
  join: (data) =>
    axiosInstance.post("/member/join/form", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // 일반 로그인
  login: (data) => axiosInstance.post("/member/login", data),

  // 💡 [수정] 구글 로그인 전용 (기존 로그인 페이지에서 사용, JSON 방식)
  socialLogin: (data) => axiosInstance.post("/member/social-login", data),

  // 💡 [신규] 구글 상세 회원가입 전용 (추가 정보 입력 및 파일 업로드용, Multipart 방식)
  socialJoin: (data) =>
    axiosInstance.post("/member/join/social", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // 기타 기능 유지
  findIdPw: (data) => axiosInstance.post("/member/find", data),
  editProfile: (data) => axiosInstance.put("/api/mypage/edit", data),
  
  // 💡 [수정] 탈퇴 시 loginId를 백엔드로 보내도록 변경 (DELETE 대신 상태 업데이트를 위한 PUT 사용)
  // 컨트롤러의 @PathVariable("memberId") 구조에 맞춰 경로 수정
  withdraw: (memberId) => axiosInstance.put(`/api/member/${memberId}/withdraw`),

  // 💡 [신규 추가] 일반 회원의 상담 예약 내역 조회 및 취소 API
  getMyReservations: (memberId) => axiosInstance.get(`/api/reservations/member/${memberId}`),
  cancelReservation: (id) => axiosInstance.put(`/api/reservations/${id}/cancel`),

  // 💡 [신규 추가] 내가 쓴 글 목록 조회 API (type: 'question', 'community', 'mockTrial')
  getMyPosts: (memberId, type) => 
    axiosInstance.get("/api/member/posts", { params: { memberId, type } }),
};