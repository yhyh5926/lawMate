/**
 * 파일위치: src/pages/admin/AdminMemberListPage.jsx
 * 기능전체: 전체 회원(일반/전문) 목록을 조회하고 탭으로 분류하며, 문제 회원을 정지시키는 페이지입니다.
 */
import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";
import { User, Gavel, ShieldCheck } from "lucide-react";
import "../../styles/admins/AdminMemberListPage.css"; // 💡 외부 CSS 로드

const AdminMemberListPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getMemberList();
      setMembers(response.data?.data || []);
    } catch (error) {
      console.error("회원 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 💡 [은혁 추가] 계정 정지 처리 로직
  const handleSuspend = async (member) => {
    if (!window.confirm(`[${member.loginId}] 회원의 계정을 정말 정지하시겠습니까?\n정지 시 해당 회원은 서비스 이용이 제한됩니다.`)) return;
    
    try {
      const res = await adminApi.suspendMember({ memberId: member.memberId });
      if (res.data.success) {
        alert("계정이 성공적으로 정지 처리되었습니다.");
        fetchMembers(); // 목록 새로고침
      }
    } catch (e) {
      alert("정지 처리에 실패했습니다.");
    }
  };

  // 통계 계산
  const countPersonal = members.filter(m => m.memberType === 'PERSONAL').length;
  const countLawyer = members.filter(m => m.memberType === 'LAWYER').length;

  // 탭 필터링
  const filteredMembers = members.filter(m => {
    if (activeTab === "ALL") return true;
    return m.memberType === activeTab;
  });

  return (
    <div className="ml-wrap">
      {loading ? (
        <div className="ml-loading">회원 데이터를 불러오는 중입니다...</div>
      ) : (
        <>
          {/* 상단 KPI 요약 */}
          <div className="ml-summary-cards">
            <div className="ml-summary-card">
              <div className="ml-summary-title"><div className="ml-summary-dot" style={{background:"#3b82f6"}}/>전체회원</div>
              <div className="ml-summary-val">{members.length}</div>
            </div>
            <div className="ml-summary-card">
              <div className="ml-summary-title"><div className="ml-summary-dot" style={{background:"#10b981"}}/>일반회원</div>
              <div className="ml-summary-val">{countPersonal}</div>
            </div>
            <div className="ml-summary-card">
              <div className="ml-summary-title"><div className="ml-summary-dot" style={{background:"#8b5cf6"}}/>전문회원</div>
              <div className="ml-summary-val">{countLawyer}</div>
            </div>
          </div>

          {/* 탭 메뉴 */}
          <div className="ml-tabs">
            <button className={`ml-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`} onClick={() => setActiveTab('ALL')}>
              전체회원 <span className="ml-tab-count">{members.length}</span>
            </button>
            <button className={`ml-tab-btn ${activeTab === 'PERSONAL' ? 'active' : ''}`} onClick={() => setActiveTab('PERSONAL')}>
              일반회원 <span className="ml-tab-count">{countPersonal}</span>
            </button>
            <button className={`ml-tab-btn ${activeTab === 'LAWYER' ? 'active' : ''}`} onClick={() => setActiveTab('LAWYER')}>
              전문회원 <span className="ml-tab-count">{countLawyer}</span>
            </button>
          </div>

          {/* 회원 테이블 */}
          <div className="ml-card">
            <table className="ml-table">
              <thead>
                <tr>
                  <th>유형</th>
                  <th style={{textAlign: "left"}}>아이디</th>
                  <th>이름</th>
                  <th>연락처</th>
                  <th>상태</th>
                  <th>가입날짜</th>
                  <th>관리 옵션</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length > 0 ? filteredMembers.map((m) => (
                  <tr key={m.memberId}>
                    <td>
                      {m.memberType === 'LAWYER' ? <span className="ml-badge-type lawyer"><Gavel size={12}/> 전문</span> :
                       m.memberType === 'ADMIN'  ? <span className="ml-badge-type admin"><ShieldCheck size={12}/> 관리자</span> :
                       <span className="ml-badge-type personal"><User size={12}/> 일반</span>}
                    </td>
                    <td style={{textAlign: "left", fontWeight: "700"}}>{m.loginId}</td>
                    <td>{m.name || "-"}</td>
                    <td>{m.phone || "-"}</td>
                    <td>
                      {m.status === 'WITHDRAWN' ? 
                        <span className="ml-badge-status withdrawn"><div className="ml-summary-dot" style={{background:"#dc2626", margin:0}}/>정지됨</span> :
                        <span className="ml-badge-status active"><div className="ml-summary-dot" style={{background:"#10b981", margin:0}}/>정상</span>
                      }
                    </td>
                    <td>{m.createdAt?.split('T')[0]}</td>
                    <td>
                      {m.memberType === 'ADMIN' ? (
                        <button className="ml-btn-disabled" disabled>불가</button>
                      ) : m.status === 'WITHDRAWN' ? (
                        <button className="ml-btn-disabled" disabled>정지됨</button>
                      ) : (
                        <button className="ml-btn-suspend" onClick={() => handleSuspend(m)}>계정 정지</button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="ml-empty">조건에 맞는 회원이 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminMemberListPage;