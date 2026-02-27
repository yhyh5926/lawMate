// vs코드
// 파일 위치: src/pages/mypage/WithdrawPage.jsx
// 설명: 마이페이지 - 회원 탈퇴 안내 및 처리 화면

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { memberApi } from "../../api/memberApi";
import { useAuth } from "../../hooks/useAuth";

const WithdrawPage = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const [agreed, setAgreed] = useState(false);

  const handleWithdraw = async () => {
    if (!agreed) {
      alert("탈퇴 안내 사항에 동의해주세요.");
      return;
    }

    if (window.confirm("정말로 LawMate를 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      try {
        await memberApi.withdraw();
        alert("회원 탈퇴가 완료되었습니다. 그동안 이용해 주셔서 감사합니다.");
        handleLogout(); // 로컬 스토리지 비우기 및 상태 초기화
        navigate("/main.do");
      } catch (error) {
        alert("탈퇴 처리 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px" }}>
      <h2 style={{ color: "#dc3545", textAlign: "center", marginBottom: "20px" }}>회원 탈퇴</h2>
      
      <div style={{ border: "1px solid #dc3545", padding: "20px", borderRadius: "8px", backgroundColor: "#fff5f5", marginBottom: "20px" }}>
        <h4 style={{ color: "#dc3545", marginTop: 0 }}>🚨 탈퇴 전 반드시 확인해주세요!</h4>
        <ul style={{ fontSize: "14px", color: "#555", paddingLeft: "20px", lineHeight: "1.6" }}>
          <li>탈퇴 시 귀하의 모든 개인정보는 즉시 삭제 처리 또는 비식별화(WITHDRAWN) 됩니다.</li>
          <li>진행 중인 사건이나 상담 내역이 있을 경우 탈퇴가 제한될 수 있습니다.</li>
          <li>작성하신 법률 질문이나 커뮤니티 게시글은 자동으로 삭제되지 않습니다.</li>
        </ul>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "bold", cursor: "pointer", marginBottom: "30px" }}>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        안내 사항을 모두 확인하였으며, 탈퇴에 동의합니다.
      </label>

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => navigate(-1)} style={{ flex: 1, padding: "12px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
          취소 (돌아가기)
        </button>
        <button onClick={handleWithdraw} style={{ flex: 1, padding: "12px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default WithdrawPage;