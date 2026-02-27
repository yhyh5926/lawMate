import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

// ✅ 추가된 부분: AuthContext에서 AuthProvider 임포트
import { AuthProvider } from "./context/AuthContext";

// 모듈별 라우트 Import
import MainRoutes from "./pages/main/MainRoutes";
import MemberRoutes from "./pages/member/MemberRoutes";
import MyCaseRoutes from "./pages/mypage/MyCaseRoutes";
import AdminRoutes from "./pages/admin/AdminRoutes";
import ChatConsultRoutes from "./pages/chat/ChatConsultRoutes";
import PrecedentRoutes from "./pages/precedent/PrecedentRoutes";
import LawyerRoutes from "./pages/lawyer/LawyerRoutes";
import CommunityRoutes from "./pages/community/CommunityRoutes";
import QuestionRoutes from "./pages/question/QuestionRoutes";

function App() {
  return (
    // ✅ 추가된 부분: 앱 전체를 AuthProvider로 감싸주어 전역 상태 접근 가능하게 수정
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            {MainRoutes}
            {MemberRoutes}
            {MyCaseRoutes}
            {AdminRoutes}
            {ChatConsultRoutes}
            {PrecedentRoutes}
            {LawyerRoutes}
            {CommunityRoutes}
            {QuestionRoutes}
            <Route path="/" element={<Navigate to="/main.do" replace />} />
            <Route
              path="*"
              element={
                <div style={{ padding: "100px", textAlign: "center" }}>
                  페이지를 찾을 수 없습니다.
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
