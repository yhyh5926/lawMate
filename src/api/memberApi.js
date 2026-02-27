// vs코드
// 파일 위치: src/api/memberApi.js
// 설명: 회원가입, 로그인, 마이페이지 정보수정 및 탈퇴 등 회원 인증 도메인 API 호출

import axiosInstance from "./axiosInstance";

export const memberApi = {
  // 아이디 중복 확인
  checkId: (loginId) => axiosInstance.get(`/member/check-id.do?loginId=${loginId}`),
  
  // 일반/전문 회원가입 (데이터 내 memberType으로 구분)
  join: (data) => axiosInstance.post("/member/join/form.do", data),
  
  // 로그인
  login: (data) => axiosInstance.post("/member/login.do", data),
  
  // 아이디/비밀번호 찾기
  findIdPw: (data) => axiosInstance.post("/member/find.do", data),
  
  // 회원 정보 수정
  editProfile: (data) => axiosInstance.put("/mypage/edit.do", data),
  
  // 회원 탈퇴
  withdraw: () => axiosInstance.delete("/mypage/withdraw.do"),
};