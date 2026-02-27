// src/components/common/PrivateRoute.jsx
// 설명: 로그인 여부를 확인하여 페이지 접근을 제어합니다. 
// Zustand 스토어의 데이터가 로드(Hydration)될 때까지 기다리는 로직이 포함되어 있습니다.

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";

const PrivateRoute = ({ requiredRole }) => {
  const { isAuthenticated, user, isHydrated } = useAuthStore();

  // 1. 스토어가 로컬 스토리지로부터 로그인 정보를 읽어올 때까지 대기 (깜빡임 방지)
  if (!isHydrated) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>인증 확인 중...</div>;
  }

  // 2. 로그인이 안 되어 있으면 로그인 페이지로 이동
  if (!isAuthenticated) {
    alert("로그인이 필요한 서비스입니다.");
    return <Navigate to="/member/login.do" replace />;
  }

  // 3. 특정 권한(ADMIN 등)이 필요한데 권한이 다르면 메인으로 이동
  if (requiredRole && user?.role !== requiredRole) {
    alert("해당 페이지에 접근할 권한이 없습니다.");
    return <Navigate to="/main.do" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;