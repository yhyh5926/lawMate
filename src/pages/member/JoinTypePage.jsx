// src/pages/member/JoinTypePage.jsx
/**
 * 파일 위치: src/pages/member/JoinTypePage.jsx
 * 기능: [1단계: 일반/변호사 선택] -> [2단계: 직접가입/간편가입 선택] 흐름을 구현했습니다.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinTypePage = () => {
  const navigate = useNavigate();
  // step 1: 유형 선택(null, 'PERSONAL', 'LAWYER'), step 2: 방식 선택으로 진행
  const [step, setStep] = useState(1);
  const [memberType, setMemberType] = useState(null);

  // 1단계: 회원 유형 선택 핸들러
  const handleRoleSelect = (role) => {
    setMemberType(role);
    setStep(2);
  };

  // 2단계: 가입 방식 선택 핸들러
  const handleMethodSelect = (method) => {
    if (method === "form") {
      // 일반/변호사에 따라 각각의 약관 페이지로 이동
      const path = memberType === "PERSONAL" ? "/member/join/terms.do" : "/member/lawyer/terms.do";
      navigate(path);
    } else {
      // 간편 가입(소셜) 선택 시 알림 또는 이동
      if (method === "kakao" || method === "naver") {
        alert("구글로 해주세요"); // 💡 요청하신 안내 문구
        return;
      }
      if (method === "google") {
        // 구글 상세 가입 페이지로 이동 (memberType을 쿼리 스트링 등으로 전달 가능)
        navigate(`/member/join/social/google.do?type=${memberType}`);
      }
    }
  };

  const containerStyle = { maxWidth: "500px", margin: "80px auto", padding: "40px", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", textAlign: "center" };
  const cardStyle = { padding: "25px", border: "1px solid #eee", borderRadius: "12px", marginBottom: "20px", cursor: "pointer", transition: "0.3s", textAlign: "left" };
  const socialBtnStyle = { width: "100%", padding: "14px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", marginBottom: "10px", fontSize: "14px" };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: "10px", fontWeight: "bold" }}>회원가입</h2>
      
      {step === 1 ? (
        <>
          <p style={{ color: "#777", marginBottom: "40px", fontSize: "15px" }}>가입하실 회원 유형을 선택해주세요.</p>
          <div 
            style={cardStyle} 
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#007BFF"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#eee"}
            onClick={() => handleRoleSelect("PERSONAL")}
          >
            <h3 style={{ fontSize: "18px", margin: "0 0 5px 0" }}>🙋‍♂️ 일반 회원</h3>
            <p style={{ fontSize: "13px", color: "#999", margin: 0 }}>서비스를 이용하려는 일반 사용자입니다.</p>
          </div>
          <div 
            style={cardStyle} 
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#28a745"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#eee"}
            onClick={() => handleRoleSelect("LAWYER")}
          >
            <h3 style={{ fontSize: "18px", margin: "0 0 5px 0" }}>⚖️ 변호사 회원</h3>
            <p style={{ fontSize: "13px", color: "#999", margin: 0 }}>전문 자격을 인증하고 활동하는 변호사입니다.</p>
          </div>
        </>
      ) : (
        <>
          <p style={{ color: "#777", marginBottom: "40px", fontSize: "15px" }}>
            {memberType === "PERSONAL" ? "일반 회원" : "변호사 회원"}의 가입 방식을 선택해주세요.
          </p>
          
          <button 
            onClick={() => handleMethodSelect("form")}
            style={{ ...socialBtnStyle, background: "#333", color: "#fff", height: "50px", fontSize: "16px" }}
          >
            이메일로 직접 가입하기
          </button>
          
          <div style={{ margin: "30px 0", color: "#ddd", fontSize: "13px" }}>또는 간편 가입</div>
          
          <button onClick={() => handleMethodSelect("google")} style={{ ...socialBtnStyle, background: "#fff", border: "1px solid #ddd", color: "#333" }}>Google 계정으로 가입</button>
          <button onClick={() => handleMethodSelect("kakao")} style={{ ...socialBtnStyle, background: "#FEE500", color: "#3c1e1e" }}>카카오 계정으로 가입</button>
          <button onClick={() => handleMethodSelect("naver")} style={{ ...socialBtnStyle, background: "#03C75A", color: "#fff" }}>네이버 계정으로 가입</button>
          
          <button 
            onClick={() => setStep(1)} 
            style={{ marginTop: "20px", background: "none", border: "none", color: "#999", cursor: "pointer", textDecoration: "underline" }}
          >
            회원 유형 다시 선택하기
          </button>
        </>
      )}
    </div>
  );
};

export default JoinTypePage;