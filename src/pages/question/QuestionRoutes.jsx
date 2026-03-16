import React from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "../../components/common/PrivateRoute";

import QuestionListPage from "./QuestionListPage";
import QuestionDetailPage from "./QuestionDetailPage";
import QuestionWritePage from "./QuestionWritePage";

const QuestionRoutes = [
  // 목록과 상세 조회는 누구나 볼 수 있게 열어둡니다.
  <Route key="q-list" path="/question/list" element={<QuestionListPage />} />,
  <Route
    key="q-detail"
    path="/question/detail/:questionId"
    element={<QuestionDetailPage />}
  />,

  <Route path="/question/write" element={<QuestionWritePage />} />,
];

export default QuestionRoutes;
