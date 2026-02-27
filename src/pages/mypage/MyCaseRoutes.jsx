// vs코드
// 파일 위치: src/pages/mypage/MyCaseRoutes.jsx
// 설명: 마이페이지(회원정보 수정, 탈퇴) 및 의뢰인 내 사건 목록/상세 라우팅 모음

import React from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "../../components/common/PrivateRoute";

import MypageEditPage from "./MypageEditPage";
import WithdrawPage from "./WithdrawPage";
import CaseListPage from "./CaseListPage";
import CaseDetailPage from "./CaseDetailPage";

const MyCaseRoutes = [
  // 로그인이 필요한 라우트이므로 PrivateRoute로 감싸서 보호합니다.
  <Route key="mypage-guard" element={<PrivateRoute />}>
    <Route path="/mypage/edit.do" element={<MypageEditPage />} />
    <Route path="/mypage/withdraw.do" element={<WithdrawPage />} />
    <Route path="/mypage/case/list.do" element={<CaseListPage />} />
    <Route path="/mypage/case/detail.do/:caseId" element={<CaseDetailPage />} />
  </Route>
];

export default MyCaseRoutes;