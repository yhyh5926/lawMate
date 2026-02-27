// src/pages/admin/AdminRoutes.jsx
// 설명: 관리자 페이지 관련 라우팅 모음 및 권한 가드 적용
// 해결: 컴파일러의 경로 해석 오류를 방지하기 위해 임포트 경로의 확장자를 제거했습니다.

import React from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "../../components/common/PrivateRoute";

// 관리자 페이지 컴포넌트 임포트 (확장자 제거)
import AdminMemberListPage from "./AdminMemberListPage";
import AdminLawyerApprovePage from "./AdminLawyerApprovePage";
import AdminCaseListPage from "./AdminCaseListPage";
import AdminPaymentPage from "./AdminPaymentPage";
import AdminReportListPage from "./AdminReportListPage";
import AdminReportDetailPage from "./AdminReportDetailPage";
import AdminStatsPage from "./AdminStatsPage";

const AdminRoutes = [
  // PrivateRoute를 사용하여 ADMIN 권한이 있는 사용자만 하위 경로에 접근 가능하도록 보호합니다.
  <Route key="admin-guard" element={<PrivateRoute requiredRole="ADMIN" />}>
    <Route path="/admin/member/list.do" element={<AdminMemberListPage />} />
    <Route path="/admin/lawyer/approve.do" element={<AdminLawyerApprovePage />} />
    <Route path="/admin/case/list.do" element={<AdminCaseListPage />} />
    <Route path="/admin/payment/list.do" element={<AdminPaymentPage />} />
    <Route path="/admin/report/list.do" element={<AdminReportListPage />} />
    <Route path="/admin/report/detail.do/:reportId" element={<AdminReportDetailPage />} />
    <Route path="/admin/stats.do" element={<AdminStatsPage />} />
  </Route>
];

export default AdminRoutes;