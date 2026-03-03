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
  <Route key="mem-login" path="/member/login.do" element={<LoginPage />} />,
  <Route key="mem-find" path="/member/find.do" element={<FindIdPwPage />} />,
  <Route key="mem-join-type" path="/member/join/type.do" element={<JoinTypePage />} />,
  <Route key="social-join-terms" path="/member/join/social/terms.do" element={<GoogleJoinTermsPage />} />,
  <Route key="social-join-form" path="/member/join/social/google.do" element={<SocialJoinFormPage />} />,
  <Route key="mem-join-terms" path="/member/join/terms.do" element={<JoinTermsPage />} />,
  <Route key="mem-join-form" path="/member/join/form.do" element={<JoinFormPage />} />,
  <Route key="mem-join-comp" path="/member/join/complete.do" element={<JoinCompletePage />} />,
  <Route key="law-join-terms" path="/member/lawyer/terms.do" element={<LawyerJoinTermsPage />} />,
  <Route key="law-join-form" path="/member/lawyer/form.do" element={<LawyerJoinFormPage />} />,
  <Route key="law-join-comp" path="/member/lawyer/complete.do" element={<LawyerJoinCompletePage />} />
];
export default MemberRoutes;