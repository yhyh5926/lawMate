// src/pages/mypage/WithdrawPage.jsx
// 설명: 마이페이지 - 회원 탈퇴 안내 및 처리 화면입니다.
// Zustand의 logout 함수를 사용하여 탈퇴 성공 시 세션을 즉시 종료합니다.
// 모듈 해석 오류 수정을 위해 임포트 경로에 확장자(.js)를 추가했습니다.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { memberApi } from "../../api/memberApi.js";

const WithdrawPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore(); // Zustand 스토어 연동
  const [agreed, setAgreed] = useState(false);

  const handleWithdraw = async () => {
    if (!agreed) {
      alert("탈퇴 안내 사항에 동의해주세요.");
      return;
    }

    if (window.confirm("정말로 LawMate를 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      try {
        // 백엔드 withdraw API 호출 (유저 아이디 전달)
        // user 객체가 유효한지 확인 후 호출
        const loginId = user?.loginId;
        if (!loginId) {
          alert("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
          return;
        }

        await memberApi.withdraw(loginId);
        
        alert("회원 탈퇴가 완료되었습니다. 그동안 이용해 주셔서 감사합니다.");
        
        // 1. 전역 상태 초기화 및 토큰 삭제
        logout(); 
        
        // 2. 메인 페이지로 이동
        navigate("/main.do");
      } catch (error) {
        console.error("탈퇴 실패:", error);
        alert("탈퇴 처리 중 오류가 발생했습니다. 고객센터에 문의해주세요.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "30px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <h2 style={{ color: "#dc3545", textAlign: "center", marginBottom: "30px" }}>회원 탈퇴</h2>
      
      <div style={{ border: "1px solid #ffc9c9", padding: "20px", borderRadius: "8px", backgroundColor: "#fff5f5", marginBottom: "25px" }}>
        <h4 style={{ color: "#dc3545", marginTop: 0, marginBottom: "10px" }}>🚨 탈퇴 전 반드시 확인해주세요!</h4>
        <ul style={{ fontSize: "14px", color: "#555", paddingLeft: "20px", lineHeight: "1.8", margin: 0 }}>
          <li>탈퇴 시 귀하의 모든 개인정보 및 상담 데이터는 즉시 삭제됩니다.</li>
          <li>진행 중인 유료 상담이나 사건이 있을 경우 탈퇴가 불가능할 수 있습니다.</li>
          <li>커뮤니티 등에 작성하신 게시글은 탈퇴 후에도 자동으로 삭제되지 않으므로 미리 삭제하시기 바랍니다.</li>
        </ul>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", cursor: "pointer", color: "#333" }}>
          <input 
            type="checkbox" 
            checked={agreed} 
            onChange={(e) => setAgreed(e.target.checked)} 
            style={{ width: "18px", height: "18px" }}
          />
          <strong>위 안내 사항을 모두 확인하였으며, 탈퇴에 동의합니다.</strong>
        </label>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ flex: 1, padding: "14px", backgroundColor: "#f8f9fa", color: "#333", border: "1px solid #ddd", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
        >
          취소 (돌아가기)
        </button>
        <button 
          onClick={handleWithdraw} 
          style={{ flex: 1, padding: "14px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default WithdrawPage;