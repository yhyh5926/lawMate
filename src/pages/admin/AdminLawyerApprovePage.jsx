// vs코드
// 파일 위치: src/pages/admin/AdminLawyerApprovePage.jsx

import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi.js";
import "../../styles/admins/AdminLawyerApprovePage.css"; // 분리된 CSS 임포트

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

                {l.filePaths && l.filePaths.length > 0 && (
                  <div className="la-info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                    <span className="la-info-key">증빙서류 확인</span>
                    <div className="la-docs-container">
                      {l.filePaths.map((path, idx) => {
                        if(!path) return null;
                        const fullPath = path.startsWith("http") ? path : `http://localhost:8080${path}`;
                        return (
                          <a key={idx} href={fullPath} target="_blank" rel="noopener noreferrer">
                            <img src={fullPath} alt={`증빙서류 ${idx + 1}`} className="la-doc-img" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
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
  );
};

export default AdminLawyerApprovePage;