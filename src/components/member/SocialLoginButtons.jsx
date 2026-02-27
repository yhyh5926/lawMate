// vs코드
// 파일 위치: src/components/member/SocialLoginButtons.jsx
// 설명: 구글, 카카오, 네이버 소셜 로그인 버튼 모음 (API 연동 전 UI 뼈대)

import React from "react";

const SocialLoginButtons = () => {
  const handleSocialLogin = (provider) => {
    alert(`${provider} 로그인은 현재 준비 중입니다.`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
      <button onClick={() => handleSocialLogin('Google')} style={{...btnStyle, backgroundColor: "#fff", color: "#000", border: "1px solid #ddd"}}>
        구글 계정으로 로그인
      </button>
      <button onClick={() => handleSocialLogin('Kakao')} style={{...btnStyle, backgroundColor: "#FEE500", color: "#000", border: "none"}}>
        카카오 로그인
      </button>
      <button onClick={() => handleSocialLogin('Naver')} style={{...btnStyle, backgroundColor: "#03C75A", color: "#fff", border: "none"}}>
        네이버 로그인
      </button>
    </div>
  );
};

const btnStyle = {
  width: "100%", padding: "12px", borderRadius: "6px", fontSize: "14px", cursor: "pointer", fontWeight: "bold"
};

export default SocialLoginButtons;