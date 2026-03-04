// src/pages/admin/AdminApp.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Users, Gavel, MessageSquare, CreditCard, AlertTriangle, 
  BarChart3, LogOut, LayoutDashboard, ChevronRight
} from "lucide-react"; // MessageSquare 아이콘 추가

import AdminMemberListPage from "./AdminMemberListPage";
import AdminLawyerApprovePage from "./AdminLawyerApprovePage";
import AdminCommunityPage from "./AdminCommunityPage"; // AdminCaseListPage -> AdminCommunityPage 교체
import AdminReportListPage from "./AdminReportListPage";
import AdminPaymentPage from "./AdminPaymentPage";
import AdminStatsPage from "./AdminStatsPage";

// 외부로 분리한 CSS 파일 임포트
import "../../styles/admins/AdminApp.css";

const AdminApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const menus = [
    { id: "dashboard", name: "종합 대시보드", icon: <LayoutDashboard size={18}/>, path: "/admin/dashboard.do" },
    { id: "members",   name: "회원 통합 관리", icon: <Users size={18}/>,          path: "/admin/member/list.do" },
    { id: "lawyers",   name: "전문회원 승인",  icon: <Gavel size={18}/>,          path: "/admin/lawyer/approve.do" },
    { id: "community", name: "커뮤니티 관리",  icon: <MessageSquare size={18}/>,  path: "/admin/community/list.do" }, // 사건 모니터링 -> 커뮤니티 관리로 교체
    { id: "payments",  name: "결제 및 정산",   icon: <CreditCard size={18}/>,     path: "/admin/payment/list.do" },
    { id: "reports",   name: "신고 관리 센터", icon: <AlertTriangle size={18}/>,  path: "/admin/report/list.do" },
    { id: "stats",     name: "서비스 지표통계", icon: <BarChart3 size={18}/>,     path: "/admin/stats.do" },
  ];

  useEffect(() => {
    const current = menus.find(m => location.pathname.includes(m.path));
    if (current) setActiveMenu(current.id);
  }, [location.pathname]);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu.id);
    navigate(menu.path);
  };

  const renderContent = () => {
    switch(activeMenu) {
      case "members":   return <AdminMemberListPage />;
      case "lawyers":   return <AdminLawyerApprovePage />;
      case "community": return <AdminCommunityPage />; // cases 렌더링을 community로 교체
      case "payments":  return <AdminPaymentPage />;
      case "reports":   return <AdminReportListPage />;
      case "dashboard":
      case "stats":     return <AdminStatsPage />;
      default: return (
        <div style={{ textAlign:"center", padding:"80px 20px", color:"#64748b" }}>
          <h2>페이지를 찾을 수 없습니다.</h2>
        </div>
      );
    }
  };

  const currentMenu = menus.find(m => m.id === activeMenu);

  return (
    <div className="admin-root">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="admin-logo-text"><span>LawMate</span> Admin</div>
          <div className="admin-logo-sub">Management Console</div>
        </div>

        <nav className="admin-nav">
          {menus.map((menu) => (
            <button
              key={menu.id}
              onClick={() => handleMenuClick(menu)}
              className={`admin-menu-item ${activeMenu === menu.id ? "active" : ""}`}
            >
              <span className="menu-icon">{menu.icon}</span>
              {menu.name}
              <ChevronRight size={14} className="menu-arrow" />
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="admin-logout-btn"
            onClick={() => { if(window.confirm("메인으로 나가시겠습니까?")) navigate("/main.do"); }}
          >
            <LogOut size={15}/> 시스템 나가기
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-breadcrumb">
            LawMate Admin <ChevronRight size={13}/> <strong>{currentMenu?.name}</strong>
          </div>
          <div className="admin-header-right">
            <span className="admin-badge">최고 관리자</span>
            <div className="admin-avatar">AD</div>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-page-title">{currentMenu?.name}</div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminApp;