import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth_api";
import useAuthStore from "../../zustand/auth_store";
import "../../styles/auth/Auth.css";

const LoginPage = () => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await authApi.login(id, pw);
      login(user);
      alert(`${user.name}님 환영합니다!`);
      navigate(user.role === "ADMIN" ? "/admin" : "/");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="auth-outer-layout">
      <div className="auth-card-mini">
        <h2 className="auth-title">로그인</h2>
        <form className="auth-form-stack" onSubmit={handleLogin}>
          <div className="auth-input-wrapper">
            <label className="auth-label">아이디</label>
            <input
              className="auth-input"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="auth-input-wrapper">
            <label className="auth-label">비밀번호</label>
            <input
              type="password"
              className="auth-input"
              placeholder="비밀번호"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>
          <button type="submit" className="auth-main-btn">
            로그인
          </button>
        </form>
        <div className="auth-footer-links">
          <span onClick={() => navigate("/find/user")}>계정 찾기</span>
          <i className="divider" />
          <span onClick={() => navigate("/join")}>회원가입</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
