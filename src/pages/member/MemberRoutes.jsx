import React from "react";
import { Route } from "react-router-dom";

const MemberRoutes = [
  <Route key="mem-login" path="/member/login.do" element={<div>로그인</div>} />,
  <Route
    key="mem-join-t"
    path="/member/join/terms.do"
    element={<div>회원가입 약관</div>}
  />,
  <Route
    key="mem-join-f"
    path="/member/join/form.do"
    element={<div>회원정보입력</div>}
  />,
  <Route
    key="mem-join-c"
    path="/member/join/complete.do"
    element={<div>가입완료</div>}
  />,
  <Route
    key="law-join-t"
    path="/member/lawyer/terms.do"
    element={<div>전문회원 약관</div>}
  />,
  <Route
    key="law-join-f"
    path="/member/lawyer/form.do"
    element={<div>전문회원 정보입력</div>}
  />,
  <Route
    key="law-join-c"
    path="/member/lawyer/complete.do"
    element={<div>전문회원 가입완료</div>}
  />,
  <Route
    key="mem-find"
    path="/member/find.do"
    element={<div>ID/PW 찾기</div>}
  />,
  <Route key="my-edit" path="/mypage/edit.do" element={<div>정보수정</div>} />,
  <Route
    key="my-withdraw"
    path="/mypage/withdraw.do"
    element={<div>회원탈퇴</div>}
  />,
  <Route
    key="noti-list"
    path="/notification/list.do"
    element={<div>알림 목록</div>}
  />,
];

export default MemberRoutes;
