import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

// 모듈별 라우트 Import
import MainRoutes from "./pages/main/MainRoutes";
import MemberRoutes from "./pages/member/MemberRoutes";
import MyCaseRoutes from "./pages/mypage/MyCaseRoutes";
import AdminRoutes from "./pages/admin/AdminRoutes";
import ChatConsultRoutes from "./pages/chat/ChatConsultRoutes";
import PrecedentRoutes from "./pages/precedent/PrecedentRoutes";
import LawyerRoutes from "./pages/lawyer/LawyerRoutes";
import CommunityRoutes from "./pages/community/CommunityRoutes";

function App() {
  return (
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
  );
}

export default App;
