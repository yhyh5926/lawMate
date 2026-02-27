// vs코드
// 파일 위치: src/context/AuthContext.jsx
// 설명: 앱 전역에서 로그인 사용자 정보(상태)와 로그인/로그아웃 기능을 제공하는 Context

import React, { createContext, useState, useEffect } from "react";
import { getToken, removeToken, parseJwt } from "../utils/tokenUtil";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 앱 실행 시 로컬스토리지의 토큰을 확인하여 자동 로그인 유지
  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUser({
          loginId: decoded.sub,
          role: decoded.role, // PERSONAL, LAWYER, ADMIN
        });
        setIsAuthenticated(true);
      } else {
        handleLogout();
      }
    }
  }, []);

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