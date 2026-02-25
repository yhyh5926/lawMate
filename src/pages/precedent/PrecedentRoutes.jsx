import React from "react";
import { Route } from "react-router-dom";

const PrecedentRoutes = [
  <Route
    key="prec-s"
    path="/precedent/search.do"
    element={<div>판례 검색</div>}
  />,
  <Route
    key="prec-d"
    path="/precedent/detail.do"
    element={<div>판례 상세</div>}
  />,
];

export default PrecedentRoutes;
