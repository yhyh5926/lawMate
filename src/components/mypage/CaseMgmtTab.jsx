// src/components/mypage/CaseMgmtTab.jsx
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore.js";
import { caseApi } from "../../api/caseApi"; // 💡 실제 API 임포트
import "../../styles/mypage/CaseMgmtTab.css";

const STEPS = ["접수", "배정", "진행 중", "의견 완료", "종료"];

const CaseMgmtTab = () => {
  const { user } = useAuthStore();
  const [subTab, setSubTab] = useState("active"); // active: 진행 중, past: 이전 사건
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // 변호사 수정 모드 관련 상태
  const [editModeId, setEditModeId] = useState(null);
  const [editFormData, setEditFormData] = useState({ content: "", files: "", opinion: "" });

  // 일반 회원 후기 작성 모드 관련 상태
  const [reviewModeId, setReviewModeId] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, content: "" });

  // 💡 1. DB에서 내 사건 기록 목록 불러오기 (더미데이터 제거 완료)
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const response = await caseApi.getMyCaseList(user.memberId);
        // 백엔드 응답 형태에 맞게 세팅 (DTO 구조에 따라 수정이 필요할 수 있습니다)
        const data = response.data?.data || response.data || [];
        setCases(data);
      } catch (error) {
        console.error("사건 기록을 불러오는데 실패했습니다.", error);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.memberId) fetchCases();
  }, [user]);

  const filteredCases = cases.filter((c) => {
    if (subTab === "active") return c.status < 4;
    return c.status === 4; // 4는 '종료' 상태
  });

  const toggleDetail = (id) => {
    if (editModeId || reviewModeId) return; // 수정/작성 중에는 아코디언이 닫히지 않도록 방지
    setExpandedId(expandedId === id ? null : id);
  };

  // ----------------------------------------------------
  // 💡 변호사 (LAWYER) 전용 기능 API 연동
  // ----------------------------------------------------
  
  // 이전 단계로 되돌리기
  const handlePrevStep = async (id, currentStatus) => {
    if (currentStatus <= 0) return;
    if (window.confirm("이전 단계로 되돌리시겠습니까?")) {
      try {
        await caseApi.updateCaseStatus(id, currentStatus - 1);
        setCases(cases.map(c => c.id === id ? { ...c, status: currentStatus - 1 } : c));
      } catch (error) {
        console.error("상태 업데이트 실패:", error);
        alert("상태 변경 중 오류가 발생했습니다.");
      }
    }
  };

  // 다음 단계로 진행하기
  const handleNextStep = async (id, currentStatus) => {
    if (currentStatus >= 4) return;
    if (window.confirm(`[${STEPS[currentStatus + 1]}] 단계로 업데이트 하시겠습니까?`)) {
      try {
        await caseApi.updateCaseStatus(id, currentStatus + 1);
        setCases(cases.map(c => c.id === id ? { ...c, status: currentStatus + 1 } : c));
      } catch (error) {
        console.error("상태 업데이트 실패:", error);
        alert("상태 변경 중 오류가 발생했습니다.");
      }
    }
  };

  // 정보 수정 폼 열기
  const startEdit = (caseItem) => {
    setEditModeId(caseItem.id);
    setEditFormData({
      content: caseItem.content || "",
      files: Array.isArray(caseItem.files) ? caseItem.files.join(", ") : (caseItem.files || ""),
      opinion: caseItem.opinion || ""
    });
  };

  // 정보 수정 저장 (API 연동)
  const saveEdit = async (id) => {
    try {
      const updateData = {
        content: editFormData.content,
        // 입력받은 파일 문자열을 쉼표 기준으로 배열로 파싱
        files: editFormData.files.split(",").map(f => f.trim()).filter(f => f !== ""),
        opinion: editFormData.opinion
      };

      await caseApi.updateCaseInfo(id, updateData);

      setCases(cases.map(c => c.id === id ? { ...c, ...updateData } : c));
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

  // ----------------------------------------------------
  // 💡 일반 회원 (CLIENT) 전용 후기 작성 기능 API 연동
  // ----------------------------------------------------
  const startReview = (id) => {
    setReviewModeId(id);
    setReviewData({ rating: 5, content: "" });
  };

  const submitReview = async (id) => {
    if (!reviewData.content.trim()) {
      return alert("후기 내용을 입력해주세요.");
    }
    
    const today = new Date();
    const dateString = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}.`;

    try {
      // 후기 작성 API 통신
      await caseApi.submitReview(id, { 
        rating: reviewData.rating, 
        content: reviewData.content 
      });

      setCases(cases.map(c => {
        if (c.id === id) {
          return {
            ...c,
            review: { rating: reviewData.rating, content: reviewData.content, date: dateString }
          };
        }
        return c;
      }));
      setReviewModeId(null);
      alert("소중한 후기가 등록되었습니다!");
    } catch (error) {
      console.error("후기 등록 실패:", error);
      alert("후기 등록 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <div className="empty-tab-content">⚖️ 진행 중인 사건 및 과거 기록을 불러오는 중입니다...</div>;
  }

  return (
    <div className="case-mgmt-wrapper">
      <h3 className="content-title">사건 기록</h3>

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
          {subTab === "active" ? "현재 진행 중인 사건이 없습니다." : "이전 사건 내역이 없습니다."}
        </div>
      ) : (
        <div className="case-list">
          {filteredCases.map((caseItem) => (
            <div key={caseItem.id} className="case-card">
              
              {/* 사건 요약 헤더 */}
              <div className="case-header" onClick={() => toggleDetail(caseItem.id)}>
                <div className="case-header-left">
                  <span className="case-type-badge">{caseItem.type || "분류 없음"} 사건</span>
                  <h4 className="case-title">{caseItem.title}</h4>
                </div>
                <div className="case-header-right">
                  <span className="case-date">접수일: {caseItem.date}</span>
                  <span className="expand-icon">{expandedId === caseItem.id ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* 진행 단계 (스텝바) UI */}
              <div className="case-progress-container">
                <div className="progress-line-background"></div>
                <div 
                  className="progress-line-active" 
                  style={{ width: `${(caseItem.status / (STEPS.length - 1)) * 100}%` }}
                ></div>
                
                <div className="progress-steps">
                  {STEPS.map((stepName, index) => {
                    const isCompleted = index <= caseItem.status;
                    return (
                      <div key={index} className={`step-item ${isCompleted ? "completed" : "pending"}`}>
                        <div className="step-circle">{index + 1}</div>
                        <span className="step-label">{stepName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 펼쳐지는 상세 내역 영역 */}
              {expandedId === caseItem.id && (
                <div className="case-detail-box">
                  <div className="detail-section">
                    <span className="detail-label">당사자 정보</span>
                    <p className="detail-text">👨‍⚖️ 담당 변호사: <b>{caseItem.lawyerName}</b> &nbsp;&nbsp;|&nbsp;&nbsp; 👤 의뢰인: <b>{caseItem.clientName}</b></p>
                  </div>
                  
                  {/* 💡 변호사 수정 모드일 때 */}
                  {editModeId === caseItem.id ? (
                    <div className="edit-form-box">
                      <div className="detail-section">
                        <span className="detail-label">사건 내용 (수정)</span>
                        <textarea 
                          className="case-edit-textarea" 
                          value={editFormData.content}
                          onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                        />
                      </div>
                      <div className="detail-section">
                        <span className="detail-label">첨부 파일 (쉼표로 구분하여 수정)</span>
                        <input 
                          type="text" 
                          className="case-edit-input" 
                          value={editFormData.files}
                          onChange={(e) => setEditFormData({...editFormData, files: e.target.value})}
                          placeholder="예: 계약서.pdf, 증거사진.jpg"
                        />
                      </div>
                      <div className="detail-section opinion-section">
                        <span className="detail-label">전문가 코멘트 / 진행 상황 (수정)</span>
                        <textarea 
                          className="case-edit-textarea" 
                          value={editFormData.opinion}
                          onChange={(e) => setEditFormData({...editFormData, opinion: e.target.value})}
                        />
                      </div>
                      <div className="lawyer-action-bar">
                        <button className="btn-cancel" onClick={cancelEdit}>취소</button>
                        <button className="btn-save" onClick={() => saveEdit(caseItem.id)}>저장하기</button>
                      </div>
                    </div>
                  ) : (
                    /* 💡 일반 보기 모드일 때 */
                    <>
                      <div className="detail-section">
                        <span className="detail-label">사건 내용</span>
                        <p className="detail-text">{caseItem.content}</p>
                      </div>

                      {caseItem.files && caseItem.files.length > 0 && (
                        <div className="detail-section">
                          <span className="detail-label">첨부 파일</span>
                          <div className="file-tags">
                            {/* DB에서 배열이 아닌 쉼표 문자열로 올 경우를 대비한 방어 코드 */}
                            {(Array.isArray(caseItem.files) ? caseItem.files : caseItem.files.split(",")).map((file, idx) => (
                              <span key={idx} className="file-tag">📎 {file.trim()}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="detail-section opinion-section">
                        <span className="detail-label">전문가 코멘트 / 진행 상황</span>
                        <p className="detail-text opinion-text">
                          {caseItem.opinion ? caseItem.opinion : "아직 작성된 전문가 코멘트가 없습니다."}
                        </p>
                      </div>
                      
                      {/* 💡 변호사 전용 컨트롤 바 (이전/수정/다음) */}
                      {user?.role === "LAWYER" && caseItem.status < 4 && (
                        <div className="lawyer-control-bar">
                          <div className="left-controls">
                            <button 
                              className="btn-prev-step" 
                              onClick={() => handlePrevStep(caseItem.id, caseItem.status)}
                              disabled={caseItem.status === 0}
                            >
                              ⏪ 이전 단계로
                            </button>
                            <button className="btn-edit" onClick={() => startEdit(caseItem)}>
                              ✏️ 정보 수정하기
                            </button>
                          </div>
                          <button 
                            className="btn-advance-step" 
                            onClick={() => handleNextStep(caseItem.id, caseItem.status)}
                          >
                            ✅ 다음 단계 [{STEPS[caseItem.status + 1]}]
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* 💡 사건이 종료되었을 때 (이전 사건 내역 탭) 후기 영역 */}
                  {caseItem.status === 4 && user?.role !== "LAWYER" && (
                    <div className="review-section-wrapper">
                      {caseItem.review ? (
                        /* 이미 작성된 후기가 있는 경우 */
                        <div className="client-review-box">
                          <div className="review-header">
                            <span className="review-stars">{"★".repeat(caseItem.review.rating)}{"☆".repeat(5 - caseItem.review.rating)}</span>
                            <span className="review-date">{caseItem.review.date}</span>
                          </div>
                          <p className="review-content">{caseItem.review.content}</p>
                          <span className="review-author">의뢰인</span>
                        </div>
                      ) : reviewModeId === caseItem.id ? (
                        /* 후기 작성 모드 폼 */
                        <div className="client-review-form">
                          <h4 className="review-form-title">의뢰인 후기 작성</h4>
                          <div className="review-rating-select">
                            <span>만족도 별점: </span>
                            {[1, 2, 3, 4, 5].map(num => (
                              <span 
                                key={num} 
                                className={`star-select ${num <= reviewData.rating ? "active" : ""}`}
                                onClick={() => setReviewData({...reviewData, rating: num})}
                              >★</span>
                            ))}
                          </div>
                          <textarea 
                            className="review-textarea"
                            placeholder="변호사님과의 상담 및 사건 진행 후기를 남겨주세요."
                            value={reviewData.content}
                            onChange={(e) => setReviewData({...reviewData, content: e.target.value})}
                          />
                          <div className="review-action-bar">
                            <button className="btn-cancel" onClick={() => setReviewModeId(null)}>취소</button>
                            <button className="btn-save" onClick={() => submitReview(caseItem.id)}>후기 등록</button>
                          </div>
                        </div>
                      ) : (
                        /* 작성된 후기가 없고 작성 모드도 아닐 때 */
                        <button className="btn-write-review" onClick={() => startReview(caseItem.id)}>
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