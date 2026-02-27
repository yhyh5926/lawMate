// vs코드
// 파일 위치: src/pages/member/MemberRoutes.jsx
// 설명: 로그인, 일반/전문 회원가입, 아이디/비밀번호 찾기 관련 라우팅 모음

import React from "react";
import { Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import FindIdPwPage from "./FindIdPwPage";
import JoinTermsPage from "./JoinTermsPage";
import JoinFormPage from "./JoinFormPage";
import JoinCompletePage from "./JoinCompletePage";
import LawyerJoinTermsPage from "./LawyerJoinTermsPage";
import LawyerJoinFormPage from "./LawyerJoinFormPage";
import LawyerJoinCompletePage from "./LawyerJoinCompletePage";

const MemberRoutes = [
  <Route key="mem-login" path="/member/login.do" element={<LoginPage />} />,
  <Route key="mem-find" path="/member/find.do" element={<FindIdPwPage />} />,
  
  // 일반 회원가입
  <Route key="mem-join-terms" path="/member/join/terms.do" element={<JoinTermsPage />} />,
  <Route key="mem-join-form" path="/member/join/form.do" element={<JoinFormPage />} />,
  <Route key="mem-join-comp" path="/member/join/complete.do" element={<JoinCompletePage />} />,
  
  // 전문(변호사) 회원가입
  <Route key="law-join-terms" path="/member/lawyer/terms.do" element={<LawyerJoinTermsPage />} />,
  <Route key="law-join-form" path="/member/lawyer/form.do" element={<LawyerJoinFormPage />} />,
  <Route key="law-join-comp" path="/member/lawyer/complete.do" element={<LawyerJoinCompletePage />} />
];

export default MemberRoutes;