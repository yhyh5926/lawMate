// src/pages/admin/AdminReportListPage.jsx
/**
 * 파일위치: src/pages/admin/AdminReportListPage.jsx
 * 기능전체: 신고 내역을 조회하고 실제 DB와 연동하여 유저 제재를 확정하는 관리자 페이지입니다.
 * 수정사항: 가짜 알림창 대신 실제 API(processSanction)를 호출하도록 로직을 완성하고, DB의 상세 내용을 모달에 바인딩했습니다.
 */

import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

const AdminReportListPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, PENDING, RESOLVED
  const [selectedReport, setSelectedReport] = useState(null); // 모달에 표시할 실제 데이터

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getReportList();
      // DB에서 가져온 실제 데이터를 세팅합니다.
      setReports(response.data?.data || response.data || []);
    } catch (error) {
      console.error("신고 목록 조회 실패", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // 탭 필터링 로직 (DB 상태값인 RESOLVED와 일치하도록 수정)
  const filteredReports = reports.filter(r => {
    if (activeTab === "ALL") return true;
    return r.status === activeTab;
  });

  const pendingCount = reports.filter(r => r.status === 'PENDING').length;

  /**
   * 💡 제재 처리 함수 (실제 API 연동)
   * @param {string} typeLabel - 화면 표시용 라벨 (무혐의, 경고 등)
   * @param {string} status - DB에 저장될 신고 상태 (RESOLVED, DISMISSED)
   * @param {string} sanctionType - DB에 저장될 제재 유형 (WARNING, SUSPEND, FORCE_WITHDRAW, NONE)
   */
  const handleProcessSanction = async (typeLabel, status, sanctionType) => {
    if (!window.confirm(`해당 신고 건에 대해 [${typeLabel}] 처리를 진행하시겠습니까?`)) return;

    const payload = {
      reportId: selectedReport.reportId,
      targetMemberId: selectedReport.targetId, // 신고 대상자 ID (targetType이 MEMBER일 경우)
      status: status,
      resultNote: `관리자 조치: ${typeLabel}`,
      sanctionType: sanctionType
    };

    try {
      const response = await adminApi.processSanction(payload);
      if (response.data.success) {
        alert(`${selectedReport.reportId}번 신고 건이 정상적으로 처리되었습니다.`);
        setSelectedReport(null);
        fetchReports(); // 목록 새로고침
      }
    } catch (error) {
      console.error("제재 처리 중 오류 발생:", error);
      alert("처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <style>{`
        .rl-wrap { font-family: 'Pretendard', sans-serif; padding: 20px; }
        .rl-tabs { display: flex; border-bottom: 2px solid #e2e8f0; margin-bottom: 25px; gap: 10px; }
        .rl-tab-btn { 
          padding: 12px 24px; border: none; background: none; cursor: pointer;
          font-weight: 700; color: #94a3b8; font-size: 15px; transition: 0.2s;
          border-bottom: 3px solid transparent; margin-bottom: -2px;
        }
        .rl-tab-btn.active { color: #0f172a; border-bottom-color: #0f172a; }
        
        .rl-notice {
          display: flex; align-items: center; gap: 10px;
          background: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px;
          padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #92400e; font-weight: 600;
        }

        .rl-card { background:#fff; border-radius:14px; border:1px solid #e2e8f0; overflow:hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .rl-table { width:100%; border-collapse:collapse; font-size:13.5px; }
        .rl-table thead tr { background:#f8fafc; border-bottom:1px solid #e2e8f0; }
        .rl-table th { padding:15px 16px; font-weight:700; color:#475569; font-size:12px; text-align:center; }
        .rl-table td { padding:14px 16px; color:#334155; vertical-align:middle; text-align:center; border-bottom:1px solid #f1f5f9; }

        .rl-status-pending { padding:4px 10px; background:#fef2f2; color:#dc2626; border-radius:20px; font-size:11.5px; font-weight:700; }
        .rl-status-done { padding:4px 10px; background:#f0fdf4; color:#15803d; border-radius:20px; font-size:11.5px; font-weight:700; }
        
        .rl-action-btn {
          padding: 7px 14px; background: #0f172a; color: #fff; border: none; border-radius: 8px;
          font-size: 12px; font-weight: 700; cursor: pointer;
        }

        /* 모달 스타일 */
        .rl-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .rl-modal { background: #fff; width: 450px; border-radius: 20px; overflow: hidden; animation: fadeIn 0.2s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .rl-modal-header { padding: 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-weight: 800; display: flex; justify-content: space-between; }
        .rl-modal-body { padding: 25px; }
        .rl-reason-box { background: #f1f5f9; padding: 15px; border-radius: 10px; margin-top: 10px; font-size: 14px; line-height: 1.5; color: #475569; min-height: 80px; }
        .rl-modal-footer { padding: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f8fafc; }
        .btn-sanction { padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; font-weight: 700; cursor: pointer; background: #fff; font-size: 12px; transition: 0.2s; }
        .btn-sanction:hover { background: #f8fafc; }
        .btn-sanction.red { color: #dc2626; border-color: #fecaca; }
        .btn-sanction.red:hover { background: #fef2f2; }
        .btn-close { grid-column: span 2; padding: 12px; background: #0f172a; color: #fff; border: none; border-radius: 8px; font-weight: 700; margin-top: 5px; cursor: pointer; }
      `}</style>

      <div className="rl-wrap">
        {/* 상단 알림 */}
        {pendingCount > 0 && (
          <div className="rl-notice">
            <span>⚠️</span> 미처리 신고 <strong>{pendingCount}건</strong>이 처리를 기다리고 있습니다.
          </div>
        )}

        {/* 탭 메뉴 (DB 정의서에 맞춰 PENDING/RESOLVED로 매칭) */}
        <div className="rl-tabs">
          <button className={`rl-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`} onClick={() => setActiveTab('ALL')}>전체</button>
          <button className={`rl-tab-btn ${activeTab === 'PENDING' ? 'active' : ''}`} onClick={() => setActiveTab('PENDING')}>신규</button>
          <button className={`rl-tab-btn ${activeTab === 'RESOLVED' ? 'active' : ''}`} onClick={() => setActiveTab('RESOLVED')}>제재완료</button>
        </div>

        {loading ? (
          <div className="rl-loading">신고 데이터를 불러오는 중...</div>
        ) : (
          <div className="rl-card">
            <table className="rl-table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>신고자</th>
                  <th>대상유형</th>
                  <th style={{textAlign:'left'}}>신고사유</th>
                  <th>처리상태</th>
                  <th>접수일</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length > 0 ? filteredReports.map((r) => (
                  <tr key={r.reportId}>
                    <td><span style={{color:'#94a3b8'}}>#{r.reportId}</span></td>
                    <td style={{fontWeight: 700}}>{r.reporterName || `회원(${r.reporterId})`}</td>
                    <td><span style={{background:'#f1f5f9', padding:'3px 8px', borderRadius:'5px', fontWeight:700, fontSize:'11px'}}>{r.targetType}</span></td>
                    <td style={{textAlign:'left', fontWeight:600}}>{r.reason}</td>
                    <td>
                      {r.status === 'PENDING'
                        ? <span className="rl-status-pending">● 미처리</span>
                        : <span className="rl-status-done">● 처리완료</span>}
                    </td>
                    <td><span style={{color:'#94a3b8'}}>{r.createdAt?.split('T')[0] || '—'}</span></td>
                    <td>
                      <button className="rl-action-btn" onClick={() => setSelectedReport(r)}>상세 및 제재</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="rl-empty">신고 내역이 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 제재 상세 모달 */}
        {selectedReport && (
          <div className="rl-modal-overlay" onClick={() => setSelectedReport(null)}>
            <div className="rl-modal" onClick={e => e.stopPropagation()}>
              <div className="rl-modal-header">
                <span>신고 상세 및 제재 결정</span>
                <span style={{cursor:'pointer'}} onClick={() => setSelectedReport(null)}>✕</span>
              </div>
              <div className="rl-modal-body">
                <div style={{fontSize:'12px', color:'#94a3b8', marginBottom:'5px'}}>신고 사유</div>
                <div style={{fontWeight:800, fontSize:'18px', color:'#0f172a'}}>{selectedReport.reason}</div>
                
                <div style={{marginTop:'20px', fontSize:'12px', color:'#94a3b8'}}>상세 신고 내용</div>
                <div className="rl-reason-box">
                  {/* 💡 실제 DB의 detail 값을 출력합니다. */}
                  {selectedReport.detail || "상세 신고 내용이 없습니다."}
                </div>
              </div>
              
              {/* 처리 전(PENDING) 상태일 때만 제재 버튼 노출 */}
              {selectedReport.status === 'PENDING' ? (
                <div className="rl-modal-footer">
                  <button className="btn-sanction" onClick={() => handleProcessSanction('무혐의', 'DISMISSED', 'NONE')}>무혐의 처리</button>
                  <button className="btn-sanction red" onClick={() => handleProcessSanction('경고', 'RESOLVED', 'WARNING')}>경고 조치</button>
                  <button className="btn-sanction red" onClick={() => handleProcessSanction('7일 정지', 'RESOLVED', 'SUSPEND')}>7일 이용정지</button>
                  <button className="btn-sanction red" onClick={() => handleProcessSanction('영구 정지', 'RESOLVED', 'FORCE_WITHDRAW')}>영구 퇴출</button>
                  <button className="btn-close" onClick={() => setSelectedReport(null)}>취소</button>
                </div>
              ) : (
                <div style={{padding: '20px', background: '#f8fafc', textAlign: 'center'}}>
                  <div style={{fontSize: '13px', color: '#64748b', marginBottom: '10px'}}>이미 처리가 완료된 신고입니다.</div>
                  <button className="btn-close" onClick={() => setSelectedReport(null)}>닫기</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminReportListPage;