import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QuestionAnswerEditForm from "./QuestionAnswerEditForm.jsx";
import { formatDate } from "../../utils/formatDate.js";
import { baseURL } from "../../constants/baseURL.js";
import { questionApi } from "../../api/questionApi.js"; // 💡 답변 조회를 위한 API 호출 추가
import "../../styles/question/QuestionAnswerList.css";

const QuestionAnswerList = ({
  questionId, // 💡 부모로부터 ID만 받음
  isOwner,
  isAlreadyAdopted,
  onAdoptSuccess, // 💡 채택 성공 시 부모(상세페이지)의 상태를 '채택완료'로 바꾸기 위한 콜백
}) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState(null);

  // 1. 답변 목록 가져오기
  const fetchAnswers = useCallback(async () => {
    if (!questionId) return;
    try {
      setLoading(true);
      const res = await questionApi.getAnswersByQuestionId(questionId);
      // 서버 응답 구조에 따라 res.data 혹은 res.data.data로 조정하세요.
      setAnswers(res.data.data || []);
    } catch (error) {
      console.error("답변 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    fetchAnswers();
  }, [fetchAnswers]);

  // 2. 답변 채택 핸들러 (컴포넌트 내부로 이동)
  const handleAdoptAction = async (answerId, lawyerId) => {
    if (
      !window.confirm(
        "이 답변을 채택하시겠습니까?\n채택 후에는 변경할 수 없습니다.",
      )
    )
      return;
    try {
      const res = await questionApi.adoptAnswer({
        questionId,
        answerId,
        lawyerId,
      });
      if (res.data.success) {
        alert("채택되었습니다!");
        fetchAnswers(); // 리스트 새로고침
        onAdoptSuccess(); // 부모 페이지의 '채택대기' 배지를 '채택완료'로 갱신
      }
    } catch (error) {
      alert("채택 처리 중 오류가 발생했습니다.");
    }
  };

  if (loading && answers.length === 0)
    return <div className="loading-text">답변 로딩 중...</div>;
  if (!answers || answers.length === 0)
    return <div className="empty-answer">아직 등록된 답변이 없습니다.</div>;

  return (
    <div className="answers-wrapper">
      <h3 className="section-title">
        변호사 답변 <span className="count-badge">{answers.length}</span>
      </h3>

      {answers.map((ans) => {
        // 채택률 계산
        const adoptRate =
          ans.answerCnt > 0
            ? ((ans.adoptCnt / ans.answerCnt) * 100).toFixed(1)
            : 0;

        return (
          <div
            key={ans.answerId}
            className={`answer-item ${ans.isAdopted === "Y" ? "selected-answer" : ""}`}
          >
            {/* 채택 라벨 */}
            {ans.isAdopted === "Y" && (
              <div className="adopted-label">🏆 의뢰인 채택 답변</div>
            )}

            <div className="answer-header">
              <div
                className="lawyer-profile clickable"
                onClick={() => navigate(`/lawyer/detail/${ans.lawyerId}`)}
              >
                <div className="lawyer-avatar">
                  {ans.lawyerProfile ? (
                    <img
                      src={baseURL + ans.lawyerProfile}
                      alt={ans.lawyerName}
                      className="lawyer-img"
                    />
                  ) : (
                    <div className="default-avatar-text">
                      {ans.isAdopted === "Y" ? "✅" : "👨‍⚖️"}
                    </div>
                  )}
                </div>

                <div className="lawyer-meta">
                  <div className="lawyer-info-main">
                    <span className="lawyer-name">{ans.lawyerName} 변호사</span>
                    {ans.officeName && (
                      <span className="office-name">{ans.officeName}</span>
                    )}
                  </div>

                  <div className="lawyer-info-sub">
                    <span className="stats-badge adopt-count">
                      채택 {ans.adoptCnt || 0}건
                    </span>
                    <span
                      className={`stats-badge adopt-rate ${adoptRate >= 80 ? "high-rate" : ""}`}
                    >
                      채택률 {adoptRate}%
                    </span>
                    {ans.specialty && (
                      <span className="specialty-badge">#{ans.specialty}</span>
                    )}
                    <span className="ans-date">
                      {formatDate(ans.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 답변 본문 및 수정 폼 */}
            {editingAnswerId === ans.answerId ? (
              <QuestionAnswerEditForm
                answerId={ans.answerId}
                initialContent={ans.content}
                onSaveSuccess={() => {
                  setEditingAnswerId(null);
                  fetchAnswers(); // 수정 후 리스트만 갱신
                }}
                onCancel={() => setEditingAnswerId(null)}
              />
            ) : (
              <div className="answer-body">
                <div className="content-text">{ans.content}</div>

                {/* ✅ 채택 시 노출되는 채팅/상담 버튼 */}
                {ans.isAdopted === "Y" && (
                  <div className="adopted-special-actions">
                    <p className="action-guide-text">
                      변호사님과 바로 상담을 시작해보세요!
                    </p>
                    <div className="action-button-group">
                      <button
                        className="btn-chat-primary"
                        onClick={() =>
                          navigate(`/chat/room?lawyerId=${ans.lawyerId}`)
                        }
                      >
                        💬 1:1 실시간 채팅
                      </button>
                      <button
                        className="btn-consult-secondary"
                        onClick={() =>
                          navigate(`/consult/apply/${ans.lawyerId}`)
                        }
                      >
                        📅 상담 예약하기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 의뢰인용 채택 버튼 */}
            {isOwner && !isAlreadyAdopted && ans.isAdopted !== "Y" && (
              <div className="adopt-action-area">
                <button
                  className="btn-adopt"
                  onClick={() => handleAdoptAction(ans.answerId, ans.lawyerId)}
                >
                  이 답변 채택하기
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionAnswerList;
