import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";
import "../../styles/member/LawyerJoinTermsPage.css"; // CSS 임포트

const LawyerJoinTermsPage = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleNext = () => {
    if (!agreed) return alert("필수 약관에 동의해주세요.");
    navigate("/member/lawyer/form");w
  };

  return (
    <div className="lawyer-terms-container">
      <JoinStepIndicator currentStep={1} />

      <h2 className="lawyer-terms-title">전문회원 약관 동의</h2>

      <div className="lawyer-terms-box">
        <strong>제 1 조 (목적 및 자격)</strong>
        LawMate 전문회원은 대한변호사협회에 등록된 현직 변호사만이 가입할 수
        있습니다. 가입 시 제출한 자격 증빙 서류는 관리자의 승인 절차를 거치며,
        허위 정보 기재 시 영구 제명될 수 있습니다.
        <strong>제 2 조 (의무 및 운영 정책)</strong>
        전문회원은 플랫폼을 통해 정확하고 신뢰할 수 있는 법률 정보를 제공해야
        합니다. 의뢰인과의 상담 과정에서 변호사법 및 관련 법규를 준수해야 하며,
        서비스 이용 중 취득한 비밀을 엄수해야 합니다.
        <strong>제 3 조 (가입 승인 대기)</strong>
        모든 전문회원은 서류 검토 기간 동안 '승인 대기' 상태로 유지됩니다. 승인
        완료 후 정상적인 상담 활동 및 게시물 작성이 가능합니다.
      </div>

      <div className="lawyer-terms-agree" onClick={() => setAgreed(!agreed)}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
        <label>(필수) 전문회원 이용약관 및 운영정책에 동의합니다.</label>
      </div>

      <div className="lawyer-terms-btns">
        <button className="btn-lawyer-cancel" onClick={() => navigate(-1)}>
          취소
        </button>
        <button
          className="btn-lawyer-next"
          onClick={handleNext}
          disabled={!agreed}
        >
          다음 단계
        </button>
      </div>

      <div className="lawyer-qualification-info">
        ⚠️ 변호사 자격증 또는 사무실 개업 신고증 등 증빙 서류 업로드가
        필요합니다.
      </div>
    </div>
  );
};

export default LawyerJoinTermsPage;
