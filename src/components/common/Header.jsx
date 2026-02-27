import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);

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
        boxShadow: isScrolled ? "0 10px 30px rgba(0,0,0,0.05)" : "none",
        borderBottom: isScrolled ? "none" : "1px solid #f1f5f9",
      }}
    >
      <div style={innerContainerStyle}>
        {/* 1. 로고 영역: 크기 최적화 및 정렬 */}
        <div style={logoWrapperStyle}>
          <Link to="/main.do" style={logoLinkStyle}>
            <img
              src="/lawMateLogo.png"
              alt="LawMate Logo"
              style={logoImageStyle}
            />
          </Link>
        </div>

        {/* 2. 메인 네비게이션: 간격 및 폰트 개선 */}
        <nav style={navStyle}>
          <NavLink to="/precedent/search.do">판례검색</NavLink>
          <NavLink to="/lawyer/list.do">변호사찾기</NavLink>
          <NavLink to="/question/list.do">법률질문</NavLink>
          <NavLink to="/community/home">커뮤니티</NavLink>
          {isAuthenticated && <NavLink to="/chat/list.do">채팅상담</NavLink>}
        </nav>

        {/* 3. 유저 액션 영역: 버튼 디자인 고도화 */}
        <div style={authContainerStyle}>
          {isAuthenticated ? (
            <div style={userProfileStyle}>
              <div style={userInfoStyle}>
                <span style={userNameStyle}>
                  <strong>{user?.name || user?.loginId}</strong>님
                </span>
                {user?.role === "ADMIN" && (
                  <span style={adminBadgeStyle}>관리자</span>
                )}
              </div>

              <div style={actionGroupStyle}>
                <Link
                  to="/mypage/edit.do"
                  style={myPageIconStyle}
                  title="마이페이지"
                >
                  MY
                </Link>
                {user?.loginId === "admin" && (
                  <Link
                    to="/admin/stats.do"
                    style={adminIconStyle}
                    title="관리자 대시보드"
                  >
                    <span style={{ fontSize: "18px" }}>⚙️</span>
                  </Link>
                )}
                <button onClick={handleLogout} style={logoutBtnStyle}>
                  로그아웃
                </button>
              </div>
            </div>
          ) : (
            <div style={guestGroupStyle}>
              <Link to="/member/join/terms.do" style={joinLinkStyle}>
                회원가입
              </Link>
              <Link to="/member/login.do" style={loginBtnStyle}>
                로그인
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// --- 공통 컴포넌트 (호버 효과 포함) ---
const NavLink = ({ to, children }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <Link
      to={to}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        ...linkStyle,
        color: isHover ? "#007BFF" : "#334155",
      }}
    >
      {children}
      <div style={{ ...underlineStyle, width: isHover ? "100%" : "0" }} />
    </Link>
  );
};

// --- 스타일 정의 ---
const headerStyle = {
  width: "100%",
  height: "80px", // 높이를 조금 더 여유있게 조정
  position: "sticky",
  top: 0,
  backgroundColor: "rgba(255, 255, 255, 0.98)",
  backdropFilter: "blur(15px)",
  zIndex: 1000,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  justifyContent: "center",
};

const innerContainerStyle = {
  width: "100%",
  maxWidth: "1200px",
  padding: "0 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logoWrapperStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};
const logoImageStyle = {
  height: "100px", // 로고 크기를 명확하게 지정
  width: "auto",
  display: "block",
  transition: "transform 0.2s ease",
};
const logoLinkStyle = { textDecoration: "none" };

const navStyle = { display: "flex", gap: "32px", alignItems: "center" };
const linkStyle = {
  position: "relative",
  textDecoration: "none",
  fontWeight: "700",
  fontSize: "15px",
  padding: "8px 0",
  transition: "color 0.2s ease",
};
const underlineStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  height: "2px",
  backgroundColor: "#007BFF",
  transition: "width 0.3s ease",
};

const authContainerStyle = { display: "flex", alignItems: "center" };
const userProfileStyle = { display: "flex", alignItems: "center", gap: "20px" };
const userInfoStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
};
const userNameStyle = {
  fontSize: "14px",
  color: "#1e293b",
  marginBottom: "2px",
};

const adminBadgeStyle = {
  fontSize: "10px",
  backgroundColor: "#eff6ff",
  color: "#2563eb",
  padding: "2px 8px",
  borderRadius: "6px",
  fontWeight: "800",
  border: "1px solid #dbeafe",
};

const actionGroupStyle = { display: "flex", alignItems: "center", gap: "12px" };

const myPageIconStyle = {
  textDecoration: "none",
  color: "#475569",
  fontSize: "11px",
  fontWeight: "800",
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  backgroundColor: "#f1f5f9",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "background-color 0.2s",
};

const adminIconStyle = { ...myPageIconStyle, backgroundColor: "#fffbeb" };

const logoutBtnStyle = {
  backgroundColor: "transparent",
  color: "#94a3b8",
  border: "none",
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
  transition: "color 0.2s",
};

const guestGroupStyle = { display: "flex", alignItems: "center", gap: "20px" };
const joinLinkStyle = {
  textDecoration: "none",
  color: "#64748b",
  fontSize: "14px",
  fontWeight: "600",
};
const loginBtnStyle = {
  backgroundColor: "#007BFF",
  color: "#fff",
  padding: "10px 24px",
  borderRadius: "12px",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "800",
  boxShadow: "0 4px 14px rgba(0,123,255,0.2)",
  transition: "all 0.2s ease",
};

export default Header;
