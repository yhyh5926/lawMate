// vs코드
// 파일 위치: src/pages/member/LawyerJoinTermsPage.jsx
// 설명: 전문(변호사) 회원가입 약관 동의 화면

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";

const LawyerJoinTermsPage = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleNext = () => {
    if (!agreed) return alert("필수 약관에 동의해주세요.");
    navigate("/member/lawyer/form.do");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <JoinStepIndicator currentStep={1} />
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>전문회원 약관 동의</h2>
      
      <div style={{ border: "1px solid #ddd", padding: "15px", height: "150px", overflowY: "scroll", marginBottom: "10px", backgroundColor: "#f9f9f9", fontSize: "14px" }}>
        <strong>제 1 조 (목적 및 자격)</strong><br />
        전문회원은 대한변호사협회에 등록된 변호사만이 가입할 수 있으며, 가입 시 관리자의 승인 절차를 거쳐야 합니다.
        <br /><br />
        <strong>제 2 조 (의무)</strong><br />
        전문회원은 플랫폼을 통해 정확한 법률 정보를 제공해야 할 의무가 있습니다.
      </div>
      
      <label style={{ display: "block", marginBottom: "30px", fontSize: "15px", cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginRight: "10px" }} />
        (필수) 전문회원 이용약관 및 운영정책에 동의합니다.
      </label>
      
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => navigate(-1)} style={{ flex: 1, padding: "12px", border: "1px solid #ccc", background: "#fff", borderRadius: "4px" }}>취소</button>
        <button onClick={handleNext} style={{ flex: 1, padding: "12px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px" }}>다음</button>
      </div>
    </div>
  );
};

export default LawyerJoinTermsPage;