// vs코드
// 파일 위치: src/hooks/useAuth.js
// 설명: AuthContext를 쉽게 가져다 쓸 수 있도록 캡슐화한 커스텀 훅

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서 사용되어야 합니다.");
  }
  return context; // { user, isAuthenticated, handleLogin, handleLogout } 반환
};