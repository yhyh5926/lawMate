// vs코드
// 파일 위치: src/components/case/CaseCard.jsx
// 설명: 마이페이지 내 사건 목록에서 사건 하나를 표시하는 요약 카드 UI

import React from "react";
import { useNavigate } from "react-router-dom";

const CaseCard = ({ caseItem }) => {
  const navigate = useNavigate();

  // 날짜 포맷 (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };

  return (
    <div 
      style={styles.card} 
      onClick={() => navigate(`/mypage/case/detail.do/${caseItem.caseId}`)}
    >
      <div style={styles.header}>
        <span style={styles.typeBadge}>{caseItem.caseType}</span>
        <span style={styles.date}>{formatDate(caseItem.createdAt)}</span>
      </div>
      <h3 style={styles.title}>{caseItem.title}</h3>
      <div style={styles.footer}>
        <span style={styles.status}>현재 단계: <strong>{caseItem.step}</strong></span>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ddd", borderRadius: "8px", padding: "16px", marginBottom: "12px",
    cursor: "pointer", transition: "box-shadow 0.2s", backgroundColor: "#fff"
  },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  typeBadge: { backgroundColor: "#e9ecef", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" },
  date: { color: "#888", fontSize: "12px" },
  title: { margin: "0 0 10px 0", fontSize: "16px" },
  footer: { borderTop: "1px solid #eee", paddingTop: "10px", fontSize: "14px", color: "#555" }
};

export default CaseCard;