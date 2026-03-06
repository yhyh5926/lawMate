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

  // 권한 및 상태 체크
  const isLawyer = isAuthenticated && user?.role === "LAWYER";
  const isOwner = isAuthenticated && user?.memberId === detail?.memberId;
  const isAlreadyAdopted = detail?.status === "ADOPTED";

  // 현재 로그인한 변호사의 답변 여부
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
      // 가상 데이터 (개발용)
      setDetail({
        questionId,
        title: "데이터를 불러올 수 없습니다.",
        content: "상세 내용을 불러오는 중 오류가 발생했습니다.",
        caseType: "-",
        status: "WAITING",
        memberName: "알 수 없음",
        createdAt: "-",
        answers: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdopt = async (answerId, lawyerId) => {
    if (
      !window.confirm(
        "이 답변을 채택하시겠습니까?\n채택 후에는 변경할 수 없습니다.",
      )
    )
      return;

    try {
      const res = await questionApi.adoptAnswer({
        questionId: detail.questionId,
        lawyerId: lawyerId,
        memberId: user.memberId,
        answerId: answerId,
      });

      if (res.data.success) {
        alert("채택이 완료되었습니다!");
        fetchDetail();
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "채택 처리 중 오류가 발생했습니다.",
      );
    }
  };

  if (loading) return <div className="loading-spinner">불러오는 중...</div>;
  if (!detail) return <div className="error-msg">질문을 찾을 수 없습니다.</div>;

  return (
    <div className="question-detail-container">
      {/* 1. 질문 카드 섹션 */}
      <div className="question-card">
        <div className="question-header">
          <h2 className="question-title">{detail.title}</h2>
          <span className="case-type-badge">{detail.caseType}</span>
        </div>

        <div className="question-meta">
          <span>
            작성자: <strong>{detail.memberName}</strong>
          </span>
          <span>작성일: {detail.createdAt}</span>
          <span
            className={`status-indicator ${isAlreadyAdopted ? "text-success" : "text-warning"}`}
          >
            ● {isAlreadyAdopted ? "채택완료" : "채택대기"}
          </span>
        </div>

        <p className="question-content">{detail.content}</p>
      </div>

      {/* 2. 답변 작성 섹션 (변호사 전용) */}
      {isLawyer && !hasAlreadyAnswered && !isAlreadyAdopted && (
        <div className="answer-form-wrapper">
          <QuestionAnswerForm
            questionId={questionId}
            onAnswerSuccess={fetchDetail}
          />
        </div>
      )}

      {/* 3. 답변 리스트 섹션 */}
      <h3 className="section-title">
        변호사 답변{" "}
        <span className="count-badge">{detail.answers?.length || 0}</span>
      </h3>

      <div className="answers-list">
        {detail.answers && detail.answers.length > 0 ? (
          detail.answers.map((ans) => (
            <div
              key={ans.answerId}
              className={`answer-box ${ans.isAdopted === "Y" ? "adopted-border" : ""}`}
            >
              <div className="answer-header">
                <div className="lawyer-info">
                  <span className="lawyer-icon">
                    {ans.isAdopted === "Y" ? "🏆" : "👨‍⚖️"}
                  </span>
                  <span className="lawyer-name">{ans.lawyerName} 변호사</span>
                  {ans.isAdopted === "Y" && (
                    <span className="pt-badge">의뢰인 채택 답변</span>
                  )}
                </div>
                <span className="answer-date">{ans.createdAt}</span>
              </div>

              <p className="answer-content">{ans.content}</p>

              {/* 채택 버튼 (작성자 본인 & 미채택 상태일 때만) */}
              {isOwner && !isAlreadyAdopted && (
                <div className="adopt-btn-wrapper">
                  <button
                    className="adopt-action-btn"
                    onClick={() => handleAdopt(ans.answerId, ans.lawyerId)}
                  >
                    이 답변 채택하기
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-answer-container">
            <p>아직 등록된 답변이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 4. 하단 푸터 (목록으로 이동) */}
      <div className="detail-footer">
        <button className="back-list-btn-bottom" onClick={() => navigate(-1)}>
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
