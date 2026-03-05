// src/components/common/Header.jsx
/**
 * 파일 위치: src/components/common/Header.jsx
 * 수정 사항: MY 버튼 클릭 시 메인 마이페이지(/mypage/main.do)로 이동하도록 경로를 수정하고, 인라인 스타일을 외부 CSS로 분리했습니다.
 */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import "../../styles/common/Header.css";

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
    <header className={`header-container ${isScrolled ? "header-scrolled" : "header-top"}`}>
      <div className="inner-container">
        {/* 1. 로고 영역 */}
        <div className="logo-wrapper">
          <Link to="/main.do" className="logo-link">
            <img
              src="/lawMateLogo.png"
              alt="LawMate Logo"
              className="logo-image"
            />
          </Link>
        </div>

        {/* 2. 메인 네비게이션 */}
        <nav className="nav-menu">
          <NavLink to="/main.do">메인</NavLink>
          <NavLink to="/precedent/search.do">판례검색</NavLink>
          <NavLink to="/lawyer/list.do">변호사찾기</NavLink>
          <NavLink to="/question/list.do">법률질문</NavLink>
          <NavLink to="/community/home">커뮤니티</NavLink>
          {isAuthenticated && <NavLink to="/chat/list.do">채팅상담</NavLink>}
        </nav>

        {/* 3. 유저 액션 영역 */}
        <div className="auth-container">
          {isAuthenticated ? (
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">
                  <strong>{user?.name || user?.loginId}</strong>님
                </span>
                {user?.role === "ADMIN" && (
                  <span className="admin-badge">관리자</span>
                )}
              </div>

              <div className="action-group">
                {/* 💡 [수정] MY 버튼의 링크를 메인 마이페이지로 변경 */}
                <Link
                  to="/mypage/main.do"
                  className="icon-btn"
                  title="마이페이지"
                >
                  MY
                </Link>
                
                {user?.loginId === "admin" && (
                  <Link
                    to="/admin/stats.do"
                    className="icon-btn admin-icon-btn"
                    title="관리자 대시보드"
                  >
                    <span style={{ fontSize: "18px" }}>⚙️</span>
                  </Link>
                )}
                <button onClick={handleLogout} className="logout-btn">
                  로그아웃
                </button>
              </div>
            </div>
          ) : (
            <div className="guest-group">
              <Link to="/member/join/type.do" className="join-link">
                회원가입
              </Link>
              <Link to="/member/login.do" className="login-btn">
                로그인
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// --- 호버 효과를 위한 공통 NavLink 컴포넌트 ---
const NavLink = ({ to, children }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <Link
      to={to}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="nav-link"
      style={{ color: isHover ? "#007BFF" : "#334155" }}
    >
      {children}
      <div className="nav-underline" style={{ width: isHover ? "100%" : "0" }} />
    </Link>
  );
};

export default Header;