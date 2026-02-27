// vs코드
// 파일 위치: src/pages/question/QuestionRoutes.jsx
// 설명: 법률 질문 등록, 전체 목록 조회, 상세 화면 라우팅 모음

import React from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "../../components/common/PrivateRoute";

import QuestionListPage from "./QuestionListPage";
import QuestionDetailPage from "./QuestionDetailPage";
import QuestionWritePage from "./QuestionWritePage";

const QuestionRoutes = [
  // 목록과 상세 조회는 누구나 볼 수 있게 열어둡니다.
  <Route
    key="q-list"
    path="/question/list.do"
    element={<QuestionListPage />}
  />,
  <Route
    key="q-detail"
    path="/question/detail.do/:questionId"
    element={<QuestionDetailPage />}
  />,

  // 질문 작성은 로그인이 필요하므로 보호합니다.
  <Route key="q-write-guard" element={<PrivateRoute />}>
    <Route path="/question/write.do" element={<QuestionWritePage />} />
  </Route>,
];

export default QuestionRoutes;
