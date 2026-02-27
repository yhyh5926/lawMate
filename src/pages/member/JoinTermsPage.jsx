// vs코드
// 파일 위치: src/pages/member/JoinTermsPage.jsx
// 설명: 일반 회원가입 약관 동의 화면

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";

const JoinTermsPage = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleNext = () => {
    if (!agreed) return alert("필수 약관에 동의해주세요.");
    navigate("/member/join/form.do");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <JoinStepIndicator currentStep={1} />
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>일반회원 약관 동의</h2>
      
      <div style={{ border: "1px solid #ddd", padding: "15px", height: "150px", overflowY: "scroll", marginBottom: "10px", backgroundColor: "#f9f9f9", fontSize: "14px" }}>
        <strong>제 1 조 (목적)</strong><br />
        이 약관은 LawMate(이하 "회사")가 제공하는 서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        <br /><br />
        <strong>제 2 조 (개인정보 수집)</strong><br />
        회사는 원활한 서비스 제공을 위해 최소한의 개인정보를 수집하고 있습니다.
      </div>
      
      <label style={{ display: "block", marginBottom: "30px", fontSize: "15px", cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginRight: "10px" }} />
        (필수) 서비스 이용약관 및 개인정보 처리방침에 동의합니다.
      </label>
      
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => navigate(-1)} style={{ flex: 1, padding: "12px", border: "1px solid #ccc", background: "#fff", borderRadius: "4px" }}>취소</button>
        <button onClick={handleNext} style={{ flex: 1, padding: "12px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px" }}>다음</button>
      </div>
      
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <Link to="/member/lawyer/terms.do" style={{ color: "#28a745", fontWeight: "bold", textDecoration: "none" }}>
          👨‍⚖️ 변호사이신가요? 전문회원 가입하기
        </Link>
      </div>
    </div>
  );
};

export default JoinTermsPage;