// vs코드
// 파일 위치: src/pages/member/FindIdPwPage.jsx
// 설명: 아이디 찾기 및 비밀번호 재설정 화면 (스타일 오타 수정 완료)

import React, { useState } from "react";
import { memberApi } from "../../api/memberApi.js";

const FindIdPwPage = () => {
  const [tab, setTab] = useState("id"); // 'id' 또는 'pw'

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>{tab === "id" ? "아이디 찾기" : "비밀번호 찾기"}</h2>
      
      <div style={{ display: "flex", marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
        <button 
          onClick={() => setTab("id")} 
          style={{ flex: 1, padding: "10px", background: "none", border: "none", borderBottom: tab === "id" ? "2px solid #007BFF" : "none", fontWeight: tab === "id" ? "bold" : "normal" }}
        >
          아이디 찾기
        </button>
        <button 
          onClick={() => setTab("pw")} 
          style={{ flex: 1, padding: "10px", background: "none", border: "none", borderBottom: tab === "pw" ? "20px solid #007BFF" : "none", fontWeight: tab === "pw" ? "bold" : "normal" }}
        >
          비밀번호 찾기
        </button>
      </div>

      <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
          {tab === "id" ? "가입 시 등록한 이름과 전화번호를 입력해주세요." : "아이디와 전화번호를 입력해주세요."}
        </p>
        {/* box-sizing -> boxSizing으로 수정하여 에러를 해결했습니다. */}
        <input type="text" placeholder={tab === "id" ? "이름" : "아이디"} style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }} />
        <input type="text" placeholder="전화번호 (- 제외)" style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }} />
        <button style={{ width: "100%", padding: "10px", backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "4px" }}>
          인증번호 발송
        </button>
      </div>
    </div>
  );
};

export default FindIdPwPage;