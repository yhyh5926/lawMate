// src/pages/admin/AdminApp.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Users, Gavel, Briefcase, CreditCard, AlertTriangle, 
  BarChart3, LogOut, LayoutDashboard, ChevronRight
} from "lucide-react";

import AdminMemberListPage from "./AdminMemberListPage";
import AdminLawyerApprovePage from "./AdminLawyerApprovePage";
import AdminCaseListPage from "./AdminCaseListPage";
import AdminReportListPage from "./AdminReportListPage";
import AdminPaymentPage from "./AdminPaymentPage";
import AdminStatsPage from "./AdminStatsPage";

const AdminApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const menus = [
    { id: "dashboard", name: "종합 대시보드", icon: <LayoutDashboard size={18}/>, path: "/admin/dashboard.do" },
    { id: "members",   name: "회원 통합 관리", icon: <Users size={18}/>,          path: "/admin/member/list.do" },
    { id: "lawyers",   name: "전문회원 승인",  icon: <Gavel size={18}/>,          path: "/admin/lawyer/approve.do" },
    { id: "cases",     name: "사건 모니터링",  icon: <Briefcase size={18}/>,      path: "/admin/case/list.do" },
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
      case "members":  return <AdminMemberListPage />;
      case "lawyers":  return <AdminLawyerApprovePage />;
      case "cases":    return <AdminCaseListPage />;
      case "payments": return <AdminPaymentPage />;
      case "reports":  return <AdminReportListPage />;
      case "dashboard":
      case "stats":    return <AdminStatsPage />;
      default: return (
        <div style={{ textAlign:"center", padding:"80px 20px", color:"#64748b" }}>
          <h2>페이지를 찾을 수 없습니다.</h2>
        </div>
      );
    }
  };

  const currentMenu = menus.find(m => m.id === activeMenu);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .admin-root {
          display: flex;
          min-height: 100vh;
          background: #0a0e1a;
          font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
        }

        /* ── SIDEBAR ── */
        .admin-sidebar {
          width: 260px;
          min-width: 260px;
          background: linear-gradient(180deg, #0d1424 0%, #0a0e1a 100%);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .admin-logo {
          padding: 28px 24px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .admin-logo-text {
          font-size: 20px;
          font-weight: 900;
          letter-spacing: -0.5px;
          color: #fff;
        }
        .admin-logo-text span {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .admin-logo-sub {
          font-size: 11px;
          color: #475569;
          margin-top: 4px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .admin-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        .admin-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: #4b5563; /* 비활성 글자색 - 더 어둡게 */
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
          width: 100%;
          position: relative;
          font-family: inherit;
        }
        .admin-menu-item:hover {
          background: rgba(255,255,255,0.05);
          color: #94a3b8;
        }
        .admin-menu-item.active {
          background: rgba(59,130,246,0.12);
          color: #60a5fa;
        }
        .admin-menu-item.active .menu-icon {
          color: #3b82f6;
        }
        .admin-menu-item .menu-arrow {
          margin-left: auto;
          opacity: 0;
          transition: opacity 0.15s;
          color: #3b82f6;
        }
        .admin-menu-item.active .menu-arrow {
          opacity: 1;
        }
        .menu-icon {
          color: #374151; /* 비활성 아이콘 - 더 어둡게 */
          flex-shrink: 0;
          transition: color 0.15s;
        }

        .admin-sidebar-footer {
          padding: 16px 12px 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .admin-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          width: 100%;
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          background: rgba(239,68,68,0.05);
          color: #ef4444;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
          justify-content: center;
        }
        .admin-logout-btn:hover {
          background: rgba(239,68,68,0.12);
          border-color: rgba(239,68,68,0.4);
        }

        /* ── MAIN ── */
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: #f1f5f9;
        }

        .admin-header {
          height: 64px;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .admin-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #94a3b8;
        }
        .admin-breadcrumb strong {
          color: #0f172a;
          font-weight: 700;
        }
        .admin-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin-badge {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 12px;
          color: #475569;
          font-weight: 600;
        }
        .admin-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 10px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 0.5px;
        }

        .admin-content {
          padding: 32px;
          flex: 1;
          overflow-y: auto;
        }
        .admin-page-title {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .admin-page-title::before {
          content: '';
          display: block;
          width: 4px;
          height: 22px;
          background: linear-gradient(180deg, #3b82f6, #8b5cf6);
          border-radius: 4px;
        }
      `}</style>

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
    </>
  );
};

export default AdminApp;
