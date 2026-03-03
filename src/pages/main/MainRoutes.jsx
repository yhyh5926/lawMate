// src/pages/main/MainRoutes.jsx
import React from "react";
import { Route, Navigate } from "react-router-dom";
import MainPage from "./MainPage";

const MainRoutes = [
  // ✅ canonical
  <Route key="main" path="/main.do" element={<MainPage />} />,

  // ✅ aliases (잘못된 링크/트레일링 슬래시/기존 경로 대응)
  <Route key="main-alias-1" path="/main" element={<Navigate to="/main.do" replace />} />,
  <Route key="main-alias-2" path="/main/" element={<Navigate to="/main.do" replace />} />,
  <Route key="main-alias-3" path="/main.do/" element={<Navigate to="/main.do" replace />} />,
];

export default MainRoutes;