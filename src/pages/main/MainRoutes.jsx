// src/pages/main/MainRoutes.jsx
import React from "react";
import { Route, Navigate } from "react-router-dom";
import MainPage from "./MainPage";

const MainRoutes = [
  // ✅ canonical
  <Route key="main" path="/main.do" element={<MainPage />} />,
];

export default MainRoutes;
