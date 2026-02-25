import React from "react";
import { Route } from "react-router-dom";

const MyCaseRoutes = [
  <Route
    key="my-case-l"
    path="/mypage/case/list.do"
    element={<div>사건 목록</div>}
  />,
  <Route
    key="my-case-d"
    path="/mypage/case/detail.do"
    element={<div>사건 상세</div>}
  />,
  <Route
    key="q-write"
    path="/question/write.do"
    element={<div>법률 질문 등록</div>}
  />,
  <Route
    key="q-list"
    path="/question/list.do"
    element={<div>법률 질문 목록</div>}
  />,
  <Route
    key="q-detail"
    path="/question/detail.do"
    element={<div>법률 질문 상세</div>}
  />,
];

export default MyCaseRoutes;
