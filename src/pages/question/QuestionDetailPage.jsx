import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { questionApi } from "../../api/questionApi.js";
import { useAuthStore } from "../../store/authStore.js";
import QuestionAnswerForm from "../../components/question/questionAnswerForm.jsx";
import "../../styles/question/QuestionDetailPage.css";

const QuestionDetailPage = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated } = useAuthStore();

  // 권한 및 상태 체크 로직
  const isLawyer = isAuthenticated && user?.role === "LAWYER";
  const isOwner =
    isAuthenticated && String(user?.memberId) === String(detail?.memberId);
  const isAlreadyAdopted = detail?.status === "ADOPTED";
  const hasAlreadyAnswered = detail?.answers?.some(
    (ans) => ans.lawyerId === user?.lawyerId,
  );

  useEffect(() => {
    fetchDetail();
  }, [questionId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await questionApi.getQuestionDetail(questionId);
      setDetail(response.data.data);
    } catch (error) {
      console.error("질문 상세 조회 실패", error);
      setDetail({
        questionId,
        title: "데이터를 불러올 수 없습니다.",
        content: "상세 내용을 불러오는 중 오류가 발생했습니다.",
        caseType: "-",
        status: "WAITING",
        memberName: "알 수 없음",
        createdAt: new Date().toISOString(),
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

  // 날짜 포맷팅 (예: 2026년 3월 6일 오후 06:30)
  const formatDate = (dateString) => {
    if (!dateString || dateString === "-") return "-";
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString));
  };

  if (loading)
    return (
      <div className="loading-spinner-container">
        상세 내용을 불러오는 중입니다...
      </div>
    );
  if (!detail) return <div className="error-msg">질문을 찾을 수 없습니다.</div>;

  return (
    <div className="question-detail-container">
      {/* 1. 질문 카드 영역 */}
      <section className="question-card">
        <div className="question-header">
          <div className="title-group">
            <span className="case-type-badge">{detail.caseType}</span>
            <h2 className="question-title">{detail.title}</h2>
          </div>
          <div
            className={`status-badge ${isAlreadyAdopted ? "is-adopted" : "is-waiting"}`}
          >
            {isAlreadyAdopted ? "채택완료" : "답변대기"}
          </div>
        </div>

        <div className="question-meta">
          <span className="meta-item">
            작성자 <strong>{detail.memberName}</strong>
          </span>
          <span className="meta-divider">|</span>
          <span className="meta-item">{formatDate(detail.createdAt)}</span>
        </div>

        <div className="question-content-text">{detail.content}</div>
      </section>

      {/* 2. 답변 작성 (변호사 전용 & 미작성 시) */}
      {isLawyer && !hasAlreadyAnswered && !isAlreadyAdopted && (
        <section className="answer-form-section">
          <div className="form-notice">
            ⚖️ <strong>{user?.name} 변호사님</strong>, 전문적인 답변으로
            의뢰인에게 도움을 주세요.
          </div>
          <QuestionAnswerForm
            questionId={questionId}
            onAnswerSuccess={fetchDetail}
          />
        </section>
      )}

      {/* 3. 답변 리스트 영역 */}
      <h3 className="section-title">
        변호사 답변{" "}
        <span className="count-badge">{detail.answers?.length || 0}</span>
      </h3>

      <div className="answers-wrapper">
        {detail.answers && detail.answers.length > 0 ? (
          detail.answers.map((ans) => (
            <div
              key={ans.answerId}
              className={`answer-item ${ans.isAdopted === "Y" ? "selected-answer" : ""}`}
            >
              {/* 채택 문구 수정 */}
              {ans.isAdopted === "Y" && (
                <div className="adopted-label">의뢰인 채택 답변</div>
              )}

              <div className="answer-header">
                <div className="lawyer-profile">
                  <div className="lawyer-avatar">
                    {ans.isAdopted === "Y" ? "✅" : "👨‍⚖️"}
                  </div>
                  <div className="lawyer-meta">
                    <span className="lawyer-name">{ans.lawyerName} 변호사</span>
                    <span className="ans-date">
                      {formatDate(ans.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="answer-body">{ans.content}</div>

              {/* 채택 버튼 (질문 작성자 전용) */}
              {isOwner && !isAlreadyAdopted && (
                <div className="adopt-action-area">
                  <button
                    className="btn-adopt"
                    onClick={() => handleAdopt(ans.answerId, ans.lawyerId)}
                  >
                    답변 채택하기
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-answer">
            <div className="empty-icon">💬</div>
            <p>
              아직 등록된 답변이 없습니다.
              <br />
              전문 변호사가 내용을 검토 중입니다.
            </p>
          </div>
        )}
      </div>

      <div className="footer-nav">
        <button
          className="btn-back-list"
          onClick={() => navigate("/question/list")}
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
