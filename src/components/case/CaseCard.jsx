import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/case/CaseCard.css";

const CaseCard = ({ caseItem }) => {
  const navigate = useNavigate();

  // 날짜 포맷 (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  return (
    <div
      className="case-card-container"
      onClick={() => navigate(`/mypage/case/detail/${caseItem.caseId}`)}
    >
      <div className="case-card-header">
        <span className="case-type-badge">{caseItem.caseType}</span>
        <span className="case-date">{formatDate(caseItem.createdAt)}</span>
      </div>

      <h3 className="case-title">{caseItem.title}</h3>

      <div className="case-card-footer">
        <div className="case-status-wrapper">
          <span className="status-label">진행 단계</span>
          <span className="status-value">{caseItem.step}</span>
        </div>
        <div className="case-arrow">→</div>
      </div>
    </div>
  );
};

export default CaseCard;
