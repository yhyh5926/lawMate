import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={headerStyle}>
      <div style={logoStyle}>
        <Link
          to="/main.do"
          style={{ textDecoration: "none", color: "#2c3e50" }}
        >
          ⚖️ LawMate
        </Link>
      </div>

      <nav style={navStyle}>
        <Link to="/precedent/search.do" style={linkStyle}>
          판례검색
        </Link>
        <Link to="/lawyer/list.do" style={linkStyle}>
          변호사찾기
        </Link>
        <Link to="/question/list.do" style={linkStyle}>
          법률질문
        </Link>

        <Link to="/community/home" style={linkStyle}>
          커뮤니티
        </Link>
        <Link to="/chat/list.do" style={linkStyle}>
          채팅상담
        </Link>
      </nav>

      <div style={authStyle}>
        <Link to="/member/login.do" style={loginBtnStyle}>
          로그인
        </Link>
        <Link to="/mypage/edit.do" style={mypageLinkStyle}>
          마이페이지
        </Link>
        {/* 관리자 메뉴는 나중에 조건부 렌더링(관리자일때만) 처리 */}
        <Link
          to="/admin/stats.do"
          style={{ fontSize: "12px", color: "#95a5a6" }}
        >
          Admin
        </Link>
      </div>
    </header>
  );
};

// 스타일 정의
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 5%",
  height: "70px",
  borderBottom: "1px solid #eee",
  position: "sticky",
  top: 0,
  backgroundColor: "#fff",
  zIndex: 1000,
};

const logoStyle = { fontSize: "24px", fontWeight: "bold" };
const navStyle = { display: "flex", gap: "30px" };
const linkStyle = { textDecoration: "none", color: "#333", fontWeight: "500" };
const authStyle = { display: "flex", alignItems: "center", gap: "15px" };

const loginBtnStyle = {
  backgroundColor: "#2c3e50",
  color: "#fff",
  padding: "8px 18px",
  borderRadius: "4px",
  textDecoration: "none",
  fontSize: "14px",
};

const mypageLinkStyle = {
  textDecoration: "none",
  color: "#666",
  fontSize: "14px",
};

export default Header;
