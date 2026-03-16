import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { memberApi } from "../../api/memberApi.js";
import { useAuthStore } from "../../store/authStore.js";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import "../../styles/member/LoginPage.css"; // CSS 임포트
import { scrollToTop } from "../../utils/windowUtils.js";

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

  useEffect(() => {
    scrollToTop();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await memberApi.login(formData);
      const { token, member } = response.data;
      if (token) {
        login(token, member);
        localStorage.setItem("memberId", member.memberId);
        navigate("/main");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "아이디 또는 비밀번호를 확인해주세요.",
      );
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
          localStorage.setItem("memberId", response.data.member.memberId);
          navigate("/main");
        }
      } catch (err) {
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
      alert("현재 구글 로그인만 지원하고 있습니다.");
      return;
    }
    if (platform === "google") {
      googleLogin();
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>

      {error && <div className="login-error-box">{error}</div>}

      <form onSubmit={onSubmit} className="login-form">
        <input
          type="text"
          name="loginId"
          placeholder="아이디"
          value={formData.loginId}
          onChange={handleChange}
          className="login-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          className="login-input"
          required
        />
        <button type="submit" className="btn-login-submit">
          로그인
        </button>
      </form>

      <div className="login-helper-links">
        <Link to="/member/find" className="link-find">
          아이디/비밀번호 찾기
        </Link>
        <Link to="/member/join/type" className="link-join">
          회원가입
        </Link>
      </div>

      <div className="login-divider">
        <hr />
        <span>또는 간편 로그인</span>
      </div>

      <div className="social-group">
        <button
          onClick={() => handleSocialClick("google")}
          className="btn-social btn-google"
        >
          Google로 로그인
        </button>
        <button
          onClick={() => handleSocialClick("kakao")}
          className="btn-social btn-kakao"
        >
          카카오 로그인
        </button>
        <button
          onClick={() => handleSocialClick("naver")}
          className="btn-social btn-naver"
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

export default LoginPage;
