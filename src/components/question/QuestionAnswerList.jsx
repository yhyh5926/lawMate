import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QuestionAnswerEditForm from "./QuestionAnswerEditForm.jsx";
import { formatDate } from "../../utils/formatDate.js";
import { baseURL } from "../../constants/baseURL.js";
import { answerApi } from "../../api/answerApi.js";
import "../../styles/question/QuestionAnswerList.css";
import { getOrCreateChatRoom } from "../../api/chatApi.js";

const QuestionAnswerList = ({
  questionId,
  user,
  isQuestionOwner,
  isAlreadyAdopted,
  onAdoptSuccess,
}) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState(null);

  const fetchAnswers = useCallback(async () => {
    if (!questionId) return;
    try {
      setLoading(true);
      const res = await answerApi.getAnswersByQuestionId(questionId);
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

  const handleAdoptAction = async (answerId, lawyerId) => {
    if (
      !window.confirm(
        "이 답변을 채택하시겠습니까?\n채택 후에는 변경할 수 없습니다.",
      )
    )
      return;
    try {
      const res = await answerApi.adoptAnswer({
        questionId,
        answerId,
        lawyerId,
      });
      if (res.data.success) {
        alert("채택되었습니다!");
        fetchAnswers();
        onAdoptSuccess();
      }
    } catch (error) {
      alert("채택 처리 중 오류가 발생했습니다.", error);
    }
  };

  const handleDeleteAction = async (answerId, isAdopted) => {
    if (isAdopted === "Y") {
      alert("채택된 답변은 삭제할 수 없습니다.");
      return;
    }
    if (!window.confirm("정말 이 답변을 삭제하시겠습니까?")) return;
    try {
      const res = await answerApi.deleteAnswer(answerId);
      if (res.data.success) {
        alert("답변이 삭제되었습니다.");
        fetchAnswers();
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "삭제 처리 중 오류가 발생했습니다.";
      alert(errMsg);
    }
  };

  if (loading && answers.length === 0)
    return <div className="loading-text">답변 로딩 중...</div>;
  if (!answers || answers.length === 0)
    return <div className="empty-answer">아직 등록된 답변이 없습니다.</div>;

  return (
    <div className="answers-wrapper">
      <h3 className="section-title">
        전문가 답변 <span className="count-badge">{answers.length}</span>
      </h3>

      {answers.map((ans) => {
        const adoptRate =
          ans.answerCnt > 0
            ? ((ans.adoptCnt / ans.answerCnt) * 100).toFixed(1)
            : 0;
        const isAuthor = user && Number(user.memberId) === Number(ans.memberId);

        return (
          <div
            key={ans.answerId}
            className={`answer-card ${ans.isAdopted === "Y" ? "adopted-card" : ""}`}
          >
            {ans.isAdopted === "Y" && (
              <div className="adopted-ribbon">🏆 채택된 답변</div>
            )}

            <div className="answer-header">
              {/* 변호사 프로필 섹션: 클릭 직관성 강화 */}
              <div
                className="lawyer-profile-box"
                onClick={() => navigate(`/lawyer/detail/${ans.lawyerId}`)}
                title={`${ans.lawyerName} 변호사 프로필 보기`}
              >
                <div className="lawyer-avatar">
                  {ans.lawyerProfile ? (
                    <img
                      src={baseURL + ans.lawyerProfile}
                      alt={ans.lawyerName}
                      className="lawyer-img"
                    />
                  ) : (
                    <div className="default-avatar">👨‍⚖️</div>
                  )}
                  <div className="view-profile-overlay">프로필 보기</div>
                </div>

                <div className="lawyer-info">
                  <div className="name-row">
                    <span className="lawyer-name">{ans.lawyerName} 변호사</span>
                    {ans.officeName && (
                      <span className="office-name">{ans.officeName}</span>
                    )}
                  </div>
                  <div className="stats-row">
                    <span className="badge-gold">
                      채택 {ans.adoptCnt || 0}건
                    </span>
                    <span className="badge-navy">채택률 {adoptRate}%</span>
                    {ans.specialty && (
                      <span className="specialty-text">
                        #{ans.specialty.split(",")[0]}
                      </span>
                    )}
                    <span className="ans-date">
                      {formatDate(ans.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {isAuthor && ans.isAdopted !== "Y" && (
                <div className="mgmt-actions">
                  <button
                    className="btn-text"
                    onClick={() => setEditingAnswerId(ans.answerId)}
                  >
                    수정
                  </button>
                  <button
                    className="btn-text delete"
                    onClick={() =>
                      handleDeleteAction(ans.answerId, ans.isAdopted)
                    }
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>

            <div className="answer-content-area">
              {editingAnswerId === ans.answerId ? (
                <QuestionAnswerEditForm
                  answerId={ans.answerId}
                  initialContent={ans.content}
                  onSaveSuccess={() => {
                    setEditingAnswerId(null);
                    fetchAnswers();
                  }}
                  onCancel={() => setEditingAnswerId(null)}
                />
              ) : (
                <>
                  <div className="content-text">{ans.content}</div>
                  {ans.isAdopted === "Y" && (
                    <div className="action-guide-box">
                      <p className="guide-msg">
                        변호사님과 직접 상담을 해보세요!
                      </p>
                      <div className="action-buttons">
                        <button
                          className="btn-navy"
                          onClick={async () => {
                            try {
                              const res = await getOrCreateChatRoom(
                                ans.memberId,
                              );
                              navigate(
                                `/chat/room?roomNo=${res.data?.data?.roomNo}`,
                              );
                            } catch (error) {
                              alert("연결 실패", error);
                            }
                          }}
                        >
                          💬 실시간 채팅 상담
                        </button>
                        <button
                          className="btn-gold"
                          onClick={() =>
                            navigate(
                              `/consult/reserve?lawyerId=${ans.lawyerId}`,
                            )
                          }
                        >
                          📅 방문/전화 예약
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {isQuestionOwner && !isAlreadyAdopted && ans.isAdopted !== "Y" && (
              <div className="adopt-footer">
                <button
                  className="btn-adopt-outline"
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
