import React, { useState } from "react";
import { authApi } from "../../api/auth_api";
import "../../styles/auth/Auth.css";

const FindPage = () => {
  const [tab, setTab] = useState("ID"); // 'ID' or 'PW'
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [result, setResult] = useState("");

  const handleFind = async () => {
    setResult("");
    try {
      if (tab === "ID") {
        const foundId = await authApi.findId(email);
        setResult(`회원님의 아이디는 [ ${foundId} ] 입니다.`);
      } else {
        const foundPw = await authApi.findPw(id, email);
        setResult(`임시 비밀번호는 [ ${foundPw} ] 입니다.`);
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="auth-outer-layout">
      <div className="auth-card-mini">
        <h2 className="auth-title">
          {tab === "ID" ? "아이디 찾기" : "비밀번호 찾기"}
        </h2>

        <div className="auth-tab-pill">
          <button
            onClick={() => {
              setTab("ID");
              setResult("");
            }}
            className={tab === "ID" ? "active" : ""}
          >
            아이디 찾기
          </button>
          <button
            onClick={() => {
              setTab("PW");
              setResult("");
            }}
            className={tab === "PW" ? "active" : ""}
          >
            비밀번호 찾기
          </button>
        </div>

        <div className="auth-form-stack">
          {tab === "PW" && (
            <div className="auth-input-wrapper">
              <label className="auth-label">아이디</label>
              <input
                placeholder="아이디를 입력하세요"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="auth-input"
              />
            </div>
          )}
          <div className="auth-input-wrapper">
            <label className="auth-label">이메일</label>
            <input
              placeholder="가입한 이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>

          <button onClick={handleFind} className="auth-main-btn">
            {tab === "ID" ? "아이디 찾기" : "비밀번호 찾기"}
          </button>
        </div>

        {result && <div className="result-box">{result}</div>}

        <div className="auth-footer-links">
          <span onClick={() => window.history.back()}>이전으로</span>
        </div>
      </div>
    </div>
  );
};

export default FindPage;
