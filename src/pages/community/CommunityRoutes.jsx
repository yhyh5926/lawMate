import React from "react";
import { Route } from "react-router-dom";
import QnaList from "./QnaList";
import Home from "./Home";
import QnaDetail from "./QnaDetail";

const CommunityRoutes = [
  <Route
    key="com-h"
    path="/community/home"
    element={<Home/>}
  />,
  <Route
    key="com-l"
    path="/community/qnalist"
    element={<QnaList/>}
  />,
  <Route
    key="com-w"
    path="/community/write.do"
    element={<div>게시글 등록</div>}
  />,
  <Route
    key="com-d"
    path="/community/detail/:postId"
    element={<QnaDetail/>}
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
