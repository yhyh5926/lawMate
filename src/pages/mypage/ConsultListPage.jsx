// src/pages/mypage/ConsultListPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 💡 복구 및 삭제 API 추가, CSS 임포트 유지
import { getMyConsults, cancelConsult, restoreConsult, deleteConsult } from "../../api/consultApi";
import "../../styles/mypage/ConsultListPage.css";

const STATUS_TABS = [
  { value: "", label: "전체" },
  { value: "PENDING", label: "대기" },
  { value: "CONFIRMED", label: "확정" },
  { value: "DONE", label: "완료" },
  { value: "CANCELLED", label: "취소" },
];

const STATUS_META = {
  PENDING: { label: "대기중", className: "badge-pending" },
  CONFIRMED: { label: "확정", className: "badge-confirmed" },
  DONE: { label: "완료", className: "badge-done" },
  CANCELLED: { label: "취소", className: "badge-cancelled" },
};

const getDeleteDday = (updatedAt) => {
  if (!updatedAt) return null;
  const diff = 7 - Math.floor((Date.now() - new Date(updatedAt)) / (1000 * 60 * 60 * 24));
  return diff > 0 ? `${diff}일 후 자동 삭제` : "곧 자동 삭제";
};

const ConsultListPage = () => {
  const [activeTab, setActiveTab] = useState("");
  const [consults, setConsults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConsults();
  }, [activeTab]);

  const fetchConsults = async () => {
    try {
      setLoading(true);
      const res = await getMyConsults(activeTab);
      setConsults(res.data?.data || res.data || []);
    } catch (e) {
      console.error(e);
      setConsults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (consultId) => {
    if (!window.confirm("예약을 취소하시겠습니까?")) return;
    try {
      await cancelConsult(consultId);
      alert("취소되었습니다.");
      fetchConsults(); // 취소 후 목록 새로고침
    } catch (e) {
      alert(e.response?.data?.message || "취소 실패");
    }
  };

  const handleRestore = async (consultId) => {
    if (!window.confirm("예약을 복구하시겠습니까?")) return;
    try {
      await restoreConsult(consultId);
      alert("복구되었습니다.");
      fetchConsults();
    } catch (e) {
      alert("복구 실패");
    }
  };

  const handleDelete = async (consultId) => {
    if (!window.confirm("즉시 삭제하시겠습니까? 복구할 수 없습니다.")) return;
    try {
      await deleteConsult(consultId);
      alert("삭제되었습니다.");
      fetchConsults();
    } catch (e) {
      alert("삭제 실패");
    }
  };

  return (
    <div className="consult-list-container">
      <h2 className="consult-list-title">상담 예약 내역</h2>

      {/* 상단 필터 탭 */}
      <div className="consult-tabs-container">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`consult-tab-btn ${activeTab === tab.value ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 리스트 출력 영역 */}
      {loading ? (
        <div className="consult-empty-state">불러오는 중...</div>
      ) : consults.length === 0 ? (
        <div className="consult-empty-state">예약 내역이 없습니다</div>
      ) : (
        <div className="consult-list-wrapper">
          {consults.map((c, index) => {
            const meta = STATUS_META[c.status] || STATUS_META.PENDING;
            
            // 💡 핵심 수정: 백엔드에서 주는 정확한 고유 번호(ID) 추출 (만능 방어막)
            const uniqueId = c.consultId || c.id || c.consultNo; 

            return (
              <div key={uniqueId || index} className="consult-card">
                
                <div className="consult-card-header">
                  <div>
                    <div className="consult-lawyer-name">
                      {c.lawyerName || "담당"} 변호사
                    </div>
                    <div className="consult-datetime">
                      {c.consultDate || c.createdAt?.split('T')[0]} {c.consultTime && `· ${c.consultTime}`} ({c.durationMin || c.duration || 30}분)
                    </div>
                  </div>
                  <span className={`consult-status-badge ${meta.className}`}>
                    {meta.label}
                  </span>
                </div>

                {/* 💡 백엔드 변수명이 note인지 memo인지 몰라 둘 다 호환되도록 처리 */}
                {(c.note || c.memo) && (
                  <p className="consult-memo">{c.note || c.memo}</p>
                )}

                <div className="consult-card-actions">
                  {/* 결제 이동 (확정 상태) */}
                  {c.status === "CONFIRMED" && !c.paid && (
                    <button
                      onClick={() => navigate(`/payment/pay?consultId=${uniqueId}`)}
                      className="consult-action-btn btn-pay"
                    >
                      결제하기
                    </button>
                  )}
                  {/* 후기 작성 (완료 상태) */}
                  {c.status === "DONE" && !c.reviewed && (
                    <button
                      onClick={() => navigate(`/lawyer/review/write?consultId=${uniqueId}`)}
                      className="consult-action-btn btn-review"
                    >
                      후기 작성
                    </button>
                  )}
                  {/* 예약 취소 (대기/확정 상태) */}
                  {["PENDING", "CONFIRMED"].includes(c.status) && (
                    <button
                      onClick={() => handleCancel(uniqueId)}
                      className="consult-action-btn btn-cancel"
                    >
                      예약 취소
                    </button>
                  )}
                  {/* 복구 / 즉시삭제 (취소 상태) */}
                  {c.status === "CANCELLED" && (
                    <>
                      <span style={{ fontSize: "11px", color: "#FF3B30", alignSelf: "center" }}>
                        🗑 {getDeleteDday(c.updatedAt)}
                      </span>
                      <button 
                        onClick={() => handleRestore(uniqueId)} 
                        className="consult-action-btn btn-restore"
                      >
                        복구
                      </button>
                      <button 
                        onClick={() => handleDelete(uniqueId)} 
                        className="consult-action-btn btn-delete"
                      >
                        즉시 삭제
                      </button>
                    </>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConsultListPage;