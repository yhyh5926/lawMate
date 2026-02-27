import React from "react";
import { Route } from "react-router-dom";
import LawyerListPage from "./LawyerListPage";
import LawyerDetailPage from "./LawyerDetailPage";

const LawyerRoutes = [
  <Route key="law-l" path="/lawyer/list.do" element={<LawyerListPage />} />,
  <Route
    key="law-d"
    path="/lawyer/detail.do/:id"
    element={<LawyerDetailPage />}
  />,
  <Route
    key="law-rev"
    path="/lawyer/review/write.do"
    element={<div>상담 후기 작성</div>}
  />,
  <Route
    key="law-dash"
    path="/mypage/lawyer/dashboard.do"
    element={<div>전문회원 대시보드</div>}
  />,
];

export default LawyerRoutes;
