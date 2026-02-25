import React from "react";
import { Route } from "react-router-dom";

const AdminRoutes = [
  <Route
    key="adm-mem"
    path="/admin/member/list.do"
    element={<div>회원 목록 조회</div>}
  />,
  <Route
    key="adm-law"
    path="/admin/lawyer/approve.do"
    element={<div>전문회원 승인</div>}
  />,
  <Route
    key="adm-case"
    path="/admin/case/list.do"
    element={<div>사건 목록 조회</div>}
  />,
  <Route
    key="adm-pay"
    path="/admin/payment/list.do"
    element={<div>결제/정산 목록</div>}
  />,
  <Route
    key="adm-rep-l"
    path="/admin/report/list.do"
    element={<div>신고 목록</div>}
  />,
  <Route
    key="adm-rep-d"
    path="/admin/report/detail.do"
    element={<div>제재 처리</div>}
  />,
  <Route
    key="adm-stats"
    path="/admin/stats.do"
    element={<div>서비스 통계</div>}
  />,
];

export default AdminRoutes;
