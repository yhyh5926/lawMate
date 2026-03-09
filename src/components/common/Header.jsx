import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import "../../styles/common/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCommunityHover, setIsCommunityHover] = useState(false); // 커뮤니티 드롭다운 상태

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate("/main");
    }
  };

  return (
    <header
      className={`header-container ${isScrolled ? "header-scrolled" : "header-top"}`}
    >
      <div className="inner-container">
        <div className="logo-wrapper">
          <Link to="/main" className="logo-link">
            <img
              src="/lawMateLogo.png"
              alt="LawMate Logo"
              className="logo-image"
            />
          </Link>
        </div>

        <nav className="nav-menu">
          <NavLink to="/main">메인</NavLink>
          <NavLink to="/precedent/search">판례검색</NavLink>
          <NavLink to="/lawyer/list">변호사찾기</NavLink>
          <NavLink to="/question/list">법률질문</NavLink>

          <div
            className="dropdown-wrapper"
            onMouseEnter={() => setIsCommunityHover(true)}
            onMouseLeave={() => setIsCommunityHover(false)}
          >
            <NavLink to="/community/home">커뮤니티</NavLink>
            {isCommunityHover && (
              <div className="dropdown-menu">
                <Link to="/community/qnalist" className="dropdown-item">
                  자유게시판
                </Link>
                <Link to="/community/pollList" className="dropdown-item">
                  모의 판결 게시판
                </Link>
              </div>
            )}
          </div>

          {isAuthenticated && <NavLink to="/chat/list">채팅상담</NavLink>}
        </nav>

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
                <Link to="/mypage/main" className="icon-btn" title="마이페이지">
                  MY
                </Link>
                {user?.loginId === "admin" && (
                  <Link
                    to="/admin/stats"
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
              <Link to="/member/join/type" className="join-link">
                회원가입
              </Link>
              <Link to="/member/login" className="login-btn">
                로그인
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, children }) => {
  return (
    <Link to={to} className="nav-link">
      {children}
      <div className="nav-underline" />
    </Link>
  );
};

export default Header;
