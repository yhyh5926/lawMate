import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";
import "../../styles/member/JoinTermsPage.css"; // CSS 임포트

const JoinTermsPage = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleNext = () => {
    if (!agreed) return alert("필수 약관에 동의해주세요.");
    navigate("/member/join/form");
  };

  return (
    <div className="join-terms-container">
      <JoinStepIndicator currentStep={1} />

      <h2 className="join-terms-title">일반회원 약관 동의</h2>

      <div className="join-terms-box">
        <strong>제 1 조 (목적)</strong>이 약관은 LawMate(이하 "회사")가 제공하는
        서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타
        필요한 사항을 규정함을 목적으로 합니다.
        <strong>제 2 조 (개인정보 수집)</strong>
        회사는 원활한 서비스 제공을 위해 최소한의 개인정보를 수집하고 있습니다.
        수집된 정보는 상담 매칭 및 본인 확인 이외의 용도로는 사용되지 않습니다.
        <strong>제 3 조 (서비스의 이용)</strong>
        회원은 회사가 제공하는 법률 상담 예약 및 커뮤니티 서비스를 이용할 수
        있으며, 부적절한 게시물 작성 시 이용이 제한될 수 있습니다.
      </div>

      <div className="join-terms-agree" onClick={() => setAgreed(!agreed)}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
        <label>(필수) 서비스 이용약관 및 개인정보 처리방침에 동의합니다.</label>
      </div>

      <div className="join-terms-btns">
        <button className="btn-cancel" onClick={() => navigate(-1)}>
          취소
        </button>
        <button className="btn-next" onClick={handleNext} disabled={!agreed}>
          다음 단계
        </button>
      </div>

      <div className="lawyer-link-box">
        <Link to="/member/lawyer/terms" className="lawyer-link">
          <span>👨‍⚖️</span> 변호사이신가요? 전문회원 가입하기
        </Link>
      </div>
    </div>
  );
};

export default JoinTermsPage;
