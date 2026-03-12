import React from "react";
import { useNavigate } from "react-router-dom";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";
import "../../styles/member/LawyerJoinCompletePage.css"; // CSS 임포트

const LawyerJoinCompletePage = () => {
  const navigate = useNavigate();

  return (
    <div className="lawyer-complete-container">
      {/* 전문회원용 단계 표시 */}
      <JoinStepIndicator currentStep={3} />

      <div className="lawyer-complete-card">
        <span className="lawyer-complete-icon">⚖️</span>
        <h2 className="lawyer-complete-title">가입 신청이 완료되었습니다</h2>

        <p className="lawyer-complete-desc">
          LawMate 전문회원은 <strong>관리자 승인 후</strong>
          <br />
          정상적인 서비스 이용이 가능합니다.
          <br />
          검토는 영업일 기준 최대 1~2일이 소요될 수 있습니다.
        </p>

        <div className="lawyer-notice-box">
          • 자격 증명 서류에 문제가 있을 경우 별도의 연락을 드립니다.
          <br />• 승인 완료 시 등록하신 이메일로 안내 메일이 발송됩니다.
        </div>

        <button className="btn-main-go" onClick={() => navigate("/")}>
          메인 페이지로 이동
        </button>
      </div>
    </div>
  );
};

export default LawyerJoinCompletePage;
