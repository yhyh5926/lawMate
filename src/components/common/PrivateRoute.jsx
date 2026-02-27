// src/components/common/PrivateRoute.jsx
// 설명: 아이디가 'admin'인 유저에게 관리자 페이지 접근 권한을 부여하는 보안 가드입니다.
// 역할(Role) 설정과 관계없이 loginId가 'admin'인 경우에만 접근을 허용하도록 로직을 강제했습니다.

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";

const PrivateRoute = ({ requiredRole }) => {
  const { isAuthenticated, user, isHydrated } = useAuthStore();

  // 1. Zustand 스토어 데이터 로딩 대기 (새로고침 시 상태 유지 확인용)
  if (!isHydrated) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", color: "#666" }}>
        사용자 권한 확인 중...
      </div>
    );
  }

  // 2. 로그인 여부 확인
  if (!isAuthenticated) {
    alert("로그인이 필요한 서비스입니다.");
    return <Navigate to="/member/login.do" replace />;
  }

  // 3. 관리자 페이지 접근 제어
  // 은혁님 요청사항: 유저의 role이 '일반(PERSONAL)'이어도 loginId가 'admin'이면 무조건 허용
  if (requiredRole === "ADMIN") {
    if (user?.loginId !== "admin") {
      alert("관리자 계정(admin)으로만 접근이 가능한 메뉴입니다.");
      return <Navigate to="/main.do" replace />;
    }
    // 아이디가 admin이면 다른 권한 체크 없이 즉시 렌더링을 허용합니다.
    return <Outlet />;
  }

  // 4. 기타 권한 체크 (필요 시)
  if (requiredRole && user?.role !== requiredRole) {
    alert("해당 메뉴에 접근할 권한이 없습니다.");
    return <Navigate to="/main.do" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;