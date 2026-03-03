// src/api/memberApi.js
/**
 * 파일 위치: src/api/memberApi.js
 * 수정 사항: 중복 경로 방지를 위해 /api를 제거하고 컨트롤러의 @RequestMapping 경로와 맞췄습니다.
 */
import axiosInstance from "./axiosInstance";

export const memberApi = {
  // 아이디 중복 확인 (결과: { "available": true/false })
  checkId: (loginId) => axiosInstance.get(`/member/check-id.do?loginId=${loginId}`),
  
  // 회원가입 처리
  join: (data) => axiosInstance.post("/member/join/form.do", data),
  
  // 일반 로그인
  login: (data) => axiosInstance.post("/member/login.do", data),
  
  // 구글 소셜 로그인
  socialLogin: (data) => axiosInstance.post("/member/social-login.do", data),
  
  // 기타 기능 유지
  findIdPw: (data) => axiosInstance.post("/member/find.do", data),
  editProfile: (data) => axiosInstance.put("/api/mypage/edit.do", data), // 마이페이지 경로는 프로젝트 구조에 맞춰 유지
  withdraw: () => axiosInstance.delete("/api/mypage/withdraw.do"),
};