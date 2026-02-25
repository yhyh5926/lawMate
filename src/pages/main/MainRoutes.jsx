import React from "react";
import { Route } from "react-router-dom";

const MainRoutes = [
  <Route
    key="main-home"
    path="/main.do"
    element={<div>메인화면 (통계/공지)</div>}
  />,
];

export default MainRoutes;
