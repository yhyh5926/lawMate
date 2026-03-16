import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import "../../styles/common/Header.css";
import { scrollToTop } from "../../utils/windowUtils";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isCommunityHover, setIsCommunityHover] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileCommunity, setIsMobileCommunity] = useState(false);
  const communityTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => setIsMobileOpen(false);

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate("/main");
    }
  };

  const handleCommunityEnter = () => {
    clearTimeout(communityTimer.current);
    setIsCommunityHover(true);
  };
  const handleCommunityLeave = () => {
    communityTimer.current = setTimeout(() => setIsCommunityHover(false), 120);
  };
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      <header className={`hd-root ${isScrolled ? "hd-scrolled" : "hd-top"}`}>
        <div className="hd-inner">
          {/* 로고 */}
          <Link to="/main" className="hd-logo" onClick={scrollToTop}>
            <img src="/lawMateLogo.png" alt="LawMate" className="hd-logo-img" />
          </Link>

          {/* 데스크탑 네비 */}
          <nav className="hd-nav" aria-label="주요 메뉴">
            <NavItem to="/main" active={isActive("/main")}>
              메인
            </NavItem>
            <NavItem to="/precedent/search" active={isActive("/precedent")}>
              판례검색
            </NavItem>
            <NavItem to="/lawyer/list" active={isActive("/lawyer")}>
              변호사찾기
            </NavItem>
            <NavItem to="/question/list" active={isActive("/question")}>
              법률질문
            </NavItem>

            <div
              className="hd-dropdown-wrap"
              onMouseEnter={handleCommunityEnter}
              onMouseLeave={handleCommunityLeave}
            >
              <NavItem to="/community/home" active={isActive("/community")}>
                커뮤니티
                <svg
                  className={`hd-chevron ${isCommunityHover ? "hd-chevron--up" : ""}`}
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2 4l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </NavItem>
              {isCommunityHover && (
                <ul className="hd-dropdown">
                  <li>
                    <Link
                      to="/community/qnalist"
                      className="hd-dropdown-item"
                      onClick={scrollToTop}
                    >
                      자유게시판
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/community/pollList"
                      className="hd-dropdown-item"
                      onClick={scrollToTop}
                    >
                      의견 조사
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {isAuthenticated && (
              <NavItem to="/chat/list" active={isActive("/chat")}>
                채팅상담
              </NavItem>
            )}
          </nav>

          {/* 인증 영역 */}
          <div className="hd-auth">
            {isAuthenticated ? (
              <div className="hd-user">
                <div className="hd-user-info">
                  <span className="hd-user-name">
                    <strong>{user?.name || user?.loginId}</strong>님
                  </span>
                  {user?.role === "ADMIN" && (
                    <span className="hd-admin-badge">ADMIN</span>
                  )}
                </div>
                <div className="hd-user-actions">
                  <Link
                    to="/mypage/main"
                    className="hd-icon-btn"
                    title="마이페이지"
                  >
                    MY
                  </Link>
                  {user?.loginId === "admin" && (
                    <Link
                      to="/admin/stats"
                      className="hd-icon-btn hd-icon-btn--admin"
                      title="관리자"
                    >
                      ⚙️
                    </Link>
                  )}
                  <button className="hd-logout-btn" onClick={handleLogout}>
                    로그아웃
                  </button>
                </div>
              </div>
            ) : (
              <div className="hd-guest">
                <Link to="/member/join/type" className="hd-join-link">
                  회원가입
                </Link>
                <Link to="/member/login" className="hd-login-btn">
                  로그인
                </Link>
              </div>
            )}
          </div>

          {/* 햄버거 */}
          <button
            className={`hd-hamburger ${isMobileOpen ? "hd-hamburger--open" : ""}`}
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label="메뉴"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* 모바일 드로어 */}
      <div
        className={`hd-drawer ${isMobileOpen ? "hd-drawer--open" : ""}`}
        aria-hidden={!isMobileOpen}
      >
        <nav className="hd-drawer-nav">
          <MobileNavItem to="/main" onClose={closeMobile}>
            메인
          </MobileNavItem>
          <MobileNavItem to="/precedent/search" onClose={closeMobile}>
            판례검색
          </MobileNavItem>
          <MobileNavItem to="/lawyer/list" onClose={closeMobile}>
            변호사찾기
          </MobileNavItem>
          <MobileNavItem to="/question/list" onClose={closeMobile}>
            법률질문
          </MobileNavItem>

          <div className="hd-mobile-accordion">
            <button
              className="hd-mobile-accordion-btn"
              onClick={() => setIsMobileCommunity((v) => !v)}
            >
              커뮤니티
              <svg
                className={`hd-chevron ${isMobileCommunity ? "hd-chevron--up" : ""}`}
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2 4l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isMobileCommunity && (
              <div className="hd-mobile-sub">
                <MobileNavItem
                  to="/community/qnalist"
                  sub
                  onClose={closeMobile}
                >
                  자유게시판
                </MobileNavItem>
                <MobileNavItem
                  to="/community/pollList"
                  sub
                  onClose={closeMobile}
                >
                  의견 조사
                </MobileNavItem>
              </div>
            )}
          </div>

          {isAuthenticated && (
            <MobileNavItem to="/chat/list" onClose={closeMobile}>
              채팅상담
            </MobileNavItem>
          )}
        </nav>

        <div className="hd-drawer-auth">
          {isAuthenticated ? (
            <>
              <div className="hd-drawer-user">
                <span className="hd-drawer-name">
                  <strong>{user?.name || user?.loginId}</strong>님
                </span>
                {user?.role === "ADMIN" && (
                  <span className="hd-admin-badge">ADMIN</span>
                )}
              </div>
              <div className="hd-drawer-actions">
                <Link
                  to="/mypage/main"
                  className="hd-drawer-btn"
                  onClick={closeMobile}
                >
                  마이페이지
                </Link>
                <button
                  className="hd-drawer-btn hd-drawer-btn--logout"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </div>
            </>
          ) : (
            <div className="hd-drawer-guest">
              <Link
                to="/member/login"
                className="hd-drawer-login-btn"
                onClick={closeMobile}
              >
                로그인
              </Link>
              <Link
                to="/member/join/type"
                className="hd-drawer-join-btn"
                onClick={closeMobile}
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>

      {isMobileOpen && (
        <div className="hd-overlay" onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  );
};

const NavItem = ({ to, children, active }) => (
  <Link
    to={to}
    className={`hd-nav-link ${active ? "hd-nav-link--active" : ""}`}
    onClick={scrollToTop}
  >
    {children}
  </Link>
);

const MobileNavItem = ({ to, children, sub, onClose }) => (
  <Link
    to={to}
    className={`hd-mobile-link ${sub ? "hd-mobile-link--sub" : ""}`}
    onClick={() => {
      scrollToTop();
      onClose?.();
    }}
  >
    {children}
  </Link>
);

export default Header;
