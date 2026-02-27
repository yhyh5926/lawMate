// vs코드
// 파일 위치: src/pages/member/LoginPage.jsx
// 설명: 일반 로그인 및 소셜 로그인 화면

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { memberApi } from "../../api/memberApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import SocialLoginButtons from "../../components/member/SocialLoginButtons.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const [formData, setFormData] = useState({ loginId: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // 스프링부트 로그인 API 호출
      const response = await memberApi.login(formData);
      if(response.data.token) {
        // 성공 시 토큰 및 유저 상태 저장 후 메인 이동
        handleLogin({ loginId: formData.loginId, role: response.data.member.memberType });
        navigate("/main.do");
      }
    } catch (err) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>로그인</h2>
      {error && <div style={{ color: "red", marginBottom: "10px", fontSize: "14px" }}>{error}</div>}
      
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input 
          type="text" name="loginId" placeholder="아이디" 
          value={formData.loginId} onChange={handleChange} required 
          style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "4px" }} 
        />
        <input 
          type="password" name="password" placeholder="비밀번호" 
          value={formData.password} onChange={handleChange} required 
          style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "4px" }} 
        />
        <button type="submit" style={{ padding: "12px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold" }}>
          로그인
        </button>
      </form>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", fontSize: "14px" }}>
        <Link to="/member/find.do" style={{ color: "#555", textDecoration: "none" }}>아이디/비밀번호 찾기</Link>
        <Link to="/member/join/terms.do" style={{ color: "#007BFF", textDecoration: "none" }}>회원가입</Link>
      </div>
      
      <hr style={{ margin: "30px 0", borderTop: "1px solid #eee" }} />
      <SocialLoginButtons />
    </div>
  );
};

export default LoginPage;