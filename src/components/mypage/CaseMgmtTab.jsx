import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore.js";
import { caseApi } from "../../api/caseApi";
import { getLawyerConsults } from "../../api/consultApi";
import "../../styles/mypage/CaseMgmtTab.css";

const STEPS = ["접수", "배정", "진행 중", "의견 완료", "종료"];
const STEP_KEYS = [
  "RECEIVED",
  "ASSIGNED",
  "IN_PROGRESS",
  "OPINION_READY",
  "CLOSED",
];
const STEP_MAPPING = {
  RECEIVED: 0,
  ASSIGNED: 1,
  IN_PROGRESS: 2,
  OPINION_READY: 3,
  CLOSED: 4,
};

const CaseMgmtTab = () => {
  const { user } = useAuthStore();
  const [subTab, setSubTab] = useState("active");
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const [editModeId, setEditModeId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    content: "",
    files: "",
    opinion: "",
  });
  const [reviewModeId, setReviewModeId] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, content: "" });

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [clientList, setClientList] = useState([]);
  const [regForm, setRegForm] = useState({
    clientId: "",
    title: "",
    caseType: "",
    description: "",
  });

  const isLawyer = user?.role === "LAWYER" || user?.memberType === "LAWYER";

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await caseApi.getMyCaseList(user.memberId);
      const data = response.data?.data || response.data || [];

      const mappedCases = data.map((c) => ({
        id: c.caseId,
        title: c.title,
        type: c.caseType,
        date:
          c.createdAt?.split(" ")[0] ||
          c.createdAt?.split("T")[0] ||
          c.createdAt,
        status: STEP_MAPPING[c.step] !== undefined ? STEP_MAPPING[c.step] : 0,
        content: c.description || "",
        opinion: c.expertOpinion || "",
        lawyerName: c.lawyerName || "담당 변호사",
        clientName: c.clientName || "의뢰인",
        files: "",
      }));
      setCases(mappedCases);
    } catch (error) {
      console.error("사건 기록을 불러오는데 실패했습니다.", error);
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    if (!isLawyer) return;
    try {
      const res = await getLawyerConsults();
      const consults = res.data?.data || [];
      const uniqueClients = [];
      const seenIds = new Set();

      consults.forEach((c) => {
        if ((c.status === "CONFIRMED" || c.status === "DONE") && c.memberId) {
          if (!seenIds.has(c.memberId)) {
            seenIds.add(c.memberId);
            uniqueClients.push({
              memberId: c.memberId,
              memberName: c.memberName,
            });
          }
        }
      });
      setClientList(uniqueClients);
    } catch (e) {
      console.error("의뢰인 목록 불러오기 실패", e);
    }
  };

  useEffect(() => {
    if (user?.memberId) {
      fetchCases();
      fetchClients();
    }
  }, [user]);

  const handleManualRegister = async () => {
    if (!regForm.title || !regForm.clientId) {
      return alert("의뢰인을 선택하고 사건 제목을 필수적으로 입력해주세요.");
    }
    try {
      await caseApi.createCaseManual({
        lawyerId: user.memberId,
        memberId: regForm.clientId,
        title: regForm.title,
        caseType: regForm.caseType,
        description: regForm.description,
      });
      alert("새로운 사건이 성공적으로 등록되었습니다.");
      setIsRegisterOpen(false);
      setRegForm({ clientId: "", title: "", caseType: "", description: "" });
      fetchCases();
    } catch (error) {
      console.error("사건 등록 실패", error);
      alert("사건 등록에 실패했습니다.");
    }
  };

  const filteredCases = cases.filter((c) => {
    if (subTab === "active") return c.status < 4;
    return c.status === 4;
  });

  const toggleDetail = (id) => {
    if (editModeId || reviewModeId) return;
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePrevStep = async (id, currentStatus) => {
    if (currentStatus <= 0) return;
    if (window.confirm("이전 단계로 되돌리시겠습니까?")) {
      try {
        await caseApi.updateCaseStatus(id, STEP_KEYS[currentStatus - 1]);
        setCases(
          cases.map((c) =>
            c.id === id ? { ...c, status: currentStatus - 1 } : c,
          ),
        );
      } catch (error) {
        console.error("상태 변경 실패:", error);
        alert("상태 변경 중 오류가 발생했습니다.");
      }
    }
  };

  const handleNextStep = async (id, currentStatus) => {
    if (currentStatus >= 4) return;
    if (
      window.confirm(
        `[${STEPS[currentStatus + 1]}] 단계로 업데이트 하시겠습니까?`,
      )
    ) {
      try {
        await caseApi.updateCaseStatus(id, STEP_KEYS[currentStatus + 1]);
        setCases(
          cases.map((c) =>
            c.id === id ? { ...c, status: currentStatus + 1 } : c,
          ),
        );
      } catch (error) {
        console.error("상태 변경 실패:", error);
        alert("상태 변경 중 오류가 발생했습니다.");
      }
    }
  };

  const startEdit = (caseItem) => {
    setEditModeId(caseItem.id);
    setEditFormData({
      content: caseItem.content || "",
      files: Array.isArray(caseItem.files)
        ? caseItem.files.join(", ")
        : caseItem.files || "",
      opinion: caseItem.opinion || "",
    });
  };

  const saveEdit = async (id) => {
    try {
      const formData = new FormData();
      formData.append("description", editFormData.content || "");
      formData.append("expertOpinion", editFormData.opinion || "");
      await caseApi.updateCaseInfo(id, formData);
      setCases(
        cases.map((c) =>
          c.id === id
            ? {
                ...c,
                content: editFormData.content,
                opinion: editFormData.opinion,
              }
            : c,
        ),
      );
      setEditModeId(null);
      alert("사건 내용이 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("사건 수정 실패:", error);
      alert("사건 내용을 수정하는데 실패했습니다.");
    }
  };

  const cancelEdit = () => setEditModeId(null);

  const startReview = (id) => {
    setReviewModeId(id);
    setReviewData({ rating: 5, content: "" });
  };

  const submitReview = async (id) => {
    if (!reviewData.content.trim()) return alert("후기 내용을 입력해주세요.");
    try {
      await caseApi.submitReview(id, {
        rating: reviewData.rating,
        content: reviewData.content,
      });
      fetchCases(); // 최신 데이터 리로드
      setReviewModeId(null);
      alert("소중한 후기가 등록되었습니다!");
    } catch (error) {
      console.error("후기 등록 실패:", error);
      alert("후기 등록 중 오류가 발생했습니다.");
    }
  };

  if (loading)
    return (
      <div className="empty-tab-content">
        ⚖️ 사건 기록을 불러오는 중입니다...
      </div>
    );

  return (
    <div className="case-mgmt-wrapper">
      <div className="case-mgmt-header">
        <h3 className="content-title">사건 기록</h3>
        {isLawyer && (
          <button
            className={`btn-reg-toggle ${isRegisterOpen ? "open" : ""}`}
            onClick={() => setIsRegisterOpen(!isRegisterOpen)}
          >
            {isRegisterOpen ? "닫기" : "+ 새로운 사건 등록"}
          </button>
        )}
      </div>

      {isRegisterOpen && (
        <div className="manual-reg-form">
          <h4>신규 사건 등록</h4>
          <div className="reg-form-row">
            <select
              className="reg-input select"
              value={regForm.clientId}
              onChange={(e) =>
                setRegForm({ ...regForm, clientId: e.target.value })
              }
            >
              <option value="">의뢰인 선택 (상담 승인 완료자)</option>
              {clientList.map((client) => (
                <option key={client.memberId} value={client.memberId}>
                  {client.memberName} 의뢰인
                </option>
              ))}
            </select>
            <input
              className="reg-input"
              type="text"
              placeholder="사건 유형 (민사, 형사 등)"
              value={regForm.caseType}
              onChange={(e) =>
                setRegForm({ ...regForm, caseType: e.target.value })
              }
            />
          </div>
          <input
            className="reg-input full"
            type="text"
            placeholder="사건 제목을 입력하세요"
            value={regForm.title}
            onChange={(e) => setRegForm({ ...regForm, title: e.target.value })}
          />
          <textarea
            className="reg-textarea"
            placeholder="사건 요약 내용을 입력하세요"
            value={regForm.description}
            onChange={(e) =>
              setRegForm({ ...regForm, description: e.target.value })
            }
          />
          <div className="reg-form-actions">
            <button className="btn-save" onClick={handleManualRegister}>
              등록하기
            </button>
          </div>
        </div>
      )}

      <div className="case-subtabs">
        <button
          className={`case-subtab-btn ${subTab === "active" ? "active" : ""}`}
          onClick={() => setSubTab("active")}
        >
          진행 중인 사건
        </button>
        <button
          className={`case-subtab-btn ${subTab === "past" ? "active" : ""}`}
          onClick={() => setSubTab("past")}
        >
          이전 사건 내역
        </button>
      </div>

      <div className="case-list">
        {filteredCases.length === 0 ? (
          <div className="empty-tab-content">표시할 사건이 없습니다.</div>
        ) : (
          filteredCases.map((caseItem) => (
            <div
              key={caseItem.id}
              className={`case-card ${expandedId === caseItem.id ? "expanded" : ""}`}
            >
              <div
                className="case-header"
                onClick={() => toggleDetail(caseItem.id)}
              >
                <div className="case-info">
                  <span className="case-type-tag">
                    {caseItem.type || "일반"}
                  </span>
                  <h4 className="case-title-text">{caseItem.title}</h4>
                </div>
                <div className="case-meta">
                  <span className="case-date">접수일: {caseItem.date}</span>
                  <span
                    className={`arrow-icon ${expandedId === caseItem.id ? "up" : "down"}`}
                  >
                    ▼
                  </span>
                </div>
              </div>

              <div className="case-progress-bar">
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${(caseItem.status / 4) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-nodes">
                  {STEPS.map((step, idx) => (
                    <div
                      key={idx}
                      className={`node-item ${idx <= caseItem.status ? "active" : ""}`}
                    >
                      <div className="node-dot">{idx + 1}</div>
                      <span className="node-label">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {expandedId === caseItem.id && (
                <div className="case-detail-content">
                  <div className="info-row">
                    <label>참여인</label>
                    <p>
                      ⚖️ 변호사: <strong>{caseItem.lawyerName}</strong> | 👤
                      의뢰인: <strong>{caseItem.clientName}</strong>
                    </p>
                  </div>

                  {editModeId === caseItem.id ? (
                    <div className="edit-area">
                      <div className="info-row">
                        <label>사건 상세</label>
                        <textarea
                          value={editFormData.content}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              content: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="info-row">
                        <label>전문가 의견</label>
                        <textarea
                          value={editFormData.opinion}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              opinion: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="action-btns">
                        <button
                          className="btn-cancel-small"
                          onClick={cancelEdit}
                        >
                          취소
                        </button>
                        <button
                          className="btn-save-small"
                          onClick={() => saveEdit(caseItem.id)}
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="info-row">
                        <label>사건 상세</label>
                        <div className="content-box">{caseItem.content}</div>
                      </div>
                      <div className="info-row">
                        <label>전문가 의견</label>
                        <div className="content-box opinion">
                          {caseItem.opinion || "등록된 의견이 없습니다."}
                        </div>
                      </div>
                      {isLawyer && caseItem.status < 4 && (
                        <div className="mgmt-controls">
                          <button
                            className="btn-step-prev"
                            disabled={caseItem.status === 0}
                            onClick={() =>
                              handlePrevStep(caseItem.id, caseItem.status)
                            }
                          >
                            ⏪ 이전
                          </button>
                          <button
                            className="btn-edit-info"
                            onClick={() => startEdit(caseItem)}
                          >
                            ✏️ 수정
                          </button>
                          <button
                            className="btn-step-next"
                            onClick={() =>
                              handleNextStep(caseItem.id, caseItem.status)
                            }
                          >
                            다음 단계 ✅
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  {/* 후기 영역 생략 (CSS 적용 예정) */}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CaseMgmtTab;
