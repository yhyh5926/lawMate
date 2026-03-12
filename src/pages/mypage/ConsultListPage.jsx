import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyConsults,
  cancelConsult,
  restoreConsult,
  deleteConsult,
} from "../../api/consultApi";
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
  const diff =
    7 - Math.floor((Date.now() - new Date(updatedAt)) / (1000 * 60 * 60 * 24));
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
      fetchConsults();
    } catch (e) {
      alert(e.response?.data?.message || "취소 실패");
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm("예약을 복구하시겠습니까?")) return;
    try {
      await restoreConsult(id);
      alert("복구되었습니다.");
      fetchConsults();
    } catch (e) {
      alert("복구 실패");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("즉시 삭제하시겠습니까?")) return;
    try {
      await deleteConsult(id);
      alert("삭제되었습니다.");
      fetchConsults();
    } catch (e) {
      alert("삭제 실패");
    }
  };

  return (
    <div className="consult-list-container">
      <h2 className="consult-list-title">상담 예약 내역</h2>

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

      {loading ? (
        <div className="consult-empty-state">불러오는 중...</div>
      ) : (
        <div className="consult-list-wrapper">
          {consults.map((c, index) => {
            const meta = STATUS_META[c.status] || STATUS_META.PENDING;
            const uniqueId = c.consultId || c.id || c.consultNo;

            return (
              <div key={uniqueId || index} className="consult-card">
                {/* 상단: 상태 배지 */}
                <div className="consult-card-top">
                  <span className={`consult-status-badge ${meta.className}`}>
                    {meta.label}
                  </span>
                </div>

                {/* 중단: 정보 영역 */}
                <div className="consult-card-body">
                  <div className="consult-lawyer-name">
                    {c.lawyerName || "담당"} 변호사
                  </div>
                  <div className="consult-datetime">
                    {c.consultDate || c.createdAt?.split("T")[0]} ·{" "}
                    {c.consultTime} ({c.durationMin || 30}분)
                  </div>
                  {(c.note || c.memo) && (
                    <p className="consult-memo">{c.note || c.memo}</p>
                  )}
                </div>

                {/* 하단: 액션 영역 (핵심 수정) */}
                <div className="consult-card-footer">
                  {/* 취소 상태일 때만 보이는 정보 */}
                  {c.status === "CANCELLED" && (
                    <span className="delete-dday-text">
                      🗑 {getDeleteDday(c.updatedAt)}
                    </span>
                  )}

                  {/* 버튼 뭉치 (오른쪽 정렬을 위해 div로 감쌈) */}
                  <div className="consult-btns-group">
                    {c.status === "CONFIRMED" && !c.paid && (
                      <button
                        onClick={() =>
                          navigate(`/payment/pay?consultId=${uniqueId}`)
                        }
                        className="btn-pay"
                      >
                        결제하기
                      </button>
                    )}
                    {c.status === "DONE" && (
                      <button
                        onClick={() =>
                          navigate(
                            c.reviewed
                              ? `/lawyer/detail/${c.lawyerId}#review-section`
                              : `/lawyer/detail/${c.lawyerId}`,
                          )
                        }
                        className="btn-review"
                      >
                        {c.reviewed ? "내 후기 보기" : "후기 작성"}
                      </button>
                    )}
                    {["PENDING", "CONFIRMED"].includes(c.status) && (
                      <button
                        onClick={() => handleCancel(uniqueId)}
                        className="btn-cancel"
                      >
                        예약 취소
                      </button>
                    )}
                    {c.status === "CANCELLED" && (
                      <>
                        <button
                          onClick={() => handleRestore(uniqueId)}
                          className="btn-restore"
                        >
                          복구
                        </button>
                        <button
                          onClick={() => handleDelete(uniqueId)}
                          className="btn-delete"
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
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
