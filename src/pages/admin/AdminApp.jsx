// 파일 위치: src/pages/admin/AdminApp.jsx
// 설명: Tailwind CSS 없이 인라인 스타일만으로 완벽하게 동작하도록 재작성된 통합 관리자 시스템입니다.

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Users, Gavel, Briefcase, CreditCard, AlertTriangle, 
  BarChart3, LogOut, LayoutDashboard
} from "lucide-react";

// Canvas 미리보기 환경 컴파일 오류 해결을 위한 임시 Mock API 객체입니다.
// 🚨 실제 프로젝트(VS Code) 환경에서는 아래 객체를 지우고 주석을 해제하여 사용하세요.
// import { adminApi } from "../../api/adminApi";
const adminApi = {
  getStats: async () => ({ 
    data: { 
      users: [{date:"02-23",count:10},{date:"02-24",count:25},{date:"02-25",count:15},{date:"02-26",count:40},{date:"02-27",count:62}], 
      cases: [{date:"02-23",count:5},{date:"02-24",count:12},{date:"02-25",count:8},{date:"02-26",count:15},{date:"02-27",count:30}] 
    } 
  }),
  getMemberList: async () => ({ 
    data: [ 
      { memberId: 1, memberType: 'PERSONAL', loginId: 'user01', phone: '010-1234-5678', status: 'ACTIVE' }, 
      { memberId: 2, memberType: 'LAWYER', loginId: 'lawyer01', phone: '010-8765-4321', status: 'ACTIVE' } 
    ] 
  })
};

// ==========================================
// 1. 공통 인라인 스타일 정의 (CSS 파일 필요 없음)
// ==========================================
const s = {
  layout: { display: "flex", minHeight: "100vh", backgroundColor: "#f4f6f8", fontFamily: "sans-serif" },
  sidebar: { width: "260px", backgroundColor: "#1e293b", color: "#fff", display: "flex", flexDirection: "column" },
  logo: { padding: "20px 25px", fontSize: "22px", fontWeight: "900", borderBottom: "1px solid #334155", color: "#60a5fa", letterSpacing: "1px" },
  menu: { padding: "15px 0", flex: 1 },
  menuBtn: { width: "100%", padding: "15px 25px", display: "flex", alignItems: "center", gap: "12px", backgroundColor: "transparent", border: "none", color: "#94a3b8", fontSize: "15px", cursor: "pointer", textAlign: "left", transition: "0.2s" },
  activeMenuBtn: { backgroundColor: "#334155", color: "#fff", borderLeft: "5px solid #3b82f6", fontWeight: "bold" },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  header: { height: "70px", backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 30px" },
  content: { padding: "40px", flex: 1, overflowY: "auto" },
  card: { backgroundColor: "#fff", borderRadius: "10px", padding: "25px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: "25px" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "center" },
  th: { padding: "15px", borderBottom: "2px solid #e2e8f0", backgroundColor: "#f8fafc", color: "#475569", fontWeight: "bold", fontSize: "14px" },
  td: { padding: "15px", borderBottom: "1px solid #e2e8f0", color: "#334155", fontSize: "14px" },
  badgeBlue: { padding: "5px 10px", backgroundColor: "#dbeafe", color: "#1e40af", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" },
  badgeRed: { padding: "5px 10px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" },
  badgeGreen: { padding: "5px 10px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }
};

// ==========================================
// 2. 내부 서브 페이지 컴포넌트
// ==========================================

// [회원 관리 화면]
const MemberListPage = () => {
  const [members, setMembers] = useState([]);
  
  useEffect(() => {
    adminApi.getMemberList().then(res => setMembers(res.data.data || res.data || [])).catch(console.error);
  }, []);

  return (
    <div style={s.card}>
      <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#1e293b", fontSize: "20px" }}>👥 전체 회원 관리</h3>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>번호</th>
            <th style={s.th}>유형</th>
            <th style={s.th}>아이디</th>
            <th style={{...s.th, textAlign: "left"}}>연락처</th>
            <th style={s.th}>상태</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.memberId}>
              <td style={s.td}>{m.memberId}</td>
              <td style={s.td}>
                <span style={m.memberType === 'LAWYER' ? s.badgeBlue : s.badgeGreen}>
                  {m.memberType === 'LAWYER' ? '전문' : '일반'}
                </span>
              </td>
              <td style={{...s.td, fontWeight: "bold"}}>{m.loginId}</td>
              <td style={{...s.td, textAlign: "left"}}>{m.phone || "연락처 없음"}</td>
              <td style={s.td}>
                <span style={m.status === 'ACTIVE' ? {color: "#166534", fontWeight: "bold"} : {color: "#dc2626", fontWeight: "bold"}}>
                  {m.status}
                </span>
              </td>
            </tr>
          ))}
          {members.length === 0 && <tr><td colSpan="5" style={{padding: "40px", color: "#94a3b8"}}>데이터가 없습니다.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

// [통계 대시보드 화면]
const StatsPage = () => {
  const [stats, setStats] = useState({ users: [], cases: [] });
  
  useEffect(() => {
    adminApi.getStats().then(res => setStats(res.data.data || res.data)).catch(console.error);
  }, []);

  const renderChart = (data, title, color) => {
    const max = Math.max(...(data?.map(d => d.count) || [1]), 1);
    return (
      <div style={{ ...s.card, flex: 1, margin: "0 10px" }}>
        <h4 style={{ marginTop: 0, color: "#334155" }}>{title}</h4>
        <div style={{ display: "flex", alignItems: "flex-end", height: "200px", gap: "15px", marginTop: "30px" }}>
          {data?.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ 
                width: "100%", 
                backgroundColor: color, 
                height: `${(d.count / max) * 100}%`, 
                minHeight: "10px", 
                borderRadius: "4px 4px 0 0",
                position: "relative"
              }}>
                <span style={{ position: "absolute", top: "-25px", width: "100%", textAlign: "center", fontSize: "12px", fontWeight: "bold", color: "#475569" }}>
                  {d.count}
                </span>
              </div>
              <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "8px" }}>{d.date}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", margin: "0 -10px" }}>
        {renderChart(stats.users, "📈 신규 회원 가입 추이", "#3b82f6")}
        {renderChart(stats.cases, "⚖️ 신규 사건 접수 추이", "#8b5cf6")}
      </div>
      <div style={{ ...s.card, backgroundColor: "#1e293b", color: "#fff", display: "flex", justifyContent: "space-around", marginTop: "10px", padding: "40px 20px" }}>
        <div style={{ textAlign: "center" }}><p style={{ margin: "0 0 10px 0", color: "#94a3b8", fontSize: "14px" }}>누적 일반 회원</p><h2 style={{ margin: 0, fontSize: "36px", color: "#fff" }}>1,204</h2></div>
        <div style={{ textAlign: "center" }}><p style={{ margin: "0 0 10px 0", color: "#94a3b8", fontSize: "14px" }}>활동 전문 회원</p><h2 style={{ margin: 0, fontSize: "36px", color: "#60a5fa" }}>85</h2></div>
        <div style={{ textAlign: "center" }}><p style={{ margin: "0 0 10px 0", color: "#94a3b8", fontSize: "14px" }}>해결 완료 사건</p><h2 style={{ margin: 0, fontSize: "36px", color: "#34d399" }}>218</h2></div>
      </div>
    </div>
  );
};


// ==========================================
// 3. 메인 앱 (사이드바 + 콘텐츠 영역)
// ==========================================
const AdminApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const menus = [
    { id: "dashboard", name: "종합 대시보드", icon: <LayoutDashboard size={20}/>, path: "/admin/dashboard.do" },
    { id: "members", name: "회원 통합 관리", icon: <Users size={20}/>, path: "/admin/member/list.do" },
    { id: "lawyers", name: "전문회원 승인", icon: <Gavel size={20}/>, path: "/admin/lawyer/approve.do" },
    { id: "cases", name: "사건 모니터링", icon: <Briefcase size={20}/>, path: "/admin/case/list.do" },
    { id: "payments", name: "결제 및 정산", icon: <CreditCard size={20}/>, path: "/admin/payment/list.do" },
    { id: "reports", name: "신고 관리 센터", icon: <AlertTriangle size={20}/>, path: "/admin/report/list.do" },
    { id: "stats", name: "서비스 지표통계", icon: <BarChart3 size={20}/>, path: "/admin/stats.do" },
  ];

  useEffect(() => {
    // 현재 주소에 맞춰 사이드바 활성화 상태 변경
    const current = menus.find(m => location.pathname.includes(m.path));
    if (current) setActiveMenu(current.id);
  }, [location.pathname]);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu.id);
    navigate(menu.path);
  };

  const renderContent = () => {
    switch(activeMenu) {
      case "members": return <MemberListPage />;
      case "dashboard": 
      case "stats": return <StatsPage />;
      default: return (
        <div style={{...s.card, textAlign: "center", padding: "80px 20px", color: "#94a3b8" }}>
          <h2 style={{ margin: 0 }}>데이터를 불러오는 중입니다.</h2>
          <p>해당 메뉴의 기능이 화면에 매핑됩니다.</p>
        </div>
      );
    }
  };

  return (
    <div style={s.layout}>
      {/* 왼쪽 사이드바 영역 */}
      <aside style={s.sidebar}>
        <div style={s.logo}>
          LawMate <span style={{ color: "#fff", fontWeight: "normal", fontSize: "16px" }}>Admin</span>
        </div>
        <nav style={s.menu}>
          {menus.map((menu) => {
            const isActive = activeMenu === menu.id;
            return (
              <button 
                key={menu.id} 
                onClick={() => handleMenuClick(menu)}
                style={{ ...s.menuBtn, ...(isActive ? s.activeMenuBtn : {}) }}
              >
                {menu.icon}
                {menu.name}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "20px" }}>
          <button 
            onClick={() => { if(window.confirm("메인으로 나가시겠습니까?")) navigate("/main.do"); }}
            style={{ ...s.menuBtn, color: "#f87171", border: "1px solid #7f1d1d", borderRadius: "8px", justifyContent: "center" }}
          >
            <LogOut size={18}/> 시스템 나가기
          </button>
        </div>
      </aside>

      {/* 오른쪽 메인 본문 영역 */}
      <main style={s.main}>
        <header style={s.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ fontSize: "14px", fontWeight: "bold", color: "#334155" }}>최고 관리자 님</span>
            <div style={{ width: "40px", height: "40px", backgroundColor: "#3b82f6", borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
              AD
            </div>
          </div>
        </header>

        <div style={s.content}>
          <h2 style={{ marginTop: 0, marginBottom: "30px", fontSize: "28px", color: "#0f172a" }}>
            {menus.find(m => m.id === activeMenu)?.name}
          </h2>
          {/* 메뉴에 따라 바뀌는 화면 */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminApp;