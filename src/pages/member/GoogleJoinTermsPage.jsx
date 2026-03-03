// src/pages/member/GoogleJoinTermsPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";

const GoogleJoinTermsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const memberType = queryParams.get("type") || "PERSONAL"; 
  const [agreed, setAgreed] = useState(false);

  const handleNext = () => {
    if (!agreed) return alert("필수 약관에 동의해주세요.");
    navigate(`/member/join/social/google.do?type=${memberType}`);
  };

  const termBoxStyle = { height: "200px", overflowY: "scroll", border: "1px solid #ddd", padding: "15px", backgroundColor: "#f9f9f9", marginBottom: "15px", fontSize: "14px", lineHeight: "1.6" };

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto", padding: "20px" }}>
      <JoinStepIndicator currentStep={1} />
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Google {memberType === "PERSONAL" ? "일반회원" : "전문회원"} 약관 동의</h2>
      <div style={termBoxStyle}><h3>제 1 조 (목적)</h3><p>본 약관은 LawMate가 제공하는 구글 소셜 회원가입 서비스 이용에 관한 권리와 의무를 규정합니다.</p></div>
      <div style={{ marginBottom: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
        <input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        <label htmlFor="agree" style={{ fontSize: "14px" }}>(필수) 구글 회원가입 서비스 및 개인정보 수집에 동의합니다.</label>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => navigate(-1)} style={{ flex: 1, padding: "15px", backgroundColor: "#ccc", border: "none", borderRadius: "4px" }}>취소</button>
        <button onClick={handleNext} style={{ flex: 1, padding: "15px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold" }}>다음</button>
      </div>
    </div>
  );
};
export default GoogleJoinTermsPage;