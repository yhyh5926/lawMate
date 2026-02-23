import { NavLink, Outlet, useNavigate } from "react-router-dom";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "navItem navItemActive" : "navItem")}
    >
      {children}
    </NavLink>
  );
}

export default function DashboardLayout() {
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>SmartLaw</h2>

        <nav className="nav">
          <NavItem to="/">메인</NavItem>
          <NavItem to="/search">판례검색</NavItem>
          <NavItem to="/community/qna/write">질문등록</NavItem>
          <NavItem to="/auth">로그인</NavItem>
        </nav>

        <div style={{ marginTop: 16 }}>
          {isLoggedIn ? (
            <button className="btn" onClick={handleLogout} type="button">
              로그아웃
            </button>
          ) : (
            <p className="helperText" style={{ color: "rgba(255,255,255,0.75)" }}>
              로그인 후 질문 등록이 가능합니다.
            </p>
          )}
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
