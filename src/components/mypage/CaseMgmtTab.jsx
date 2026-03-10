// vs코드
// 파일 위치: src/components/mypage/CaseMgmtTab.jsx

import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore.js";
import { caseApi } from "../../api/caseApi"; 
import { getLawyerConsults } from "../../api/consultApi"; // 💡 상담 내역(의뢰인 목록)을 가져오기 위한 API 추가
import "../../styles/mypage/CaseMgmtTab.css";

const STEPS = ["접수", "배정", "진행 중", "의견 완료", "종료"];
const STEP_KEYS = ["RECEIVED", "ASSIGNED", "IN_PROGRESS", "OPINION_READY", "CLOSED"];
const STEP_MAPPING = { RECEIVED: 0, ASSIGNED: 1, IN_PROGRESS: 2, OPINION_READY: 3, CLOSED: 4 };

const CaseMgmtTab = () => {
  const { user } = useAuthStore();
  const [subTab, setSubTab] = useState("active"); 
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const [editModeId, setEditModeId] = useState(null);
  const [editFormData, setEditFormData] = useState({ content: "", files: "", opinion: "" });
  const [reviewModeId, setReviewModeId] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, content: "" });

  // 💡 수동 사건 등록 폼 상태 (clientName 텍스트 -> clientId 로 변경)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [clientList, setClientList] = useState([]); // 💡 승인된 의뢰인 목록을 담을 상태
  const [regForm, setRegForm] = useState({ clientId: "", title: "", caseType: "", description: "" });

  const isLawyer = user?.role === "LAWYER" || user?.memberType === "LAWYER";

  // 💡 사건 목록 불러오기
  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await caseApi.getMyCaseList(user.memberId);
      const data = response.data?.data || response.data || [];
      
      const mappedCases = data.map(c => ({
          id: c.caseId,
          title: c.title,
          type: c.caseType,
          date: c.createdAt?.split(" ")[0] || c.createdAt?.split("T")[0] || c.createdAt,
          status: STEP_MAPPING[c.step] !== undefined ? STEP_MAPPING[c.step] : 0,
          content: c.description || "",
          opinion: c.expertOpinion || "",
          lawyerName: c.lawyerName || "담당 변호사", 
          clientName: c.clientName || "의뢰인",
          files: "" 
      }));
      setCases(mappedCases);
    } catch (error) {
      console.error("사건 기록을 불러오는데 실패했습니다.", error);
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  // 💡 승인된 상담 내역에서 의뢰인 목록만 추출하여 드롭다운 메뉴용으로 만들기
  const fetchClients = async () => {
    if (!isLawyer) return;
    try {
      const res = await getLawyerConsults();
      const consults = res.data?.data || [];
      
      // CONFIRMED(승인/확정) 이거나 DONE(완료)인 사람만 중복 없이 추출
      const uniqueClients = [];
      const seenIds = new Set();
      
      consults.forEach(c => {
        if ((c.status === "CONFIRMED" || c.status === "DONE") && c.memberId) {
          if (!seenIds.has(c.memberId)) {
            seenIds.add(c.memberId);
            uniqueClients.push({ memberId: c.memberId, memberName: c.memberName });
          }
        }
      });
      setClientList(uniqueClients);
    } catch(e) {
      console.error("의뢰인 목록 불러오기 실패", e);
    }
  };

  useEffect(() => {
    if (user?.memberId) {
      fetchCases();
      fetchClients(); // 탭 렌더링 시 의뢰인 목록도 같이 세팅
    }
  }, [user]);

  // 💡 사건 직접 등록 함수 (DB와 완벽하게 연결)
  const handleManualRegister = async () => {
    if(!regForm.title || !regForm.clientId) {
      return alert("의뢰인을 선택하고 사건 제목을 필수적으로 입력해주세요.");
    }
    try {
      await caseApi.createCaseManual({
        lawyerId: user.memberId, 
        memberId: regForm.clientId, // 💡 선택한 의뢰인의 실제 DB 고유번호(MEMBER_ID) 전송
        title: regForm.title,
        caseType: regForm.caseType,
        description: regForm.description
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
        setCases(cases.map(c => c.id === id ? { ...c, status: currentStatus - 1 } : c));
      } catch (error) {
        console.error("상태 변경 실패:", error);
        alert("상태 변경 중 오류가 발생했습니다.");
      }
    }
  };

  const handleNextStep = async (id, currentStatus) => {
    if (currentStatus >= 4) return;
    if (window.confirm(`[${STEPS[currentStatus + 1]}] 단계로 업데이트 하시겠습니까?`)) {
      try {
        // 💡 백엔드 400 에러 해결: 문자열 키값 전송
        await caseApi.updateCaseStatus(id, STEP_KEYS[currentStatus + 1]);
        setCases(cases.map(c => c.id === id ? { ...c, status: currentStatus + 1 } : c));
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
      files: Array.isArray(caseItem.files) ? caseItem.files.join(", ") : (caseItem.files || ""),
      opinion: caseItem.opinion || ""
    });
  };

  const saveEdit = async (id) => {
    try {
      const formData = new FormData();
      formData.append("description", editFormData.content || "");
      formData.append("expertOpinion", editFormData.opinion || "");

      await caseApi.updateCaseInfo(id, formData);
      
      setCases(cases.map(c => c.id === id ? { ...c, content: editFormData.content, opinion: editFormData.opinion } : c));
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
    const dateString = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}.`;

    try {
      await caseApi.submitReview(id, { 
        rating: reviewData.rating, 
        content: reviewData.content 
      });

      setCases(cases.map(c => {
        if (c.id === id) return { ...c, review: { rating: reviewData.rating, content: reviewData.content, date: dateString } };
        return c;
      }));
      setReviewModeId(null);
      alert("소중한 후기가 등록되었습니다!");
    } catch (error) {
      console.error("후기 등록 실패:", error);
      alert("후기 등록 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="empty-tab-content">⚖️ 진행 중인 사건 및 과거 기록을 불러오는 중입니다...</div>;

  return (
    <div className="case-mgmt-wrapper">
      
      {/* 상단 헤더: 제목 및 등록 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 className="content-title" style={{ margin: 0 }}>사건 기록</h3>
        {isLawyer && (
          <button 
            onClick={() => setIsRegisterOpen(!isRegisterOpen)}
            style={{ padding: '10px 16px', background: '#1e4d8c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isRegisterOpen ? '닫기' : '+ 새로운 사건 직접 등록'}
          </button>
        )}
      </div>

      {/* 💡 사건 직접 등록 폼 (토글 방식) */}
      {isRegisterOpen && (
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>새로운 의뢰인 사건 등록</h4>
          <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
            
            {/* 💡 드롭다운으로 의뢰인 선택 */}
            <select 
              value={regForm.clientId} 
              onChange={e=>setRegForm({...regForm, clientId: e.target.value})} 
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <option value="">의뢰인 선택 (상담 승인 완료자)</option>
              {clientList.map(client => (
                <option key={client.memberId} value={client.memberId}>
                  {client.memberName} 의뢰인
                </option>
              ))}
            </select>

            <input 
              type="text" 
              placeholder="사건 유형 (예: 민사, 이혼)" 
              value={regForm.caseType} 
              onChange={e=>setRegForm({...regForm, caseType: e.target.value})} 
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>
          
          {clientList.length === 0 && (
            <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px', marginBottom: '0' }}>
              * 현재 승인(확정)된 상담 내역이 없어 의뢰인을 선택할 수 없습니다. 접수 관리 탭에서 상담을 먼저 승인해주세요.
            </p>
          )}

          <input 
            type="text" 
            placeholder="사건 제목 (예: 임대차 보증금 반환 소송)" 
            value={regForm.title} 
            onChange={e=>setRegForm({...regForm, title: e.target.value})} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '10px', boxSizing: 'border-box' }}
          />
          <textarea 
            placeholder="사전 상담 내용 및 요약" 
            value={regForm.description} 
            onChange={e=>setRegForm({...regForm, description: e.target.value})} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '10px', minHeight: '80px', boxSizing: 'border-box', resize: 'vertical' }}
          />
          <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <button onClick={handleManualRegister} style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>사건 등록하기</button>
          </div>
        </div>
      )}

      {/* 서브 탭: 진행 중 / 이전 내역 */}
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

      {/* 리스트 영역 */}
      {filteredCases.length === 0 ? (
        <div className="empty-tab-content">
          {subTab === "active" ? "현재 진행 중인 사건이 없습니다." : "이전 사건 내역이 없습니다."}
        </div>
      ) : (
        <div className="case-list">
          {filteredCases.map((caseItem) => (
            <div key={caseItem.id} className="case-card">
              
              {/* 사건 헤더 (클릭 시 토글) */}
              <div className="case-header" onClick={() => toggleDetail(caseItem.id)}>
                <div className="case-header-left">
                  <span className="case-type-badge">{caseItem.type || "일반"} 사건</span>
                  <h4 className="case-title">{caseItem.title}</h4>
                </div>
                <div className="case-header-right">
                  <span className="case-date">접수일: {caseItem.date}</span>
                  <span className="expand-icon">{expandedId === caseItem.id ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* 진행 상태 바 (색상 구분) */}
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

              {/* 상세 정보 박스 (토글) */}
              {expandedId === caseItem.id && (
                <div className="case-detail-box">
                  <div className="detail-section">
                    <span className="detail-label">당사자 정보</span>
                    <p className="detail-text">👨‍⚖️ 담당 변호사: <b>{caseItem.lawyerName}</b> &nbsp;&nbsp;|&nbsp;&nbsp; 👤 의뢰인: <b>{caseItem.clientName}</b></p>
                  </div>
                  
                  {/* 수정 모드 분기 */}
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
                    <>
                      <div className="detail-section">
                        <span className="detail-label">사건 내용</span>
                        <p className="detail-text">{caseItem.content}</p>
                      </div>

                      <div className="detail-section opinion-section">
                        <span className="detail-label">전문가 코멘트 / 진행 상황</span>
                        <p className="detail-text opinion-text">
                          {caseItem.opinion ? caseItem.opinion : "아직 작성된 전문가 코멘트가 없습니다."}
                        </p>
                      </div>
                      
                      {/* 변호사 전용 컨트롤 바 */}
                      {isLawyer && caseItem.status < 4 && (
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

                  {/* 의뢰인 후기 섹션 (종료 시에만 노출) */}
                  {caseItem.status === 4 && !isLawyer && (
                    <div className="review-section-wrapper">
                      {caseItem.review ? (
                        <div className="client-review-box">
                          <div className="review-header">
                            <span className="review-stars">{"★".repeat(caseItem.review.rating)}{"☆".repeat(5 - caseItem.review.rating)}</span>
                            <span className="review-date">{caseItem.review.date}</span>
                          </div>
                          <p className="review-content">{caseItem.review.content}</p>
                          <span className="review-author">의뢰인</span>
                        </div>
                      ) : reviewModeId === caseItem.id ? (
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