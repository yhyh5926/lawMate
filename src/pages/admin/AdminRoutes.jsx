// vs코드
// 파일 위치: src/pages/admin/AdminRoutes.jsx
// 설명: 관리자 페이지 관련 라우팅 모음 (임포트 경로 수정 및 안정성 확보)

import React from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "../../components/common/PrivateRoute";

// 관리자 페이지들만 임포트합니다.
import AdminMemberListPage from "./AdminMemberListPage";
import AdminLawyerApprovePage from "./AdminLawyerApprovePage";
import AdminCaseListPage from "./AdminCaseListPage";
import AdminPaymentPage from "./AdminPaymentPage";
import AdminReportListPage from "./AdminReportListPage";
import AdminReportDetailPage from "./AdminReportDetailPage";
import AdminStatsPage from "./AdminStatsPage";

const AdminRoutes = [
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