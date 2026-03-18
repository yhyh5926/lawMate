// src/components/mypage/ConsultMgmtTab.jsx
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore.js";
import lawyerApi from "../../api/lawyerApi.js";
import "../../styles/mypage/ConsultMgmtTab.css";

const ConsultMgmtTab = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);

  // 거절 사유 입력을 위한 상태
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await lawyerApi.getReservations(user.memberId);
        setReservations(response.data || response);
      } catch (error) {
        console.error("예약 내역을 불러오는데 실패했습니다.", error);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.memberId) {
      fetchReservations();
    }
  }, [user]);

  const handleAccept = async (id) => {
    if (window.confirm("이 상담 예약을 수락하시겠습니까?")) {
      try {
        await lawyerApi.acceptReservation(id);
        setReservations((prev) =>
          prev.map((res) =>
            res.id === id ? { ...res, status: "ACCEPTED" } : res,
          ),
        );
        alert("상담 예약이 수락되었습니다.");
      } catch (error) {
        console.error("수락 처리 중 오류 발생:", error);
        alert("처리 중 서버 오류가 발생했습니다.");
      }
    }
  };

  const openRejectForm = (id) => {
    setRejectingId(id);
    setRejectReason("");
  };

  const cancelReject = () => {
    setRejectingId(null);
    setRejectReason("");
  };

  const submitReject = async (id) => {
    if (!rejectReason.trim()) {
      alert("거절 사유를 반드시 입력해주세요.");
      return;
    }

    if (
      window.confirm("정말 거절하시겠습니까? 사유가 의뢰인에게 전달됩니다.")
    ) {
      try {
        await lawyerApi.rejectReservation(id, { rejectReason });
        setReservations((prev) =>
          prev.map((res) =>
            res.id === id
              ? { ...res, status: "REJECTED", rejectReason: rejectReason }
              : res,
          ),
        );
        setRejectingId(null);
        setRejectReason("");
        alert("상담 예약을 거절 처리했습니다.");
      } catch (error) {
        console.error("거절 처리 중 오류 발생:", error);
        alert("처리 중 서버 오류가 발생했습니다.");
      }
    }
  };

  if (loading) {
    return <div className="empty-tab-content">내역을 불러오는 중입니다...</div>;
  }

  return (
    <div className="consult-mgmt-wrapper">
      <h3 className="content-title">상담 예약 관리</h3>
      <div className="consult-info-notice">
        💡 의뢰인이 신청한 상담 내역입니다. 일정을 확인하고 수락 또는 거절을
        선택해주세요.
      </div>

      {reservations.length === 0 ? (
        <div className="empty-tab-content">
          현재 접수된 상담 예약이 없습니다.
        </div>
      ) : (
        <div className="consult-list">
          {reservations.map((res) => (
            <div key={res.id} className="consult-card">
              <div className="consult-header">
                <div className="consult-client-info">
                  <span className="client-name">{res.clientName} 의뢰인</span>
                  <span className="client-phone">{res.phone}</span>
                </div>
                <div className="consult-datetime">
                  📅 {res.date} 🕒 {res.time}
                </div>
              </div>

              <div className="consult-body">
                <p className="consult-issue">"{res.issue}"</p>
              </div>

              <div className="consult-footer">
                {res.status === "PENDING" && rejectingId !== res.id && (
                  <div className="consult-actions">
                    <button
                      className="btn-reject"
                      onClick={() => openRejectForm(res.id)}
                    >
                      거절하기
                    </button>
                    <button
                      className="btn-accept"
                      onClick={() => handleAccept(res.id)}
                    >
                      수락하기
                    </button>
                  </div>
                )}

                {/* 거절 사유 입력 폼 (개선된 구조) */}
                {rejectingId === res.id && (
                  <div className="reject-form-box">
                    <label className="reject-label">거절 사유 작성</label>
                    <textarea
                      className="reject-textarea"
                      placeholder="예: 해당 일자에 재판 일정이 있어 상담이 어렵습니다."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <div className="reject-actions">
                      <button className="btn-cancel" onClick={cancelReject}>
                        취소
                      </button>
                      <button
                        className="btn-submit-reject"
                        onClick={() => submitReject(res.id)}
                      >
                        거절 확정
                      </button>
                    </div>
                  </div>
                )}

                {res.status === "ACCEPTED" && (
                  <div className="status-badge badge-accepted">
                    ✅ 상담 예약이 확정되었습니다.
                  </div>
                )}

                {res.status === "REJECTED" && (
                  <div className="status-badge badge-rejected">
                    ❌ 거절된 상담입니다. <br />
                    <span className="reject-reason-text">
                      사유: {res.rejectReason}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultMgmtTab;
