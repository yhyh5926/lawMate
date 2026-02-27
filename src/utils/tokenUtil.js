// src/utils/tokenUtil.js
// 설명: JWT 토큰을 로컬 스토리지에 저장하고 가져오며, 토큰 내의 유저 정보를 해독하는 유틸리티입니다.

// 토큰 저장
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// 토큰 가져오기
export const getToken = () => {
  return localStorage.getItem("token");
};

// 토큰 삭제 (로그아웃 시)
export const removeToken = () => {
  localStorage.removeItem("token");
};

// JWT 토큰 해독 (유저 아이디, 권한 추출)
export const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};