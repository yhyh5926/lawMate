import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { questionApi } from "../../api/questionApi.js";
import { useAuthStore } from "../../store/authStore.js";

import "../../styles/question/QuestionDetailPage.css";
import QuestionAnswerForm from "../../components/question/questionAnswerForm.jsx";

const QuestionDetailPage = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated } = useAuthStore();

  // 변호사 여부 확인
  const isLawyer = isAuthenticated && user?.role === "LAWYER";

  // 💡 현재 로그인한 변호사가 이미 이 질문에 답변을 달았는지 확인 (중복 답변 방지)
  const hasAlreadyAnswered = detail?.answers?.some(
    (ans) => ans.lawyerId === user?.lawyerId,
  );

  useEffect(() => {
    fetchDetail();
  }, [questionId]);

  const fetchDetail = async () => {
    try {
      const response = await questionApi.getQuestionDetail(questionId);
      setDetail(response.data.data);
    } catch (error) {
      console.error("질문 상세 조회 실패", error);
      // 백엔드 연동 전 테스트용 데이터 구조
      setDetail({
        questionId,
        title: "전세금 반환 관련 문의",
        content: "내용...",
        caseType: "민사",
        status: "WAITING",
        createdAt: "2026-03-03",
        answers: [], // 💡 배열 구조로 관리
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">불러오는 중...</div>;
  if (!detail) return <div className="error-msg">질문을 찾을 수 없습니다.</div>;

  return (
    <div className="question-detail-container">
      <button className="back-list-btn" onClick={() => navigate(-1)}>
        ← 목록으로 돌아가기
      </button>

      {/* 질문 카드 */}
      <div className="question-card">
        <div className="question-header">
          <h2 className="question-title">{detail.title}</h2>
          <span className="case-type-badge">{detail.caseType}</span>
        </div>

        <div className="question-meta">
          <span>작성일: {detail.createdAt}</span>
          <span className="status-indicator">
            상태:{" "}
            <span
              className={
                detail.status === "ANSWERED"
                  ? "status-answered"
                  : "status-waiting"
              }
            >
              {detail.status === "ANSWERED" ? "답변완료" : "답변대기"}
            </span>
          </span>
        </div>

        <p className="question-content">{detail.content}</p>
      </div>

      {/* 💡 답변 작성 폼: 변호사이고 아직 답변을 달지 않았을 때만 노출 */}
      {isLawyer && !hasAlreadyAnswered && (
        <QuestionAnswerForm
          questionId={questionId}
          onAnswerSuccess={fetchDetail}
        />
      )}

      <h3 className="section-title">
        변호사 답변 ({detail.answers?.length || 0})
      </h3>

      {/* 💡 답변 리스트 렌더링 */}
      {detail.answers && detail.answers.length > 0 ? (
        detail.answers.map((ans) => (
          <div
            key={ans.answerId}
            className="answer-box"
            style={{ marginBottom: "20px" }}
          >
            <div className="answer-header">
              <div className="lawyer-info">
                <span>👨‍⚖️</span> {ans.lawyerName} 변호사
                {ans.isAdopted === "Y" && (
                  <span className="adopt-badge">채택됨</span>
                )}
              </div>
              <span className="answer-date">{ans.createdAt}</span>
            </div>
            <p className="answer-content">{ans.content}</p>
          </div>
        ))
      ) : (
        <div className="no-answer-container">
          <span className="no-answer-icon">📄</span>
          {isLawyer
            ? "아직 등록된 답변이 없습니다. 전문가님의 지식을 나눠주세요!"
            : "아직 등록된 답변이 없습니다. 변호사님이 답변을 검토 중입니다."}
        </div>
      )}
    </div>
  );
};

export default QuestionDetailPage;
