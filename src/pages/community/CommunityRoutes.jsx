import React from "react";
import { Route } from "react-router-dom";

const CommunityRoutes = [
  <Route
    key="com-l"
    path="/community/list.do"
    element={<div>게시글 목록</div>}
  />,
  <Route
    key="com-w"
    path="/community/write.do"
    element={<div>게시글 등록</div>}
  />,
  <Route
    key="com-d"
    path="/community/detail.do"
    element={<div>게시글 상세/댓글</div>}
  />,
  <Route
    key="pol-w"
    path="/community/poll/write.do"
    element={<div>의견조사 생성</div>}
  />,
  <Route
    key="pol-d"
    path="/community/poll/detail.do"
    element={<div>의견조사 참여</div>}
  />,
];

export default CommunityRoutes;
