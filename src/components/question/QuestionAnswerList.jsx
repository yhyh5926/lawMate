import React from "react";
import { useNavigate } from "react-router-dom";
import QuestionAnswerEditForm from "./QuestionAnswerEditForm.jsx";
import { formatDate } from "../../utils/formatDate.js";
import { baseURL } from "../../constants/baseURL.js";
import "../../styles/question/QuestionAnswerList.css";

const QuestionAnswerList = ({
  answers,
  isOwner,
  isAlreadyAdopted,
  editingAnswerId,
  setEditingAnswerId,
  handleAdopt,
  fetchDetail,
}) => {
  const navigate = useNavigate();

  if (!answers || answers.length === 0) {
    return <div className="empty-answer">아직 등록된 답변이 없습니다.</div>;
  }

  return (
    <div className="answers-wrapper">
      {answers.map((ans) => (
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
              title={`${ans.lawyerName} 변호사 프로필 보기`}
            >
              {/* 🖼️ 변호사 프로필 이미지 (VO 필드명: lawyerProfile) */}
              <div className="lawyer-avatar">
                {ans.lawyerProfile ? (
                  <img
                    src={baseURL + ans.lawyerProfile}
                    alt={ans.lawyerName}
                    className="lawyer-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default-lawyer.png";
                    }}
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
                  {/* 💡 소속 사무소 정보 추가 */}
                  {ans.officeName && (
                    <span className="office-name">{ans.officeName}</span>
                  )}
                </div>

                <div className="lawyer-info-sub">
                  {/* 💡 전문 분야 정보 추가 */}
                  {ans.specialty && (
                    <span className="specialty-badge">#{ans.specialty}</span>
                  )}
                  <span className="ans-date">{formatDate(ans.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {editingAnswerId === ans.answerId ? (
            <QuestionAnswerEditForm
              answerId={ans.answerId}
              initialContent={ans.content}
              onSaveSuccess={() => {
                setEditingAnswerId(null);
                fetchDetail();
              }}
              onCancel={() => setEditingAnswerId(null)}
            />
          ) : (
            <div className="answer-body">{ans.content}</div>
          )}

          {isOwner && !isAlreadyAdopted && ans.isAdopted !== "Y" && (
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
      ))}
    </div>
  );
};

export default QuestionAnswerList;
