import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import "../../styles/common/Header.css";
import { scrollToTop } from "../../utils/windowUtils";

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCommunityHover, setIsCommunityHover] = useState(false);

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
      className={`header-container ${isScrolled ? "header-scrolled" : ""}`}
    >
      <div className="inner-container">
        {/* LEFT: 로고 영역 */}
        <div className="header-left">
          <Link to="/main" className="logo-link" onClick={scrollToTop}>
            <img src="/lawMateLogo.png" alt="LawMate" className="logo-image" />
          </Link>
        </div>

        {/* CENTER: 메인 네비게이션 */}
        <nav className="header-center">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/main">메인</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/precedent/search">판례검색</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/lawyer/list">변호사찾기</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/question/list">법률질문</NavLink>
            </li>
            <li
              className="nav-item dropdown-wrapper"
              onMouseEnter={() => setIsCommunityHover(true)}
              onMouseLeave={() => setIsCommunityHover(false)}
            >
              <NavLink to="/community/home">커뮤니티</NavLink>
              {isCommunityHover && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/community/qnalist">자유게시판</Link>
                  </li>
                  <li>
                    <Link to="/community/pollList">의견 조사</Link>
                  </li>
                </ul>
              )}
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink to="/chat/list">채팅상담</NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* RIGHT: 사용자 인증 영역 */}
        <div className="header-right">
          {isAuthenticated ? (
            <div className="user-profile-group">
              <div className="user-text-info">
                <span className="user-name">
                  <strong>{user?.name || user?.loginId}</strong>님
                </span>
                {user?.role === "ADMIN" && (
                  <span className="admin-badge">ADMIN</span>
                )}
              </div>
              <div className="user-actions">
                <Link to="/mypage/main" className="my-btn" title="마이페이지">
                  MY
                </Link>
                {user?.loginId === "admin" && (
                  <Link
                    to="/admin/stats"
                    className="admin-setup-btn"
                    title="관리자"
                  >
                    ⚙️
                  </Link>
                )}
                <button onClick={handleLogout} className="logout-button">
                  로그아웃
                </button>
              </div>
            </div>
          ) : (
            <div className="guest-group">
              <Link to="/member/join/type" className="join-link">
                회원가입
              </Link>
              <Link to="/member/login" className="login-button">
                로그인
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, children }) => (
  <Link to={to} className="nav-link" onClick={scrollToTop}>
    {children}
    <div className="nav-underline" />
  </Link>
);

export default Header;
