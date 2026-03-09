import React from "react";
import { Route } from "react-router-dom";
import QnaList from "./QnaList";
import Home from "./Home";
import QnaDetail from "./QnaDetail";
import QnaWrite from "./QnaWrite";
import QnaEdit from "./QnaEdit";
import PollList from "./PollList";
import PollDetail from "./PollDetail";

const CommunityRoutes = [
  <Route key="com-h" path="/community/home" element={<Home />} />,
  <Route key="com-l" path="/community/qnalist" element={<QnaList />} />,
  <Route key="com-w" path="/community/write" element={<QnaWrite />} />,
  <Route
    key="com-d"
    path="/community/detail/:postId"
    element={<QnaDetail />}
  />,
  <Route path="/community/edit/:postId" element={<QnaEdit />} />,
  <Route key="pol-l" path="/community/pollList" element={<PollList />} />,
  <Route
    key="pol-w"
    path="/community/poll/write"
    element={<div>의견조사 생성</div>}
  />,
  <Route
    key="pol-d"
    path="/community/poll/detail/:pollId"
    element={<PollDetail />}
  />,
];

export default CommunityRoutes;
