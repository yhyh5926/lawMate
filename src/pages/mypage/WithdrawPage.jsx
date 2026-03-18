import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { memberApi } from "../../api/memberApi.js";
import "../../styles/mypage/WithdrawPage.css"; // CSS 연결

const WithdrawPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [agreed, setAgreed] = useState(false);

  const handleWithdraw = async () => {
    if (!agreed) {
      alert("탈퇴 안내 사항에 동의해주세요.");
      return;
    }

    if (
      window.confirm(
        "정말로 LawMate를 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      )
    ) {
      try {
        const loginId = user?.loginId;
        if (!loginId) {
          alert("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
          return;
        }

        await memberApi.withdraw(loginId);
        alert("회원 탈퇴가 완료되었습니다. 그동안 이용해 주셔서 감사합니다.");

        logout();
        navigate("/main");
      } catch (error) {
        console.error("탈퇴 실패:", error);
        alert("탈퇴 처리 중 오류가 발생했습니다. 고객센터에 문의해주세요.");
      }
    }
  };

  return (
    <div className="withdraw-container">
      <h2 className="withdraw-title">회원 탈퇴</h2>

      <div className="withdraw-warning-box">
        <h4>🚨 탈퇴 전 반드시 확인해주세요!</h4>
        <ul className="withdraw-warning-list">
          <li>
            탈퇴 시 귀하의 모든 개인정보 및 상담 데이터는 즉시 삭제됩니다.
          </li>
          <li>
            진행 중인 유료 상담이나 사건이 있을 경우 탈퇴가 불가능할 수
            있습니다.
          </li>
          <li>
            커뮤니티 등에 작성하신 게시글은 자동으로 삭제되지 않으므로 미리
            삭제하시기 바랍니다.
          </li>
        </ul>
      </div>

      <label className="withdraw-agreement">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span>위 안내 사항을 모두 확인하였으며, 탈퇴에 동의합니다.</span>
      </label>

      <div className="withdraw-actions">
        <button onClick={() => navigate(-1)} className="btn-back">
          취소 (돌아가기)
        </button>
        <button
          onClick={handleWithdraw}
          className="btn-withdraw"
          disabled={!agreed} // 동의하지 않으면 버튼 비활성화 시각화
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default WithdrawPage;
