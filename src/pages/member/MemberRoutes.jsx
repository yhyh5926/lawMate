// src/pages/member/MemberRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import FindIdPwPage from "./FindIdPwPage";
import JoinTypePage from "./JoinTypePage";
import JoinTermsPage from "./JoinTermsPage";
import JoinFormPage from "./JoinFormPage";
import JoinCompletePage from "./JoinCompletePage";
import LawyerJoinTermsPage from "./LawyerJoinTermsPage";
import LawyerJoinFormPage from "./LawyerJoinFormPage";
import LawyerJoinCompletePage from "./LawyerJoinCompletePage";
import GoogleJoinTermsPage from "./GoogleJoinTermsPage";
import SocialJoinFormPage from "./SocialJoinFormPage";

const MemberRoutes = [
  <Route key="mem-login" path="/member/login" element={<LoginPage />} />,
  <Route key="mem-find" path="/member/find" element={<FindIdPwPage />} />,
  <Route
    key="mem-join-type"
    path="/member/join/type"
    element={<JoinTypePage />}
  />,
  <Route
    key="social-join-terms"
    path="/member/join/social/terms"
    element={<GoogleJoinTermsPage />}
  />,
  <Route
    key="social-join-form"
    path="/member/join/social/google"
    element={<SocialJoinFormPage />}
  />,
  <Route
    key="mem-join-terms"
    path="/member/join/terms"
    element={<JoinTermsPage />}
  />,
  <Route
    key="mem-join-form"
    path="/member/join/form"
    element={<JoinFormPage />}
  />,
  <Route
    key="mem-join-comp"
    path="/member/join/complete"
    element={<JoinCompletePage />}
  />,
  <Route
    key="law-join-terms"
    path="/member/lawyer/terms"
    element={<LawyerJoinTermsPage />}
  />,
  <Route
    key="law-join-form"
    path="/member/lawyer/form"
    element={<LawyerJoinFormPage />}
  />,
  <Route
    key="law-join-comp"
    path="/member/lawyer/complete"
    element={<LawyerJoinCompletePage />}
  />,
];
export default MemberRoutes;
