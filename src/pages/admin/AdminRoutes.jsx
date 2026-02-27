// 파일 위치: src/pages/admin/AdminRoutes.jsx
// 설명: 기존에 개별 페이지를 각각 띄우던 방식을 수정하여,
// 모든 관리자 메뉴가 사이드바가 있는 'AdminApp' 레이아웃 안에서 열리도록 변경했습니다.

import React from "react";
import { Route } from "react-router-dom";
// 경로 해석 오류를 해결하기 위해 확장자(.jsx)를 추가했습니다.
import PrivateRoute from "../../components/common/PrivateRoute.jsx";
import AdminApp from "./AdminApp.jsx"; // 통합 관리자 앱 임포트

const AdminRoutes = [
  <Route key="admin-guard" element={<PrivateRoute requiredRole="ADMIN" />}>
    {/* 와일드카드(*)를 사용하여 /admin/ 하위의 어떤 주소로 들어오든 
        무조건 사이드바가 있는 AdminApp을 화면에 띄웁니다. */}
    <Route path="/admin/*" element={<AdminApp />} />
  </Route>
];

export default AdminRoutes;