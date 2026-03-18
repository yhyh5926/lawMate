// src/pages/mypage/MyCaseRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "../../components/common/PrivateRoute";

import MyPage from "./MyPage"; // 💡 새로 만든 탭 구조의 마이페이지 메인
import WithdrawPage from "./WithdrawPage";
import CaseListPage from "./CaseListPage";
import CaseDetailPage from "./CaseDetailPage";

const MyCaseRoutes = [
  <Route key="mypage-guard" element={<PrivateRoute />}>
    {/* 💡 마이페이지 메인 진입점 */}
    <Route path="/mypage/main" element={<MyPage />} />

    <Route path="/mypage/withdraw" element={<WithdrawPage />} />
    <Route path="/mypage/case/list" element={<CaseListPage />} />
    <Route path="/mypage/case/detail/:caseId" element={<CaseDetailPage />} />
  </Route>,
];

export default MyCaseRoutes;
