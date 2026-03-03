// src/pages/admin/AdminMemberListPage.jsx

import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

const AdminMemberListPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getMemberList();
      setMembers(response.data?.data || response.data || []);
    } catch (error) {
      console.error("회원 목록 조회 실패", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(m => {
    if (activeTab === "ALL") return true;
    return m.memberType === activeTab;
  });

  const tabs = [
    { id: "ALL",      label: "전체회원",  color: "#3b82f6" },
    { id: "PERSONAL", label: "일반회원",  color: "#10b981" },
    { id: "LAWYER",   label: "전문회원",  color: "#8b5cf6" },
  ];

  const counts = {
    ALL:      members.length,
    PERSONAL: members.filter(m => m.memberType === "PERSONAL").length,
    LAWYER:   members.filter(m => m.memberType === "LAWYER").length,
  };

  return (
    <>
      <style>{`
        .ml-wrap { font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif; }

        /* Stats row */
        .ml-stats { display: flex; gap: 14px; margin-bottom: 24px; }
        .ml-stat-card {
          flex: 1;
          background: #fff;
          border-radius: 12px;
          padding: 18px 22px;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .ml-stat-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .ml-stat-info {}
        .ml-stat-label { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; }
        .ml-stat-num { font-size: 26px; font-weight: 800; color: #0f172a; line-height: 1.2; }

        /* Tabs */
        .ml-tabs { display: flex; gap: 0; border-bottom: 2px solid #e2e8f0; margin-bottom: 0; }
        .ml-tab {
          padding: 12px 22px;
          border: none;
          background: transparent;
          font-size: 13.5px;
          font-weight: 700;
          color: #94a3b8;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          transition: all 0.15s;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .ml-tab.active { color: #0f172a; border-bottom-color: #3b82f6; }
        .ml-tab-count {
          background: #f1f5f9;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 20px;
        }
        .ml-tab.active .ml-tab-count { background: #dbeafe; color: #2563eb; }

        /* Table card */
        .ml-table-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        .ml-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .ml-table thead tr { background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
        .ml-table th {
          padding: 13px 16px;
          font-weight: 700;
          color: #475569;
          text-align: left;
          font-size: 11.5px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          white-space: nowrap;
        }
        .ml-table th.center { text-align: center; }
        .ml-table tbody tr {
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.1s;
        }
        .ml-table tbody tr:hover { background: #f8fafc; }
        .ml-table tbody tr:last-child { border-bottom: none; }
        .ml-table td {
          padding: 14px 16px;
          color: #334155;
          vertical-align: middle;
        }
        .ml-table td.center { text-align: center; }

        .badge-lawyer {
          display: inline-flex; align-items: center; gap: 5px;
          background: #f3e8ff; color: #7c3aed;
          padding: 3px 10px; border-radius: 20px;
          font-size: 11.5px; font-weight: 700;
        }
        .badge-personal {
          display: inline-flex; align-items: center; gap: 5px;
          background: #dbeafe; color: #1d4ed8;
          padding: 3px 10px; border-radius: 20px;
          font-size: 11.5px; font-weight: 700;
        }
        .status-active { color: #059669; font-weight: 700; font-size: 12.5px; }
        .status-inactive { color: #dc2626; font-weight: 700; font-size: 12.5px; }

        .ml-empty { padding: 60px 20px; text-align: center; color: #94a3b8; font-size: 14px; font-weight: 600; }

        .ml-loading { padding: 60px; text-align: center; color: #94a3b8; font-weight: 600; }
      `}</style>

      <div className="ml-wrap">
        {/* Stats */}
        <div className="ml-stats">
          {tabs.map(t => (
            <div className="ml-stat-card" key={t.id}>
              <div className="ml-stat-dot" style={{ background: t.color }}/>
              <div className="ml-stat-info">
                <div className="ml-stat-label">{t.label}</div>
                <div className="ml-stat-num">{counts[t.id]}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table card with tabs inside */}
        <div className="ml-table-card">
          {/* Tabs */}
          <div className="ml-tabs" style={{ padding: "0 8px", borderBottom: "1px solid #e2e8f0" }}>
            {tabs.map(t => (
              <button
                key={t.id}
                className={`ml-tab ${activeTab === t.id ? "active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
                <span className="ml-tab-count">{counts[t.id]}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="ml-loading">데이터를 불러오는 중입니다...</div>
          ) : (
            <table className="ml-table">
              <thead>
                <tr>
                  <th>유형</th>
                  <th>아이디</th>
                  <th>이름</th>
                  <th>연락처</th>
                  <th className="center">상태</th>
                  <th>가입날짜</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => (
                  <tr key={m.memberId}>
                    <td>
                      {m.memberType === 'LAWYER' ? (
                        <span className="badge-lawyer">👨‍⚖️ 전문</span>
                      ) : (
                        <span className="badge-personal">👤 일반</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>{m.loginId}</td>
                    <td>{m.name}</td>
                    <td style={{ color: "#64748b" }}>{m.phone || '—'}</td>
                    <td className="center">
                      {m.status === 'ACTIVE'
                        ? <span className="status-active">● 정상</span>
                        : <span className="status-inactive">● 탈퇴/정지</span>}
                    </td>
                    <td style={{ color: "#94a3b8", fontSize: "12.5px" }}>{m.createdAt?.split('T')[0]}</td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr><td colSpan="6" className="ml-empty">조회된 회원이 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminMemberListPage;
