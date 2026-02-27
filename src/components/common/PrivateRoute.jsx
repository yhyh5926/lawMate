// src/components/common/PrivateRoute.jsx
// 설명: 비로그인 사용자나 권한이 없는 사용자의 접근을 차단하는 보안 가드 컴포넌트입니다.
// Zustand의 useAuthStore를 사용하여 전역 인증 상태를 확인합니다.
// 모듈 해석 오류 해결을 위해 경로를 점검했습니다.

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore"; // 확장자를 제거하여 해석 오류를 방지합니다.

const PrivateRoute = ({ requiredRole }) => {
  // Zustand 스토어에서 인증 상태와 유저 정보 추출
  const { isAuthenticated, user } = useAuthStore();

  // 1. 로그인이 안 되어 있으면 로그인 페이지로 이동
  if (!isAuthenticated) {
    alert("로그인이 필요한 서비스입니다.");
    return <Navigate to="/member/login.do" replace />;
  }

  // 2. 특정 권한(ADMIN, LAWYER 등)이 필요한 페이지인데 유저 권한이 다른 경우
  if (requiredRole && user?.role !== requiredRole) {
    alert("해당 페이지에 접근할 권한이 없습니다.");
    return <Navigate to="/main.do" replace />;
  }

  // 3. 모든 조건을 통과하면 자식 컴포넌트(요청한 페이지)를 보여줌
  return <Outlet />;
};

export default PrivateRoute;