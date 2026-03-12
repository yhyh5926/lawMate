import React from "react";
import "../../styles/member/SocialLoginButtons.css";

const SocialLoginButtons = () => {
  const handleSocialLogin = (provider) => {
    // 추후 OAuth2 API 연동 시 window.location.href 등으로 교체
    alert(`${provider} 로그인은 현재 준비 중입니다.`);
  };

  return (
    <div className="social-login-container">
      <div className="social-divider">
        <span>또는 소셜 계정으로 로그인</span>
      </div>

      <div className="social-button-group">
        {/* 구글 로그인 */}
        <button
          className="social-btn google"
          onClick={() => handleSocialLogin("Google")}
        >
          <span className="social-icon google-icon">G</span>
          구글 계정으로 로그인
        </button>

        {/* 카카오 로그인 */}
        <button
          className="social-btn kakao"
          onClick={() => handleSocialLogin("Kakao")}
        >
          <span className="social-icon kakao-icon">K</span>
          카카오 로그인
        </button>

        {/* 네이버 로그인 */}
        <button
          className="social-btn naver"
          onClick={() => handleSocialLogin("Naver")}
        >
          <span className="social-icon naver-icon">N</span>
          네이버 로그인
        </button>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
