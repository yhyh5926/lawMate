// src/components/mypage/LawyerReceptionTab.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { caseApi } from "../../api/caseApi";
import { useAuthStore } from "../../store/authStore";
import { getLawyerConsults, confirmConsult, rejectConsult } from "../../api/consultApi";
import "../../styles/mypage/LawyerReceptionTab.css";

const CONSULT_STATUS_META = {
  PENDING:   { label: "대기중",   color: "#FF9500", bg: "#FFF3E0" },
  CONFIRMED: { label: "확정",    color: "#1A6DFF", bg: "#E8F0FF" },
  DONE:      { label: "완료",    color: "#34C759", bg: "#E8F8ED" },
  CANCELLED: { label: "취소/거절", color: "#FF3B30", bg: "#FFE8E8" },
};

const LawyerReceptionTab = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [consults, setConsults] = useState([]);
  const [consultLoading, setConsultLoading] = useState(true);
  const [consultTab, setConsultTab] = useState("PENDING");

  useEffect(() => {
    const fetchLawyerCases = async () => {
      if (!user?.memberId) return;
      setLoading(true);
      try {
        const response = await caseApi.getMyCaseList(user.memberId);
        const data = response.data?.data || response.data || [];
        setCases(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("접수된 사건 목록을 불러오는데 실패했습니다.", error);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyerCases();
  }, [user]);

  useEffect(() => {
    fetchConsults();
  }, []);

  const fetchConsults = async () => {
    try {
      setConsultLoading(true);
      const res = await getLawyerConsults();
      setConsults(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setConsultLoading(false);
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

  const handleReject = async (consultId) => {
    if (!window.confirm("이 상담을 거절하시겠습니까?")) return;
    try {
      await rejectConsult(consultId);
      alert("거절되었습니다.");
      fetchConsults();
    } catch (e) {
      alert(e.response?.data?.message || "거절 실패");
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      0: "step-receive", 1: "step-assign", 2: "step-progress", 3: "step-opinion", 4: "step-end",
      "접수": "step-receive", "배정": "step-assign", "진행 중": "step-progress", "의견 완료": "step-opinion", "종료": "step-end"
    };
    return statusMap[status] || "step-default";
  };

  const getStatusText = (status) => {
    const textMap = { 0: "접수", 1: "배정", 2: "진행 중", 3: "의견 완료", 4: "종료" };
    return textMap[status] || status || "알 수 없음";
  };

  const filteredConsults = consultTab
    ? consults.filter((c) => c.status === consultTab)
    : consults;

  return (
    <div className="reception-mgmt-wrapper">

      {/* ── 상담 예약 섹션 ── */}
      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#1A1A2E", marginBottom: "16px" }}>
          상담 예약 접수
        </h3>

        {/* 상담 탭 */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "16px", background: "#F0F2F5", borderRadius: "10px", padding: "4px" }}>
          {[
            { value: "PENDING", label: "대기" },
            { value: "CONFIRMED", label: "확정" },
            { value: "DONE", label: "완료" },
            { value: "CANCELLED", label: "취소/거절" },
            { value: "", label: "전체" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setConsultTab(tab.value)}
              style={{
                flex: 1, padding: "8px", border: "none", borderRadius: "8px",
                background: consultTab === tab.value ? "#fff" : "transparent",
                color: consultTab === tab.value ? "#1A6DFF" : "#888",
                fontWeight: consultTab === tab.value ? "700" : "500",
                fontSize: "13px", cursor: "pointer",
                boxShadow: consultTab === tab.value ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
              {tab.value === "PENDING" && consults.filter(c => c.status === "PENDING").length > 0 && (
                <span style={{ marginLeft: "4px", background: "#FF3B30", color: "#fff", borderRadius: "10px", fontSize: "10px", padding: "1px 5px" }}>
                  {consults.filter(c => c.status === "PENDING").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {consultLoading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#aaa" }}>불러오는 중...</div>
        ) : filteredConsults.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", background: "#F7F9FB", borderRadius: "16px", color: "#aaa" }}>
            접수된 상담이 없습니다
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredConsults.map((c) => {
              const meta = CONSULT_STATUS_META[c.status] || CONSULT_STATUS_META.PENDING;
              return (
                <div key={c.consultId} style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "14px", padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
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

                  {c.note && (
                    <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#555", background: "#F7F9FB", padding: "8px 12px", borderRadius: "8px" }}>
                      📝 {c.note}
                    </p>
                  )}

                  {c.status === "PENDING" && (
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button onClick={() => handleConfirm(c.consultId)}
                        style={{ padding: "8px 16px", background: "#1A6DFF", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                        승인
                      </button>
                      <button onClick={() => handleReject(c.consultId)}
                        style={{ padding: "8px 16px", background: "#fff", color: "#FF3B30", border: "1px solid #FF3B30", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                        거절
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 사건 목록 섹션 ── */}
      <div className="reception-header">
        <h3 className="content-title">접수 관리 (사건 목록)</h3>
      </div>

      <div className="reception-content">
        {loading ? (
          <div className="reception-message">데이터를 불러오는 중입니다...</div>
        ) : cases.length === 0 ? (
          <div className="reception-message empty">
            현재 접수/담당 중인 사건 내역이 없습니다.
          </div>
        ) : (
          <table className="reception-table">
            <thead>
              <tr>
                <th className="th-title">사건 제목</th>
                <th className="th-type">유형</th>
                <th className="th-status">진행 단계</th>
                <th className="th-date">접수일</th>
                <th className="th-action">상세</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((item) => (
                <tr key={item.caseId || item.id}>
                  <td className="td-title">{item.title || "제목 없음"}</td>
                  <td className="td-type">{item.caseType || item.type || "일반"}</td>
                  <td className="td-status">
                    <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="td-date">{item.createdAt || item.date || "-"}</td>
                  <td className="td-action">
                    <button className="btn-detail-view"
                      onClick={() => navigate(`/mypage/case/detail/${item.caseId || item.id}`)}>
                      상세 보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LawyerReceptionTab;