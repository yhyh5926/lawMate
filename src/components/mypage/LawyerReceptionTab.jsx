// 파일 위치: src/components/mypage/LawyerReceptionTab.jsx
import React, { useState, useEffect } from "react";
import { getLawyerConsults, confirmConsult, rejectConsult } from "../../api/consultApi";

const STATUS_META = {
  PENDING:   { label: "대기중",    color: "#FF9500", bg: "#FFF3E0" },
  CONFIRMED: { label: "확정",      color: "#1A6DFF", bg: "#E8F0FF" },
  DONE:      { label: "완료",      color: "#34C759", bg: "#E8F8ED" },
  CANCELLED: { label: "취소/거절", color: "#FF3B30", bg: "#FFE8E8" },
};

const STATUS_TABS = [
  { value: "",          label: "전체"     },
  { value: "PENDING",   label: "대기"     },
  { value: "CONFIRMED", label: "확정"     },
  { value: "DONE",      label: "완료"     },
  { value: "CANCELLED", label: "취소/거절"},
];

const LawyerReceptionTab = () => {
  const [consults,    setConsults]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState("");
  const [rejectModal, setRejectModal] = useState({ open: false, consultId: null });
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => { fetchConsults(); }, []);

  const fetchConsults = async () => {
    try {
      setLoading(true);
      const res = await getLawyerConsults();
      setConsults(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (consultId) => {
    if (!window.confirm("이 상담을 승인하시겠습니까?")) return;
    try {
      await confirmConsult(consultId);
      alert("승인되었습니다.");
      fetchConsults();
    } catch (e) {
      alert(e.response?.data?.message || "승인 실패");
    }
  };

  const handleRejectClick = (consultId) => {
    setRejectModal({ open: true, consultId });
    setRejectReason("");
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert("거절 사유를 입력해주세요.");
      return;
    }
    try {
      await rejectConsult(rejectModal.consultId, rejectReason);
      alert("거절되었습니다.");
      setRejectModal({ open: false, consultId: null });
      fetchConsults();
    } catch (e) {
      alert(e.response?.data?.message || "거절 실패");
    }
  };

  const filtered = activeTab
    ? consults.filter((c) => c.status === activeTab)
    : consults;

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "28px 16px" }}>
      <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#1A1A2E", marginBottom: "20px" }}>
        접수 관리
      </h2>

      {/* 탭 */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "#F0F2F5", borderRadius: "10px", padding: "4px" }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            style={{
              flex: 1, padding: "8px", border: "none", borderRadius: "8px",
              background: activeTab === tab.value ? "#fff" : "transparent",
              color:      activeTab === tab.value ? "#1A6DFF" : "#888",
              fontWeight: activeTab === tab.value ? "700" : "500",
              fontSize: "13px", cursor: "pointer",
              boxShadow: activeTab === tab.value ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#aaa" }}>불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "#F7F9FB", borderRadius: "16px", color: "#aaa" }}>
          접수된 상담이 없습니다
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((c) => {
            const meta = STATUS_META[c.status] || STATUS_META.PENDING;
            return (
              <div
                key={c.consultId}
                style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "14px", padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "16px", color: "#1A1A2E" }}>
                      {c.memberName} 의뢰인
                    </div>
                    <div style={{ fontSize: "13px", color: "#888", marginTop: "2px" }}>
                      {c.consultDate} · {c.durationMin}분
                    </div>
                  </div>
                  <span style={{ padding: "4px 10px", borderRadius: "20px", background: meta.bg, color: meta.color, fontSize: "12px", fontWeight: "700" }}>
                    {meta.label}
                  </span>
                </div>

                {/* 상담 메모 */}
                {c.note && (
                  <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#555", background: "#F7F9FB", padding: "8px 12px", borderRadius: "8px" }}>
                    📝 {c.note}
                  </p>
                )}

                {/* 거절 사유 표시 */}
                {c.rejectReason && (
                  <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#FF3B30", background: "#FFE8E8", padding: "8px 12px", borderRadius: "8px" }}>
                    ❌ 거절 사유: {c.rejectReason}
                  </p>
                )}

                {/* 대기 상태일 때만 승인/거절 버튼 */}
                {c.status === "PENDING" && (
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button onClick={() => handleConfirm(c.consultId)} style={btnStyle("#1A6DFF", "#fff")}>
                      승인
                    </button>
                    <button onClick={() => handleRejectClick(c.consultId)} style={btnStyle("#fff", "#FF3B30", "1px solid #FF3B30")}>
                      거절
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 거절 사유 입력 모달 */}
      {rejectModal.open && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px",
            padding: "28px", width: "400px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)"
          }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "800", color: "#1A1A2E" }}>
              거절 사유 입력
            </h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="거절 사유를 입력해주세요."
              style={{
                width: "100%", height: "120px", padding: "12px",
                border: "1px solid #E8ECF0", borderRadius: "10px",
                fontSize: "14px", resize: "none", boxSizing: "border-box",
                outline: "none", fontFamily: "inherit"
              }}
            />
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "16px" }}>
              <button
                onClick={() => setRejectModal({ open: false, consultId: null })}
                style={btnStyle("#F0F2F5", "#666")}
              >
                취소
              </button>
              <button onClick={handleRejectSubmit} style={btnStyle("#FF3B30", "#fff")}>
                거절 확정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const btnStyle = (bg, color, border = "none") => ({
  padding: "8px 16px", background: bg, color, border,
  borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer",
});

export default LawyerReceptionTab;
