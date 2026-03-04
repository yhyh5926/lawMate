// src/api/memberApi.js
/**
 * 파일 위치: src/api/memberApi.js
 * 기능: 로그인(JSON)과 회원가입(Multipart) API를 분리하여 500 에러를 해결했습니다.
 */
import axiosInstance from "./axiosInstance";

export const memberApi = {
  // 아이디 중복 확인
  checkId: (loginId) => axiosInstance.get(`/member/check-id.do?loginId=${loginId}`),
  
  // 일반/전문 회원가입 처리 (파일 업로드 지원)
  join: (data) => axiosInstance.post("/member/join/form.do", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  
  // 일반 로그인
  login: (data) => axiosInstance.post("/member/login.do", data),
  
  // 💡 [수정] 구글 로그인 전용 (기존 로그인 페이지에서 사용, JSON 방식)
  socialLogin: (data) => axiosInstance.post("/member/social-login.do", data),
  
  // 💡 [신규] 구글 상세 회원가입 전용 (추가 정보 입력 및 파일 업로드용, Multipart 방식)
  socialJoin: (data) => axiosInstance.post("/member/join/social.do", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  
  // 기타 기능 유지
  findIdPw: (data) => axiosInstance.post("/member/find.do", data),
  editProfile: (data) => axiosInstance.put("/api/mypage/edit.do", data),
  withdraw: () => axiosInstance.delete("/api/mypage/withdraw.do"),
};