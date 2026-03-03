// src/pages/member/MemberRoutes.jsx
/**
 * 파일 위치: src/pages/member/MemberRoutes.jsx
 * 수정 사항: 가입 유형 선택 페이지 및 소셜 가입 상세 폼 라우트를 통합했습니다.
 */

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

// 💡 추후 구현할 소셜 전용 가입 폼 컴포넌트 (지금은 임시 텍스트)
const SocialJoinPlaceholder = () => <div style={{padding: "100px", textAlign: "center"}}>구글 상세 가입 페이지 준비 중입니다.</div>;

const MemberRoutes = [
  <Route key="mem-login" path="/member/login.do" element={<LoginPage />} />,
  <Route key="mem-find" path="/member/find.do" element={<FindIdPwPage />} />,
  
  // 1. 회원가입 유형 선택 (일반/변호사 -> 직접/소셜)
  <Route key="mem-join-type" path="/member/join/type.do" element={<JoinTypePage />} />,
  
  // 2. 소셜 가입 상세 폼 (구글 전용)
  <Route key="social-join-form" path="/member/join/social/google.do" element={<SocialJoinPlaceholder />} />,
  
  // 3. 일반 회원가입 프로세스
  <Route key="mem-join-terms" path="/member/join/terms.do" element={<JoinTermsPage />} />,
  <Route key="mem-join-form" path="/member/join/form.do" element={<JoinFormPage />} />,
  <Route key="mem-join-comp" path="/member/join/complete.do" element={<JoinCompletePage />} />,
  
  // 4. 전문(변호사) 회원가입 프로세스
  <Route key="law-join-terms" path="/member/lawyer/terms.do" element={<LawyerJoinTermsPage />} />,
  <Route key="law-join-form" path="/member/lawyer/form.do" element={<LawyerJoinFormPage />} />,
  <Route key="law-join-comp" path="/member/lawyer/complete.do" element={<LawyerJoinCompletePage />} />
];

export default MemberRoutes;