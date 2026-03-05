// src/pages/member/JoinTypePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinTypePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [memberType, setMemberType] = useState(null);

  const handleRoleSelect = (role) => {
    setMemberType(role);
    setStep(2);
  };

  const handleMethodSelect = (method) => {
    if (method === "form") {
      navigate(
        memberType === "PERSONAL"
          ? "/member/join/terms"
          : "/member/lawyer/terms",
      );
    } else {
      if (method === "kakao" || method === "naver")
        return alert("구글로 해주세요");
      if (method === "google")
        navigate(`/member/join/social/google?type=${memberType}`);
    }
  };

  const containerStyle = {
    maxWidth: "500px",
    margin: "80px auto",
    padding: "40px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  };
  const cardStyle = {
    padding: "25px",
    border: "1px solid #eee",
    borderRadius: "12px",
    marginBottom: "20px",
    cursor: "pointer",
  };
  const btnStyle = {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "10px",
  };

  return (
    <div style={containerStyle}>
      <h2>회원가입</h2>
      {step === 1 ? (
        <>
          <p>회원 유형을 선택해주세요.</p>
          <div style={cardStyle} onClick={() => handleRoleSelect("PERSONAL")}>
            <h3>🙋‍♂️ 일반 회원</h3>
          </div>
          <div style={cardStyle} onClick={() => handleRoleSelect("LAWYER")}>
            <h3>⚖️ 변호사 회원</h3>
          </div>
        </>
      ) : (
        <>
          <p>
            {memberType === "PERSONAL" ? "일반" : "변호사"} 가입 방식을
            선택해주세요.
          </p>
          <button
            onClick={() => handleMethodSelect("form")}
            style={{ ...btnStyle, background: "#333", color: "#fff" }}
          >
            직접 가입하기
          </button>
          <button
            onClick={() => handleMethodSelect("google")}
            style={{
              ...btnStyle,
              background: "#fff",
              border: "1px solid #ddd",
            }}
          >
            Google로 가입
          </button>
          <button
            onClick={() => handleMethodSelect("kakao")}
            style={{ ...btnStyle, background: "#FEE500" }}
          >
            카카오 가입
          </button>
          <button
            onClick={() => handleMethodSelect("naver")}
            style={{ ...btnStyle, background: "#03C75A", color: "#fff" }}
          >
            네이버 가입
          </button>
          <button
            onClick={() => setStep(1)}
            style={{
              background: "none",
              color: "#999",
              textDecoration: "underline",
              border: "none",
              cursor: "pointer",
            }}
          >
            이전으로
          </button>
        </>
      )}
    </div>
  );
};
export default JoinTypePage;
