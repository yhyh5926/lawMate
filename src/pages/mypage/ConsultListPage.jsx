// src/pages/mypage/ConsultListPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyConsults, cancelConsult } from "../../api/consultApi";
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

  const handleCancel = async (id) => {
    if (!window.confirm("예약을 취소하시겠습니까?")) return;
    try {
      await cancelConsult(id);
      alert("취소되었습니다.");
      fetchConsults(); // 취소 후 목록 새로고침
    } catch (e) {
      alert(e.response?.data?.message || "취소 실패");
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
                      {c.consultDate || c.createdAt?.split('T')[0]} {c.consultTime} ({c.durationMin || c.duration || 30}분)
                    </div>
                  </div>
                  <span className={`consult-status-badge ${meta.className}`}>
                    {meta.label}
                  </span>
                </div>

                {c.note && (
                  <p className="consult-memo">{c.note}</p>
                )}

                <div className="consult-card-actions">
                  {/* 💡 모든 액션 버튼에 고유 ID(uniqueId)를 넘기도록 수정 */}
                  {c.status === "CONFIRMED" && !c.paid && (
                    <button
                      onClick={() => navigate(`/payment/pay?consultId=${uniqueId}`)}
                      className="consult-action-btn btn-pay"
                    >
                      결제하기
                    </button>
                  )}
                  {c.status === "DONE" && !c.reviewed && (
                    <button
                      onClick={() => navigate(`/lawyer/review/write?consultId=${uniqueId}`)}
                      className="consult-action-btn btn-review"
                    >
                      후기 작성
                    </button>
                  )}
                  {["PENDING", "CONFIRMED"].includes(c.status) && (
                    <button
                      onClick={() => handleCancel(uniqueId)}
                      className="consult-action-btn btn-cancel"
                    >
                      예약 취소
                    </button>
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