// vs코드
// 파일 위치: src/components/common/PrivateRoute.jsx
// 설명: 비로그인 사용자나 권한이 없는 사용자(예: 일반 회원이 관리자 페이지 접근)를 차단하고 리다이렉트하는 가드 컴포넌트

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

const PrivateRoute = ({ requiredRole }) => {
  const { isAuthenticated, user } = useAuth();

  // 1. 로그인이 안 되어 있으면 로그인 페이지로 이동
  if (!isAuthenticated) {
    alert("로그인이 필요한 서비스입니다.");
    return <Navigate to="/member/login.do" replace />;
  }

  // 2. 특정 권한(ADMIN, LAWYER 등)이 필요한데 권한이 다르면 메인으로 쫓아냄
  if (requiredRole && user?.role !== requiredRole) {
    alert("해당 페이지에 접근할 권한이 없습니다.");
    return <Navigate to="/main.do" replace />;
  }

  // 3. 통과되면 하위 라우트(페이지) 렌더링
  return <Outlet />;
};

export default PrivateRoute;