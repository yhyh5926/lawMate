// src/components/mypage/ClientConsultTab.jsx
import React, { useState, useEffect } from "react";
import { memberApi } from "../../api/memberApi"; 
import { useAuthStore } from "../../store/authStore.js";
import "../../styles/mypage/ClientConsultTab.css";

const ClientConsultTab = () => {
  const { user } = useAuthStore();
  const [subTab, setSubTab] = useState("active"); // active(진행 중), past(이전 내역)
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchMyReservations = async () => {
      try {
        setLoading(true);
        const response = await memberApi.getMyReservations(user.memberId);
        const data = response.data?.data || response.data || [];
        setReservations(data); 
      } catch (error) {
        console.error("상담 내역을 불러오는데 실패했습니다.", error);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.memberId) {
      fetchMyReservations();
    }
  }, [user]);

  const handleCancel = async (id) => {
    if (window.confirm("정말 이 예약을 취소하시겠습니까?")) {
      try {
        await memberApi.cancelReservation(id);
        setReservations((prev) =>
          prev.map((res) =>
            res.id === id ? { ...res, status: "REJECTED", rejectReason: "의뢰인 본인이 예약을 취소했습니다." } : res
          )
        );
        alert("예약이 성공적으로 취소되었습니다.");
      } catch (error) {
        console.error("예약 취소 실패:", error);
        alert("예약 취소 중 서버 오류가 발생했습니다.");
      }
    }
  };

  const filteredReservations = reservations.filter((res) => {
    if (subTab === "active") {
      return res.status === "PENDING" || res.status === "ACCEPTED";
    } else {
      return res.status === "REJECTED" || res.status === "COMPLETED";
    }
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING": return <span className="status-badge badge-pending">⏳ 예약 대기중</span>;
      case "ACCEPTED": return <span className="status-badge badge-accepted">✅ 예약 확정</span>;
      case "REJECTED": return <span className="status-badge badge-rejected">❌ 예약 취소/거절</span>;
      case "COMPLETED": return <span className="status-badge badge-completed">📝 상담 완료</span>;
      default: return null;
    }
  };

  return (
    <div className="client-consult-wrapper">
      <h3 className="content-title">상담 예약 내역</h3>

      <div className="consult-subtabs">
        <button
          className={`subtab-btn ${subTab === "active" ? "active" : ""}`}
          onClick={() => setSubTab("active")}
        >
          진행 중인 상담
        </button>
        <button
          className={`subtab-btn ${subTab === "past" ? "active" : ""}`}
          onClick={() => setSubTab("past")}
        >
          이전 상담 내역
        </button>
      </div>

      {loading ? (
        <div className="empty-tab-content">상담 내역을 불러오는 중입니다...</div>
      ) : filteredReservations.length === 0 ? (
        <div className="empty-tab-content">
          {subTab === "active" ? "현재 진행 중인 상담 예약이 없습니다." : "이전 상담 내역이 없습니다."}
        </div>
      ) : (
        <div className="client-consult-list">
          {filteredReservations.map((res) => (
            <div key={res.id} className="client-consult-card">
              
              <div className="card-header">
                <div className="lawyer-info">
                  <span className="lawyer-name">{res.lawyerName} 변호사</span>
                  <span className="lawyer-spec">{res.specialty} 전문</span>
                </div>
                {getStatusBadge(res.status)}
              </div>
              
              <div className="card-body">
                <div className="consult-time-box">
                  <span className="icon">📅</span> {res.date} &nbsp;&nbsp; <span className="icon">🕒</span> {res.time}
                </div>
                <div className="consult-issue-box">
                  <span className="issue-label">나의 문의 내용</span>
                  <p className="issue-text">"{res.issue}"</p>
                </div>
                
                {res.status === "REJECTED" && res.rejectReason && (
                  <div className="reject-reason-box">
                    <span className="reason-label">안내 메시지 (거절/취소 사유)</span>
                    <p className="reason-text">{res.rejectReason}</p>
                  </div>
                )}
              </div>
              
              <div className="card-footer">
                {res.status === "ACCEPTED" && (
                  <button className="action-btn btn-chat" onClick={() => alert("채팅방으로 이동합니다.")}>
                    채팅 상담방 입장하기
                  </button>
                )}
                {res.status === "PENDING" && (
                  <button className="action-btn btn-cancel" onClick={() => handleCancel(res.id)}>
                    예약 취소하기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientConsultTab;