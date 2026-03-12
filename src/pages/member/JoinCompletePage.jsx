import React from "react";
import { useNavigate } from "react-router-dom";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";
import "../../styles/member/JoinCompletePage.css"; // CSS 임포트

const JoinCompletePage = () => {
  const navigate = useNavigate();

  return (
    <div className="complete-container">
      {/* 마지막 단계 표시 */}
      <JoinStepIndicator currentStep={3} />

      <div className="complete-card">
        <span className="complete-icon">🎉</span>
        <h2 className="complete-title">가입이 완료되었습니다!</h2>

        <p className="complete-desc">
          <strong>LawMate</strong>의 회원이 되신 것을 진심으로 환영합니다.
          <br />
          이제 모든 법률 상담 및 커뮤니티 서비스를
          <br />
          자유롭게 이용하실 수 있습니다.
        </p>

        <div className="complete-btn-group">
          <button
            className="btn-login"
            onClick={() => navigate("/member/login")}
          >
            로그인하고 시작하기
          </button>

          <button className="btn-home" onClick={() => navigate("/")}>
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCompletePage;
