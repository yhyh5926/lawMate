// vs코드
// 파일 위치: src/context/AuthContext.jsx
// 설명: 앱 전역에서 로그인 사용자 정보(상태)와 로그인/로그아웃 기능을 제공하는 Context

import React, { createContext, useState } from "react";
import { getToken, removeToken, parseJwt } from "../utils/tokenUtil";

export const AuthContext = createContext();

// useEffect 대신 함수로 즉시 토큰 파싱
// → 첫 렌더링부터 user가 세팅되어 채팅창 좌우 반전 문제 해결
const getInitialUser = () => {
  const token = getToken();
  if (!token) return null;
  const decoded = parseJwt(token);
  if (!decoded) return null;
  return {
    loginId: decoded.sub,
    role: decoded.role,       // PERSONAL, LAWYER, ADMIN
    memberId: decoded.memberId,
  };
};

export const AuthProvider = ({ children }) => {
  // useState 초기값으로 즉시 토큰 파싱 (앱 실행 시 바로 user 세팅)
  const [user, setUser] = useState(getInitialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getInitialUser());

  // 로그인 성공 시 호출될 함수
  const handleLogin = (userInfo) => {
    setUser(userInfo);
    setIsAuthenticated(true);
  };

  // 로그아웃 시 호출될 함수
  const handleLogout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};