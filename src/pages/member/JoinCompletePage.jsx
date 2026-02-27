// vs코드
// 파일 위치: src/pages/member/JoinCompletePage.jsx
// 설명: 일반 회원가입 완료 안내 화면

import React from "react";
import { useNavigate } from "react-router-dom";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";

const JoinCompletePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", textAlign: "center" }}>
      <JoinStepIndicator currentStep={3} />
      <div style={{ padding: "40px 0" }}>
        <h2 style={{ color: "#007BFF", marginBottom: "15px" }}>가입이 완료되었습니다! 🎉</h2>
        <p style={{ color: "#555", lineHeight: "1.6" }}>
          LawMate의 회원이 되신 것을 진심으로 환영합니다.<br/>
          지금 바로 로그인하여 다양한 법률 서비스를 이용해 보세요.
        </p>
      </div>
      <button 
        onClick={() => navigate("/member/login.do")} 
        style={{ padding: "12px 30px", backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "4px", fontSize: "16px", cursor: "pointer" }}
      >
        로그인 페이지로 이동
      </button>
    </div>
  );
};

export default JoinCompletePage;