// vs코드
// 파일 위치: src/components/mypage/CaseMgmtTab.jsx

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
  const [consultList, setConsultList] = useState([]); 

  const [regForm, setRegForm] = useState({
    clientId: "",
    consultId: "", 
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
        review: c.reviewRating ? { 
            rating: c.reviewRating, 
            content: c.reviewContent, 
            date: c.reviewDate 
        } : null
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
      
      setConsultList(consults); 

      const uniqueClients = [];
      const seenIds = new Set();

      consults.forEach((c) => {
        if (c.status === "CONFIRMED" && !c.caseId && c.memberId) {
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
    if (!regForm.title || !regForm.clientId || !regForm.consultId) {
      return alert("의뢰인 및 상담 사유를 선택하고 사건 제목을 필수적으로 입력해주세요.");
    }
    try {
      await caseApi.createCaseManual({
        lawyerId: user.memberId,
        memberId: regForm.clientId,
        consultId: regForm.consultId,
        title: regForm.title,
        caseType: regForm.caseType,
        description: regForm.description,
      });
      alert("새로운 사건이 성공적으로 등록되었습니다.");
      setIsRegisterOpen(false);
      setRegForm({ clientId: "", consultId: "", title: "", caseType: "", description: "" });
      fetchCases();
      fetchClients(); 
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

  const cancelEdit = () => {
    setEditModeId(null);
  };

  const startReview = (id) => {
    setReviewModeId(id);
    setReviewData({ rating: 5, content: "" });
  };

  const submitReview = async (id) => {
    if (!reviewData.content.trim()) return alert("후기 내용을 입력해주세요.");

    const today = new Date();
    const dateString = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, "0")}. ${String(today.getDate()).padStart(2, "0")}.`;

    try {
      await caseApi.submitReview(id, {
        rating: reviewData.rating,
        content: reviewData.content,
      });

      setCases(
        cases.map((c) => {
          if (c.id === id)
            return {
              ...c,
              review: {
                rating: reviewData.rating,
                content: reviewData.content,
                date: dateString,
              },
            };
          return c;
        }),
      );
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
        ⚖️ 진행 중인 사건 및 과거 기록을 불러오는 중입니다...
      </div>
    );

  return (
    <div className="case-mgmt-wrapper">
      <div className="case-mgmt-header">
        <h3 className="content-title">사건 기록</h3>
        {isLawyer && (
          <button
            className="btn-manual-register"
            onClick={() => setIsRegisterOpen(!isRegisterOpen)}
          >
            {isRegisterOpen ? "닫기" : "+ 새로운 사건 직접 등록"}
          </button>
        )}
      </div>

      {isRegisterOpen && (
        <div className="register-form-wrapper">
          <h4 className="register-form-title">새로운 의뢰인 사건 등록</h4>
          <div className="form-grid-2">
            <select
              className="form-control"
              value={regForm.clientId}
              onChange={(e) =>
                setRegForm({ ...regForm, clientId: e.target.value, consultId: "", description: "" })
              }
            >
              <option value="">1. 의뢰인 선택 (상담 승인 완료자)</option>
              {clientList.map((client) => (
                <option key={client.memberId} value={client.memberId}>
                  {client.memberName} 의뢰인
                </option>
              ))}
            </select>

            <select
              className="form-control"
              value={regForm.consultId}
              onChange={(e) => {
                const selectedConsultId = e.target.value;
                const selectedConsult = consultList.find(c => c.consultId == selectedConsultId);
                setRegForm({ 
                  ...regForm, 
                  consultId: selectedConsultId,
                  description: selectedConsult ? selectedConsult.note : ""
                });
              }}
              disabled={!regForm.clientId}
            >
              <option value="">2. 사건으로 전환할 상담 내역 선택</option>
              {consultList
                .filter(c => c.memberId == regForm.clientId && c.status === "CONFIRMED" && !c.caseId)
                .map(c => (
                  <option key={c.consultId} value={c.consultId}>
                    상담일: {c.consultDate} | 사유: {c.note?.substring(0, 15)}...
                  </option>
                ))}
            </select>
          </div>

          <div className="form-grid-2">
             <input
              type="text"
              className="form-control"
              placeholder="사건 유형 (예: 민사, 이혼)"
              value={regForm.caseType}
              onChange={(e) =>
                setRegForm({ ...regForm, caseType: e.target.value })
              }
            />
             <input
              type="text"
              className="form-control"
              placeholder="사건 제목 (예: 임대차 보증금 반환 소송)"
              value={regForm.title}
              onChange={(e) => setRegForm({ ...regForm, title: e.target.value })}
            />
          </div>

          {clientList.length === 0 && (
            <p className="form-error-text">
              * 현재 승인(확정)된 상담 내역이 없어 의뢰인을 선택할 수 없습니다.
              접수 관리 탭에서 상담을 먼저 승인해주세요.
            </p>
          )}

          <textarea
            className="form-control form-textarea"
            placeholder="사전 상담 내용 및 요약"
            value={regForm.description}
            onChange={(e) =>
              setRegForm({ ...regForm, description: e.target.value })
            }
          />
          <div className="form-submit-wrapper">
            <button
              className="btn-submit-register"
              onClick={handleManualRegister}
            >
              사건 등록하기
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

      {filteredCases.length === 0 ? (
        <div className="empty-tab-content">
          {subTab === "active"
            ? "현재 진행 중인 사건이 없습니다."
            : "이전 사건 내역이 없습니다."}
        </div>
      ) : (
        <div className="case-list">
          {filteredCases.map((caseItem) => (
            <div key={caseItem.id} className="case-card">
              <div
                className="case-header"
                onClick={() => toggleDetail(caseItem.id)}
              >
                <div className="case-header-left">
                  <span className="case-type-badge">
                    {caseItem.type || "일반"} 사건
                  </span>
                  <h4 className="case-title">{caseItem.title}</h4>
                </div>
                <div className="case-header-right">
                  <span className="case-date">접수일: {caseItem.date}</span>
                  <span className="expand-icon">
                    {expandedId === caseItem.id ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              <div className="case-progress-container">
                <div className="progress-line-background"></div>
                <div
                  className="progress-line-active"
                  style={{
                    width: `${(caseItem.status / (STEPS.length - 1)) * 100}%`,
                  }}
                ></div>

                <div className="progress-steps">
                  {STEPS.map((stepName, index) => {
                    const isCompleted = index <= caseItem.status;
                    return (
                      <div
                        key={index}
                        className={`step-item ${isCompleted ? "completed" : "pending"}`}
                      >
                        <div className="step-circle">{index + 1}</div>
                        <span className="step-label">{stepName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {expandedId === caseItem.id && (
                <div className="case-detail-box">
                  <div className="detail-section">
                    <span className="detail-label">당사자 정보</span>
                    <p className="detail-text">
                      👨‍⚖️ 담당 변호사: <b>{caseItem.lawyerName}</b>{" "}
                      &nbsp;&nbsp;|&nbsp;&nbsp; 👤 의뢰인:{" "}
                      <b>{caseItem.clientName}</b>
                    </p>
                  </div>

                  {editModeId === caseItem.id ? (
                    <div className="edit-form-box">
                      <div className="detail-section">
                        <span className="detail-label">사건 내용 (수정)</span>
                        <textarea
                          className="case-edit-textarea"
                          value={editFormData.content}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              content: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="detail-section opinion-section">
                        <span className="detail-label">
                          전문가 코멘트 / 진행 상황 (수정)
                        </span>
                        <textarea
                          className="case-edit-textarea"
                          value={editFormData.opinion}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              opinion: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="lawyer-action-bar">
                        <button className="btn-cancel" onClick={cancelEdit}>
                          취소
                        </button>
                        <button
                          className="btn-save"
                          onClick={() => saveEdit(caseItem.id)}
                        >
                          저장하기
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="detail-section">
                        <span className="detail-label">사건 내용</span>
                        <p className="detail-text">{caseItem.content}</p>
                      </div>

                      <div className="detail-section opinion-section">
                        <span className="detail-label">
                          전문가 코멘트 / 진행 상황
                        </span>
                        <p className="detail-text opinion-text">
                          {caseItem.opinion
                            ? caseItem.opinion
                            : "아직 작성된 전문가 코멘트가 없습니다."}
                        </p>
                      </div>

                      {isLawyer && caseItem.status < 4 && (
                        <div className="lawyer-control-bar">
                          <div className="left-controls">
                            <button
                              className="btn-prev-step"
                              onClick={() =>
                                handlePrevStep(caseItem.id, caseItem.status)
                              }
                              disabled={caseItem.status === 0}
                            >
                              ⏪ 이전 단계로
                            </button>
                            <button
                              className="btn-edit"
                              onClick={() => startEdit(caseItem)}
                            >
                              ✏️ 정보 수정하기
                            </button>
                          </div>
                          <button
                            className="btn-advance-step"
                            onClick={() =>
                              handleNextStep(caseItem.id, caseItem.status)
                            }
                          >
                            ✅ 다음 단계 [{STEPS[caseItem.status + 1]}]
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {caseItem.status === 4 && !isLawyer && (
                    <div className="review-section-wrapper">
                      {caseItem.review ? (
                        <div className="client-review-box">
                          <div className="review-header">
                            <span className="review-stars">
                              {"★".repeat(caseItem.review.rating)}
                              {"☆".repeat(5 - caseItem.review.rating)}
                            </span>
                            <span className="review-date">
                              {caseItem.review.date}
                            </span>
                          </div>
                          <p className="review-content">
                            {caseItem.review.content}
                          </p>
                          <span className="review-author">의뢰인</span>
                        </div>
                      ) : reviewModeId === caseItem.id ? (
                        <div className="client-review-form">
                          <h4 className="review-form-title">
                            의뢰인 후기 작성
                          </h4>
                          <div className="review-rating-select">
                            <span>만족도 별점: </span>
                            {[1, 2, 3, 4, 5].map((num) => (
                              <span
                                key={num}
                                className={`star-select ${num <= reviewData.rating ? "active" : ""}`}
                                onClick={() =>
                                  setReviewData({ ...reviewData, rating: num })
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <textarea
                            className="review-textarea"
                            placeholder="변호사님과의 상담 및 사건 진행 후기를 남겨주세요."
                            value={reviewData.content}
                            onChange={(e) =>
                              setReviewData({
                                ...reviewData,
                                content: e.target.value,
                              })
                            }
                          />
                          <div className="review-action-bar">
                            <button
                              className="btn-cancel"
                              onClick={() => setReviewModeId(null)}
                            >
                              취소
                            </button>
                            <button
                              className="btn-save"
                              onClick={() => submitReview(caseItem.id)}
                            >
                              후기 등록
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="btn-write-review"
                          onClick={() => startReview(caseItem.id)}
                        >
                          📝 이 사건의 후기 작성하기
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CaseMgmtTab;