import { Navigate, Route, Routes } from "react-router-dom";
import MainPage from "../pages/MainPage";
import LoginPage from "../pages/LoginPage";
import QuestionsListPage from "../pages/QuestionsListPage";
import QuestionNewPage from "../pages/QuestionNewPage";
import QuestionDetailPage from "../pages/QuestionDetailPage";
import QuestionEditPage from "../pages/QuestionEditPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/main.do" replace />} />
      <Route path="/main.do" element={<MainPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/questions" element={<QuestionsListPage />} />
      <Route
        path="/questions/new"
        element={
          <ProtectedRoute>
            <QuestionNewPage />
          </ProtectedRoute>
        }
      />
      <Route path="/questions/:id" element={<QuestionDetailPage />} />
      <Route
        path="/questions/:id/edit"
        element={
          <ProtectedRoute>
            <QuestionEditPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
    </Routes>
  );
}
