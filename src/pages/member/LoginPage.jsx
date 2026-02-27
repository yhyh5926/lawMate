// src/pages/member/LoginPage.jsx
// 설명: 사용자가 아이디와 비밀번호를 입력하여 로그인하는 화면입니다.
// Zustand의 useAuthStore와 연동하여 로그인 성공 시 전역 인증 상태를 업데이트합니다.
// 경로 해석 오류 해결을 위해 import문에 명시적인 확장자(.js, .jsx)를 추가했습니다.

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { memberApi } from "../../api/memberApi.js";
import { useAuthStore } from "../../store/authStore.js"; // Zustand 스토어 임포트
import SocialLoginButtons from "../../components/member/SocialLoginButtons.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore(); // 스토어에서 로그인 액션 가져오기
  const [formData, setFormData] = useState({ loginId: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    console.log("=== [로그인 시도] ===");
    console.log("전송 데이터:", formData);

    try {
      // 1. 백엔드 로그인 API 호출
      const response = await memberApi.login(formData);
      
      console.log("=== [서버 응답 성공] ===");
      console.log("응답 데이터:", response.data);

      // 백엔드 응답 구조에 따라 데이터 추출 (기존: { token: "...", member: {...} })
      const { token, member } = response.data;

      if (token) {
        console.log("토큰 확인 완료. 전역 상태를 업데이트합니다.");
        
        // 2. Zustand 스토어의 login 함수 호출 (토큰 저장 및 유저 정보 세팅)
        login(token, member);
        
        // 3. 메인 페이지로 이동
        navigate("/main.do");
      } else {
        console.warn("응답에 토큰이 없습니다. 백엔드 로직을 확인하세요.");
        setError("로그인 처리 중 문제가 발생했습니다.");
      }
    } catch (err) {
      console.error("=== [로그인 실패] ===");
      console.error("에러 상세:", err);

      if (err.response) {
        console.error("서버 응답 상태코드:", err.response.status);
        if (err.response.status === 401) {
          setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        } else {
          setError("서버 내부 오류가 발생했습니다. (500)");
        }
      } else {
        setError("서버와 통신할 수 없습니다. 네트워크 상태를 확인하세요.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>로그인</h2>
      
      {error && (
        <div style={{ 
          color: "#dc3545", 
          backgroundColor: "#f8d7da", 
          padding: "10px", 
          borderRadius: "4px", 
          marginBottom: "15px",
          fontSize: "14px",
          textAlign: "center",
          fontWeight: "bold"
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input 
          type="text" 
          name="loginId" 
          placeholder="아이디" 
          value={formData.loginId} 
          onChange={handleChange} 
          required 
          style={inputStyle} 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="비밀번호" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          style={inputStyle} 
        />
        <button type="submit" style={loginBtnStyle}>
          로그인
        </button>
      </form>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", fontSize: "14px" }}>
        <Link to="/member/find.do" style={{ color: "#555", textDecoration: "none" }}>아이디/비밀번호 찾기</Link>
        <Link to="/member/join/terms.do" style={{ color: "#007BFF", textDecoration: "none", fontWeight: "bold" }}>회원가입</Link>
      </div>
      
      <div style={{ textAlign: "center", margin: "30px 0 10px", color: "#999", fontSize: "12px" }}>
        또는 소셜 계정으로 로그인
      </div>
      <SocialLoginButtons />
    </div>
  );
};

const inputStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "15px",
  outline: "none"
};

const loginBtnStyle = {
  padding: "12px",
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "5px"
};

export default LoginPage;