import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyConsults, cancelConsult } from "../../api/consultApi";

const STATUS_TABS = [
  { value: "", label: "전체" },
  { value: "PENDING", label: "대기" },
  { value: "CONFIRMED", label: "확정" },
  { value: "DONE", label: "완료" },
  { value: "CANCELLED", label: "취소" },
];

const STATUS_META = {
  PENDING: { label: "대기중", color: "#FF9500", bg: "#FFF3E0" },
  CONFIRMED: { label: "확정", color: "#1A6DFF", bg: "#E8F0FF" },
  DONE: { label: "완료", color: "#34C759", bg: "#E8F8ED" },
  CANCELLED: { label: "취소", color: "#FF3B30", bg: "#FFE8E8" },
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
      setConsults(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (consultNo) => {
    if (!window.confirm("예약을 취소하시겠습니까?")) return;
    try {
      await cancelConsult(consultNo);
      alert("취소되었습니다.");
      fetchConsults();
    } catch (e) {
      alert(e.response?.data?.message || "취소 실패");
    }
  };

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "28px 16px" }}>
      <h2
        style={{
          fontSize: "22px",
          fontWeight: "800",
          color: "#1A1A2E",
          marginBottom: "20px",
        }}
      >
        상담 예약 내역
      </h2>

      {/* 탭 */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "24px",
          background: "#F0F2F5",
          borderRadius: "10px",
          padding: "4px",
        }}
      >
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            style={{
              flex: 1,
              padding: "8px",
              border: "none",
              borderRadius: "8px",
              background: activeTab === tab.value ? "#fff" : "transparent",
              color: activeTab === tab.value ? "#1A6DFF" : "#888",
              fontWeight: activeTab === tab.value ? "700" : "500",
              fontSize: "13px",
              cursor: "pointer",
              boxShadow:
                activeTab === tab.value ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#aaa" }}>
          불러오는 중...
        </div>
      ) : consults.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            background: "#F7F9FB",
            borderRadius: "16px",
            color: "#aaa",
          }}
        >
          예약 내역이 없습니다
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {consults.map((c) => {
            const meta = STATUS_META[c.status] || STATUS_META.PENDING;
            return (
              <div
                key={c.consultNo}
                style={{
                  background: "#fff",
                  border: "1px solid #E8ECF0",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "16px",
                        color: "#1A1A2E",
                      }}
                    >
                      {c.lawyerName} 변호사
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#888",
                        marginTop: "2px",
                      }}
                    >
                      {c.consultDate} {c.consultTime} ({c.duration}분)
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      background: meta.bg,
                      color: meta.color,
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    {meta.label}
                  </span>
                </div>

                {c.memo && (
                  <p
                    style={{
                      margin: "0 0 12px",
                      fontSize: "13px",
                      color: "#555",
                      background: "#F7F9FB",
                      padding: "8px 12px",
                      borderRadius: "8px",
                    }}
                  >
                    {c.memo}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "flex-end",
                  }}
                >
                  {/* 결제 이동 (확정 상태) */}
                  {c.status === "CONFIRMED" && !c.paid && (
                    <button
                      onClick={() =>
                        navigate(`/payment/pay.do?consultNo=${c.consultNo}`)
                      }
                      style={btnStyle("#1A6DFF", "#fff")}
                    >
                      결제하기
                    </button>
                  )}
                  {/* 후기 작성 (완료 상태) */}
                  {c.status === "DONE" && !c.reviewed && (
                    <button
                      onClick={() =>
                        navigate(
                          `/lawyer/review/write.do?consultNo=${c.consultNo}`,
                        )
                      }
                      style={btnStyle("#34C759", "#fff")}
                    >
                      후기 작성
                    </button>
                  )}
                  {/* 취소 (대기/확정 상태) */}
                  {["PENDING", "CONFIRMED"].includes(c.status) && (
                    <button
                      onClick={() => handleCancel(c.consultNo)}
                      style={btnStyle("#fff", "#FF3B30", "1px solid #FF3B30")}
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

const btnStyle = (bg, color, border = "none") => ({
  padding: "8px 16px",
  background: bg,
  color,
  border,
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
});

export default ConsultListPage;
