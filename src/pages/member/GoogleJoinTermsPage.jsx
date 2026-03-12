import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";
import "../../styles/member/GoogleJoinTermsPage.css"; // CSS 임포트

const GoogleJoinTermsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const memberType = queryParams.get("type") || "PERSONAL";
  const [agreed, setAgreed] = useState(false);

  const handleNext = () => {
    if (!agreed) return alert("필수 약관에 동의해주세요.");
    navigate(`/member/join/social/google?type=${memberType}`);
  };

  return (
    <div className="terms-container">
      <JoinStepIndicator currentStep={1} />

      <div className="terms-header">
        <h2>
          Google{" "}
          <span className="member-type">
            {memberType === "PERSONAL" ? "일반회원" : "전문회원"}
          </span>{" "}
          약관 동의
        </h2>
      </div>

      <div className="terms-content-box">
        <h3>제 1 조 (목적)</h3>
        <p>
          본 약관은 LawMate가 제공하는 구글 소셜 회원가입 서비스 이용에 관한
          권리와 의무를 규정함을 목적으로 합니다.
        </p>
        <h3>제 2 조 (용어의 정의)</h3>
        <p>
          1. "서비스"란 LawMate가 제공하는 법률 상담 및 커뮤니티 플랫폼을
          의미합니다.
          <br />
          2. "구글 회원"이란 구글 계정 인증을 통해 LawMate 서비스를 이용하는
          자를 말합니다.
        </p>
        <h3>제 3 조 (개인정보 수집)</h3>
        <p>
          회사는 원활한 서비스 제공을 위해 구글로부터 제공받는 이름, 이메일 주소
          등의 정보를 수집 및 활용합니다.
        </p>
        <p>... (중략) ...</p>
      </div>

      <div className="terms-agree-section" onClick={() => setAgreed(!agreed)}>
        <input
          type="checkbox"
          id="agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
        />
        <label htmlFor="agree">
          (필수) 구글 회원가입 서비스 및 개인정보 수집에 동의합니다.
        </label>
      </div>

      <div className="terms-btn-group">
        <button className="btn-prev" onClick={() => navigate(-1)}>
          취소
        </button>
        <button className="btn-next" onClick={handleNext} disabled={!agreed}>
          다음 단계
        </button>
      </div>
    </div>
  );
};

export default GoogleJoinTermsPage;
