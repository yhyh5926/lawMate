import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { questionApi } from "../../api/questionApi.js";
import { useAuthStore } from "../../store/authStore.js";
import QuestionAnswerForm from "../../components/question/questionAnswerForm.jsx";
import "../../styles/question/QuestionDetailPage.css";
import { formatDate } from "../../utils/formatDate.js";

const QuestionDetailPage = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- [인라인 수정 상태] ---
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    caseType: "",
  });

  const { user, isAuthenticated } = useAuthStore();

  // 권한 및 상태 체크 변수
  const isLawyer = isAuthenticated && user?.role === "LAWYER";
  const isOwner =
    isAuthenticated && String(user?.memberId) === String(detail?.memberId);
  const isAlreadyAdopted = detail?.status === "ADOPTED";
  const hasAnswers = detail?.answers?.length > 0;
  const hasAlreadyAnswered = detail?.answers?.some(
    (ans) => ans.lawyerId === user?.lawyerId,
  );

  const categories = [
    "민사",
    "형사",
    "가사",
    "이혼",
    "노동",
    "행정",
    "기업",
    "부동산",
    "기타",
  ];

  useEffect(() => {
    fetchDetail();
  }, [questionId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await questionApi.getQuestionDetail(questionId);
      const data = response.data.data;
      setDetail(data);
      // 수정 폼 초기값 동기화
      setEditForm({
        title: data.title,
        content: data.content,
        caseType: data.caseType,
      });
    } catch (error) {
      console.error("질문 상세 조회 실패", error);
    } finally {
      setLoading(false);
    }
  };

  // 통합 입력 핸들러
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // 질문 삭제 핸들러
  const handleDeleteQuestion = async () => {
    if (hasAnswers) {
      alert("이미 답변이 등록된 질문은 삭제할 수 없습니다.");
      return;
    }
    if (!window.confirm("정말로 이 질문을 삭제하시겠습니까?")) return;

    try {
      const res = await questionApi.deleteQuestion(questionId);
      if (res.data.success) {
        alert("삭제되었습니다.");
        navigate("/question/list");
      }
    } catch (error) {
      alert("삭제 실패: " + (error.response?.data?.message || "오류 발생"));
    }
  };

  // 수정 모드 전환
  const handleEditToggle = () => {
    if (isAlreadyAdopted) {
      alert("이미 채택된 질문은 수정할 수 없습니다.");
      return;
    }
    setIsEditing(true);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditForm({
      title: detail.title,
      content: detail.content,
      caseType: detail.caseType,
    });
    setIsEditing(false);
  };

  // 수정 제출
  const handleUpdateSubmit = async () => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const res = await questionApi.updateQuestion({
        questionId: detail.questionId,
        ...editForm,
      });
      if (res.data.success) {
        alert("수정되었습니다.");
        setIsEditing(false);
        fetchDetail();
      }
    } catch (error) {
      alert("수정 실패: " + (error.response?.data?.message || "오류 발생"));
    }
  };

  // 답변 채택 핸들러
  const handleAdopt = async (answerId, lawyerId) => {
    if (!window.confirm("이 답변을 채택하시겠습니까?")) return;
    try {
      const res = await questionApi.adoptAnswer({
        questionId: detail.questionId,
        lawyerId,
        memberId: user.memberId,
        answerId,
      });
      if (res.data.success) {
        alert("채택되었습니다!");
        fetchDetail();
      }
    } catch (error) {
      alert(error.response?.data?.message || "채택 오류 발생");
    }
  };

  if (loading)
    return (
      <div className="loading-spinner-container">데이터를 불러오는 중...</div>
    );
  if (!detail) return <div className="error-msg">질문을 찾을 수 없습니다.</div>;

  return (
    <div className="question-detail-container">
      {/* 1. 질문 카드 영역 */}
      <section className="question-card">
        <div className="question-header-top">
          {isEditing ? (
            <select
              name="caseType"
              className="edit-select"
              value={editForm.caseType}
              onChange={handleEditChange}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          ) : (
            <span className="case-type-badge">{detail.caseType}</span>
          )}
          {/* 상단 액션 버튼을 제거하여 깔끔한 헤더 유지 */}
        </div>

        {isEditing ? (
          <div className="inline-edit-form">
            <input
              name="title"
              className="edit-title-input"
              value={editForm.title}
              onChange={handleEditChange}
              placeholder="제목을 입력하세요"
            />
            <textarea
              name="content"
              className="edit-content-textarea"
              value={editForm.content}
              onChange={handleEditChange}
              placeholder="내용을 입력하세요"
            />
          </div>
        ) : (
          <>
            <h2 className="question-title">{detail.title}</h2>
            <div className="status-row">
              <div className="question-meta">
                작성자 <strong>{detail.memberName}</strong> |{" "}
                {formatDate(detail.createdAt)}
              </div>
              <div
                className={`status-badge ${isAlreadyAdopted ? "is-adopted" : "is-waiting"}`}
              >
                {isAlreadyAdopted ? "채택완료" : "답변대기"}
              </div>
            </div>
            <div className="question-content-text">{detail.content}</div>
          </>
        )}

        {/* --- [UX 개선] 수정/삭제 버튼을 본문 바로 아래로 이동 --- */}
        <div className="question-footer-actions">
          {isEditing ? (
            <div className="edit-control-group">
              <button className="action-btn save" onClick={handleUpdateSubmit}>
                저장하기
              </button>
              <button className="action-btn cancel" onClick={handleCancelEdit}>
                취소
              </button>
            </div>
          ) : (
            isOwner &&
            !isAlreadyAdopted && (
              <div className="owner-control-group">
                <button className="action-btn edit" onClick={handleEditToggle}>
                  질문 수정
                </button>
                <button
                  className="action-btn delete"
                  onClick={handleDeleteQuestion}
                >
                  질문 삭제
                </button>
              </div>
            )
          )}
        </div>
      </section>

      {/* 2. 답변 작성 (변호사 전용) */}
      {isLawyer && !hasAlreadyAnswered && !isAlreadyAdopted && (
        <section className="answer-form-section">
          <div className="form-notice">
            ⚖️ <strong>{user?.name} 변호사님</strong>, 전문적인 답변으로 도움을
            주세요.
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
              {ans.isAdopted === "Y" && (
                <div className="adopted-label">의뢰인 채택 답변</div>
              )}
              <div className="answer-header">
                <div
                  className="lawyer-profile clickable"
                  onClick={() => navigate(`/lawyer/detail/${ans.lawyerId}`)}
                >
                  <div className="lawyer-avatar-wrapper">
                    <div className="lawyer-avatar">
                      {ans.isAdopted === "Y" ? "✅" : "👨‍⚖️"}
                    </div>
                    <div className="hover-tooltip">프로필 보기</div>
                  </div>
                  <div className="lawyer-meta">
                    <div className="name-row">
                      <span className="lawyer-name">
                        {ans.lawyerName} 변호사
                      </span>
                      <span className="go-arrow">→</span>
                    </div>
                    <span className="ans-date">
                      {formatDate(ans.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="answer-body">{ans.content}</div>
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
            <p>아직 등록된 답변이 없습니다.</p>
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
