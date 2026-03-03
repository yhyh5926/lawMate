// src/pages/admin/AdminLawyerApprovePage.jsx

import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi.js";

const AdminLawyerApprovePage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingLawyers();
  }, []);

  const fetchPendingLawyers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getPendingLawyers();
      setLawyers(response.data?.data || response.data || []);
    } catch (error) {
      console.error("승인 대기 목록 조회 실패", error);
      setLawyers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (lawyerId, status, name) => {
    const actionText = status === 'APPROVED' ? '승인' : '반려';
    if (!window.confirm(`${name} 변호사의 가입을 [${actionText}] 처리하시겠습니까?`)) return;
    try {
      await adminApi.approveLawyer({ lawyerId, approveStatus: status });
      alert(`${actionText} 처리가 완료되었습니다.`);
      setLawyers((prev) => prev.filter(l => l.lawyerId !== lawyerId));
    } catch (error) {
      console.error("승인 처리 실패:", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <style>{`
        .la-wrap { font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif; }

        .la-desc { font-size: 13.5px; color: #64748b; margin-bottom: 24px; font-weight: 500; }

        .la-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }

        .la-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .la-card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        .la-card-header { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; padding-bottom: 18px; border-bottom: 1px solid #f1f5f9; }
        .la-avatar {
          width: 50px; height: 50px;
          background: linear-gradient(135deg, #dbeafe, #e0e7ff);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }
        .la-name { font-size: 16px; font-weight: 800; color: #0f172a; }
        .la-id { font-size: 12px; color: #94a3b8; margin-top: 2px; font-weight: 500; }

        .la-info { display: flex; flex-direction: column; gap: 10px; flex: 1; margin-bottom: 20px; }
        .la-info-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 9px 12px; background: #f8fafc; border-radius: 8px;
        }
        .la-info-key { font-size: 11.5px; color: #94a3b8; font-weight: 700; }
        .la-info-val { font-size: 12.5px; font-weight: 700; color: #334155; }
        .la-info-val.highlight { color: #3b82f6; }
        .la-info-val .specialty-badge {
          background: #ede9fe; color: #6d28d9;
          padding: 2px 8px; border-radius: 6px;
          font-size: 11.5px; font-weight: 700;
        }
        .la-info-val .date-text { color: #94a3b8; font-weight: 500; font-size: 12px; }

        .la-btns { display: flex; gap: 10px; margin-top: auto; }
        .la-btn-reject {
          flex: 1; padding: 11px;
          background: #fff; border: 1.5px solid #fca5a5; color: #dc2626;
          border-radius: 10px; font-weight: 700; font-size: 13px;
          cursor: pointer; transition: all 0.15s; font-family: inherit;
        }
        .la-btn-reject:hover { background: #fef2f2; border-color: #ef4444; }
        .la-btn-approve {
          flex: 2; padding: 11px;
          background: #2563eb; border: none; color: #fff;
          border-radius: 10px; font-weight: 700; font-size: 13px;
          cursor: pointer; transition: all 0.15s; font-family: inherit;
          box-shadow: 0 4px 12px rgba(37,99,235,0.3);
        }
        .la-btn-approve:hover { background: #1d4ed8; box-shadow: 0 4px 16px rgba(37,99,235,0.4); }
        .la-btn-approve:active { transform: scale(0.97); }

        .la-empty {
          background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 16px;
          padding: 64px 20px; text-align: center; color: #94a3b8;
        }
        .la-empty-icon { font-size: 36px; margin-bottom: 12px; }
        .la-empty-text { font-size: 15px; font-weight: 700; color: #64748b; }

        .la-loading { padding: 60px; text-align: center; color: #94a3b8; font-weight: 600; font-size: 14px; }
      `}</style>

      <div className="la-wrap">
        <p className="la-desc">가입을 신청한 변호사의 자격을 확인하고 시스템 접근 권한을 부여합니다.</p>

        {loading ? (
          <div className="la-loading">DB에서 승인 대기 목록을 불러오는 중입니다...</div>
        ) : lawyers.length === 0 ? (
          <div className="la-empty">
            <div className="la-empty-icon">✨</div>
            <div className="la-empty-text">현재 가입 승인 대기 중인 전문회원이 없습니다.</div>
          </div>
        ) : (
          <div className="la-grid">
            {lawyers.map(l => (
              <div key={l.lawyerId} className="la-card">
                <div className="la-card-header">
                  <div className="la-avatar">👨‍⚖️</div>
                  <div>
                    <div className="la-name">{l.name} 변호사</div>
                    <div className="la-id">{l.loginId}</div>
                  </div>
                </div>

                <div className="la-info">
                  <div className="la-info-row">
                    <span className="la-info-key">자격번호</span>
                    <span className="la-info-val highlight">{l.licenseNo}</span>
                  </div>
                  <div className="la-info-row">
                    <span className="la-info-key">소속법인</span>
                    <span className="la-info-val">{l.officeName}</span>
                  </div>
                  <div className="la-info-row">
                    <span className="la-info-key">전문분야</span>
                    <span className="la-info-val"><span className="specialty-badge">{l.specialty}</span></span>
                  </div>
                  <div className="la-info-row">
                    <span className="la-info-key">신청일</span>
                    <span className="la-info-val"><span className="date-text">{l.createdAt?.split('T')[0]}</span></span>
                  </div>
                </div>

                <div className="la-btns">
                  <button className="la-btn-reject" onClick={() => handleApprove(l.lawyerId, 'REJECTED', l.name)}>반려</button>
                  <button className="la-btn-approve" onClick={() => handleApprove(l.lawyerId, 'APPROVED', l.name)}>승인 완료 ✓</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminLawyerApprovePage;
