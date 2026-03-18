// src/pages/lawyer/LawyerRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";
import LawyerListPage from "./LawyerListPage";
import LawyerDetailPage from "./LawyerDetailPage";

const LawyerRoutes = [
  // 💡 .do 제거 완료
  <Route key="law-list" path="/lawyer/list" element={<LawyerListPage />} />,
  <Route key="law-detail" path="/lawyer/detail/:id" element={<LawyerDetailPage />} />,
  <Route key="law-review" path="/lawyer/review/write" element={<div>상담 후기 작성 (준비중)</div>} />,
  <Route key="law-dashboard" path="/mypage/lawyer/dashboard" element={<div>전문회원 대시보드 (준비중)</div>} />,
];

export default LawyerRoutes;