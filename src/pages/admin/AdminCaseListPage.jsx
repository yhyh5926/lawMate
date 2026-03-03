/**
 * 파일 위치: src/pages/admin/AdminCaseListPage.jsx
 * 기능전체: 관리자 전용 사건 모니터링 페이지입니다.
 * 수정사항: 에러 발생 시 출력되던 가상(더미) 데이터를 제거하고, 실제 DB의 데이터만 출력되도록 수정했습니다.
 */
import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

const STEP_CONFIG = {
  IN_PROGRESS: { label: "진행중",   bg: "#dcfce7", color: "#15803d" },
  RECEIVED:    { label: "접수됨",   bg: "#dbeafe", color: "#1d4ed8" },
  COMPLETED:   { label: "완료",     bg: "#f1f5f9", color: "#475569" },
  PENDING:     { label: "대기중",   bg: "#fef9c3", color: "#a16207" },
};

const AdminCaseListPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCases(); }, []);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getCaseList();
      // DB에서 가져온 실제 데이터를 세팅합니다.
      setCases(response.data?.data || response.data || []);
    } catch (error) {
      console.error("사건 목록 조회 실패 (DB 연동 확인 필요):", error);
      // 💡 더미 데이터를 지웠습니다. 이제 연결 실패 시 빈 목록이 나옵니다.
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .cl-wrap { font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif; }
        .cl-card { background:#fff; border-radius:14px; border:1px solid #e2e8f0; overflow:hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .cl-table { width:100%; border-collapse:collapse; font-size:13.5px; }
        .cl-table thead tr { background:#f8fafc; border-bottom:1px solid #e2e8f0; }
        .cl-table th {
          padding:15px 16px; font-weight:700; color:#475569;
          text-align:center; font-size:12px; text-transform:uppercase; letter-spacing:0.6px;
        }
        .cl-table tbody tr { border-bottom:1px solid #f1f5f9; transition:background 0.1s; }
        .cl-table tbody tr:hover { background:#f8fafc; }
        .cl-table td { padding:14px 16px; color:#334155; vertical-align:middle; text-align:center; }
        
        .cl-id { font-size:12px; color:#94a3b8; font-weight:600; }
        .cl-type-badge {
          display:inline-block; padding:3px 9px;
          background:#f1f5f9; color:#475569;
          border-radius:6px; font-size:11.5px; font-weight:700;
          border:1px solid #e2e8f0;
        }
        .cl-title { font-weight:600; color:#0f172a; text-align: left; display: block; }
        .cl-step-badge { display:inline-block; padding:4px 10px; border-radius:20px; font-size:11.5px; font-weight:700; }
        .cl-date { font-size:12.5px; color:#94a3b8; }
        .cl-empty { padding:80px; text-align:center; color:#94a3b8; font-weight:600; }
        .cl-loading { padding:80px; text-align:center; color:#64748b; font-weight:600; }
      `}</style>

      <div className="cl-wrap">
        {loading ? (
          <div className="cl-loading">서버에서 사건 데이터를 가져오는 중입니다...</div>
        ) : (
          <div className="cl-card">
            <table className="cl-table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>유형</th>
                  <th style={{ textAlign: 'left' }}>사건제목</th>
                  <th>진행단계</th>
                  <th>접수일</th>
                </tr>
              </thead>
              <tbody>
                {cases.length > 0 ? cases.map((c) => {
                  const step = STEP_CONFIG[c.step] || { label: c.step, bg: "#f1f5f9", color: "#64748b" };
                  return (
                    <tr key={c.caseId}>
                      <td><span className="cl-id">#{c.caseId}</span></td>
                      <td><span className="cl-type-badge">{c.caseType}</span></td>
                      <td><span className="cl-title">{c.title}</span></td>
                      <td>
                        <span className="cl-step-badge" style={{ background: step.bg, color: step.color }}>
                          {step.label}
                        </span>
                      </td>
                      <td><span className="cl-date">{c.createdAt?.split('T')[0]}</span></td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="5" className="cl-empty">DB에 등록된 사건 내역이 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminCaseListPage;