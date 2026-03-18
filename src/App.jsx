import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ChatbotButton from "./components/common/ChatbotButton";

import "./App.css";
import { AuthProvider } from "./context/AuthContext";

import MainRoutes from "./pages/main/MainRoutes";
import MemberRoutes from "./pages/member/MemberRoutes";
import MyCaseRoutes from "./pages/mypage/MyCaseRoutes";
import AdminRoutes from "./pages/admin/AdminRoutes";
import ChatConsultRoutes from "./pages/chat/ChatConsultRoutes";
import PrecedentRoutes from "./pages/precedent/PrecedentRoutes";
import LawyerRoutes from "./pages/lawyer/LawyerRoutes";
import CommunityRoutes from "./pages/community/CommunityRoutes";
import QuestionRoutes from "./pages/question/QuestionRoutes";
import ConsultRoutes from "./pages/consult/ConsultRoutes";

function App() {
  return (
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
            {ConsultRoutes}
            <Route path="/" element={<Navigate to="/main" replace />} />
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
        <ChatbotButton />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
