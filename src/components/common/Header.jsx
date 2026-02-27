import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 시 헤더 그림자 효과
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate("/main.do");
    }
  };

  return (
    <header
      style={{
        ...headerStyle,
        boxShadow: isScrolled ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
        borderBottom: isScrolled ? "none" : "1px solid #f1f1f1",
      }}
    >
      <div style={innerContainerStyle}>
        {/* 1. 로고 영역 */}
        <div style={logoStyle}>
          <Link to="/main.do" style={logoLinkStyle}>
            <span style={{ color: "#007BFF" }}>Law</span>Mate
          </Link>
        </div>

        {/* 2. 메인 네비게이션 (데스크탑) */}
        <nav style={navStyle}>
          <NavLink to="/precedent/search.do">판례검색</NavLink>
          <NavLink to="/lawyer/list.do">변호사찾기</NavLink>
          <NavLink to="/question/list.do">법률질문</NavLink>
          <NavLink to="/community/home">커뮤니티</NavLink>
          {isAuthenticated && <NavLink to="/chat/list.do">채팅상담</NavLink>}
        </nav>

        {/* 3. 유저 액션 영역 */}
        <div style={authContainerStyle}>
          {isAuthenticated ? (
            <div style={userProfileStyle}>
              <div style={userInfoStyle}>
                <span style={userNameStyle}>
                  <strong>{user?.name || user?.loginId}</strong>님
                </span>
                {user?.role === "ADMIN" && (
                  <span style={adminBadgeStyle}>Admin</span>
                )}
              </div>

              <div style={actionGroupStyle}>
                <Link
                  to="/mypage/edit.do"
                  style={iconLinkStyle}
                  title="마이페이지"
                >
                  MY
                </Link>
                {user?.role === "ADMIN" && (
                  <Link to="/admin/stats.do" style={adminIconStyle}>
                    관리
                  </Link>
                )}
                <button onClick={handleLogout} style={logoutBtnStyle}>
                  로그아웃
                </button>
              </div>
            </div>
          ) : (
            <div style={guestGroupStyle}>
              <Link to="/member/login.do" style={loginBtnStyle}>
                로그인
              </Link>
              <Link to="/member/join/terms.do" style={joinLinkStyle}>
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// --- 공통 컴포넌트 조각 ---
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    style={linkStyle}
    onMouseEnter={(e) => (e.target.style.color = "#007BFF")}
    onMouseLeave={(e) => (e.target.style.color = "#444")}
  >
    {children}
  </Link>
);

// --- 스타일 정의 (반응형 대응) ---
const headerStyle = {
  width: "100%",
  height: "70px",
  position: "sticky",
  top: 0,
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  zIndex: 1000,
  transition: "all 0.3s ease",
  display: "flex",
  justifyContent: "center",
};

const innerContainerStyle = {
  width: "100%",
  maxWidth: "1200px",
  padding: "0 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logoStyle = { fontSize: "24px", fontWeight: "800" };
const logoLinkStyle = {
  textDecoration: "none",
  color: "#2c3e50",
  letterSpacing: "-1px",
};

const navStyle = { display: "flex", gap: "25px", alignItems: "center" };
// 💡 미디어 쿼리는 실제 CSS 파일이나 styled-components 권장하지만 인라인에서는 유동적 폭 조절로 대응
const linkStyle = {
  textDecoration: "none",
  color: "#444",
  fontWeight: "600",
  fontSize: "15px",
  transition: "color 0.2s ease",
};

const authContainerStyle = { display: "flex", alignItems: "center" };

const userProfileStyle = { display: "flex", alignItems: "center", gap: "15px" };
const userInfoStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "2px",
};
const userNameStyle = { fontSize: "14px", color: "#333" };

const adminBadgeStyle = {
  fontSize: "10px",
  backgroundColor: "#E3F2FD",
  color: "#007BFF",
  padding: "1px 6px",
  borderRadius: "10px",
  fontWeight: "bold",
  border: "1px solid #bbdefb",
};

const actionGroupStyle = { display: "flex", alignItems: "center", gap: "12px" };

const iconLinkStyle = {
  textDecoration: "none",
  color: "#666",
  fontSize: "12px",
  fontWeight: "bold",
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  backgroundColor: "#f5f5f5",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.2s",
};

const adminIconStyle = {
  ...iconLinkStyle,
  backgroundColor: "#FFF9C4",
  color: "#FBC02D",
};

const logoutBtnStyle = {
  backgroundColor: "transparent",
  color: "#ff4d4f",
  border: "none",
  padding: "5px 10px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
};

const loginBtnStyle = {
  backgroundColor: "#007BFF",
  color: "#fff",
  padding: "8px 20px",
  borderRadius: "8px",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "bold",
  boxShadow: "0 4px 10px rgba(0,123,255,0.2)",
  transition: "transform 0.2s",
};

const guestGroupStyle = { display: "flex", alignItems: "center", gap: "15px" };
const joinLinkStyle = {
  textDecoration: "none",
  color: "#555",
  fontSize: "14px",
  fontWeight: "500",
};

export default Header;
