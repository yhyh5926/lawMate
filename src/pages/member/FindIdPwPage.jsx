import React, { useState } from "react";
import "../../styles/member/FindIdPwPage.css"; // CSS 임포트

const FindIdPwPage = () => {
  const [tab, setTab] = useState("id"); // 'id' 또는 'pw'

  return (
    <div className="find-container">
      <h2 className="find-title">
        {tab === "id" ? "아이디 찾기" : "비밀번호 찾기"}
      </h2>

      {/* 상단 탭 선택 */}
      <div className="find-tabs">
        <button
          className={`find-tab-btn ${tab === "id" ? "active" : ""}`}
          onClick={() => setTab("id")}
        >
          아이디 찾기
        </button>
        <button
          className={`find-tab-btn ${tab === "pw" ? "active" : ""}`}
          onClick={() => setTab("pw")}
        >
          비밀번호 찾기
        </button>
      </div>

      {/* 입력 영역 */}
      <div className="find-form-box">
        <p className="find-desc">
          {tab === "id"
            ? "가입 시 등록한 이름과 전화번호를 입력해주세요."
            : "가입하신 아이디와 전화번호를 입력해주세요."}
        </p>

        <input
          type="text"
          className="find-input"
          placeholder={tab === "id" ? "이름" : "아이디"}
        />
        <input
          type="text"
          className="find-input"
          placeholder="전화번호 (- 제외)"
        />

        <button className="find-submit-btn">인증번호 발송</button>
      </div>
    </div>
  );
};

export default FindIdPwPage;
