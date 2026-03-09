// src/pages/member/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { memberApi } from "../../api/memberApi.js";
import { useAuthStore } from "../../store/authStore.js";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID =
  "244554224995-kcgsjp47k8flns89ldv9stpfga219kut.apps.googleusercontent.com";

const LoginContent = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({ loginId: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await memberApi.login(formData);
      const { token, member } = response.data;
      if (token) {
        login(token, member);
        // 로그인시 아이디 저장 (수빈 수정)
        localStorage.setItem("memberId", member.memberId);

        navigate("/main");
      }
    } catch (err) {
      setError(err.response?.data?.message || "로그인 중 오류가 발생했습니다.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        const userInfo = await res.json();

        const googleData = {
          email: userInfo.email,
          name: userInfo.name,
          provider: "GOOGLE",
          loginId: userInfo.email,
        };

        const response = await memberApi.socialLogin(googleData);
        if (response.data.token) {
          login(response.data.token, response.data.member);
          // 로그인시 아이디 저장 (수빈 수정)
          localStorage.setItem("memberId", response.data.member.memberId);

          navigate("/main");
        }
      } catch (err) {
        // 💡 수정 사항: 404 에러 시 가입 유도 메시지
        if (err.response?.status === 404) {
          alert("가입된 정보가 없습니다. 회원가입을 먼저 진행해주세요.");
        } else {
          alert("구글 로그인 처리 중 오류가 발생했습니다.");
        }
      }
    },
    onError: () => alert("구글 로그인에 실패했습니다."),
  });

  const handleSocialClick = (platform) => {
    if (platform === "kakao" || platform === "naver") {
      alert("구글로 해주세요");
      return;
    }
    if (platform === "google") {
      googleLogin();
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "80px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontWeight: "bold",
          fontSize: "24px",
        }}
      >
        로그인
      </h2>
      {error && (
        <div
          style={{
            color: "#dc3545",
            backgroundColor: "#f8d7da",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          fontSize: "14px",
        }}
      >
        <Link
          to="/member/find"
          style={{ color: "#666", textDecoration: "none" }}
        >
          아이디/비밀번호 찾기
        </Link>
        <Link
          to="/member/join/type"
          style={{
            color: "#007BFF",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          회원가입
        </Link>
      </div>

      <div
        style={{
          position: "relative",
          margin: "40px 0 20px",
          textAlign: "center",
        }}
      >
        <hr style={{ border: "0", borderTop: "1px solid #eee" }} />
        <span
          style={{
            position: "absolute",
            top: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            padding: "0 15px",
            color: "#999",
            fontSize: "12px",
          }}
        >
          또는 간편 로그인
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          onClick={() => handleSocialClick("google")}
          style={{
            ...socialBtnStyle,
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            color: "#333",
          }}
        >
          Google 계정으로 로그인
        </button>
        <button
          onClick={() => handleSocialClick("kakao")}
          style={{
            ...socialBtnStyle,
            backgroundColor: "#FEE500",
            color: "#3c1e1e",
          }}
        >
          카카오 로그인
        </button>
        <button
          onClick={() => handleSocialClick("naver")}
          style={{
            ...socialBtnStyle,
            backgroundColor: "#03C75A",
            color: "#fff",
          }}
        >
          네이버 로그인
        </button>
      </div>
    </div>
  );
};

const LoginPage = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <LoginContent />
  </GoogleOAuthProvider>
);
const inputStyle = {
  padding: "14px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "15px",
  outline: "none",
};
const loginBtnStyle = {
  padding: "14px",
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
};
const socialBtnStyle = {
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
  transition: "0.2s",
};

export default LoginPage;
