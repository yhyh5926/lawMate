// vs코드
// 파일 위치: src/pages/member/LawyerJoinCompletePage.jsx
// 설명: 전문 회원가입 완료 및 승인 대기 안내 화면

import React from "react";
import { useNavigate } from "react-router-dom";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";

const LawyerJoinCompletePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", textAlign: "center" }}>
      <JoinStepIndicator currentStep={3} />
      <div style={{ padding: "40px 0" }}>
        <h2 style={{ color: "#28a745", marginBottom: "15px" }}>가입 신청이 완료되었습니다.</h2>
        <p style={{ color: "#555", lineHeight: "1.6" }}>
          전문회원은 <strong>관리자 승인 후</strong> 정상적인 서비스 이용이 가능합니다.<br/>
          제출해주신 정보를 바탕으로 신속하게 검토 후 안내해 드리겠습니다.
        </p>
      </div>
      <button 
        onClick={() => navigate("/main.do")} 
        style={{ padding: "12px 30px", backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "4px", fontSize: "16px", cursor: "pointer" }}
      >
        메인으로 이동
      </button>
    </div>
  );
};

export default LawyerJoinCompletePage;