// src/pages/mypage/CaseDetailPage.jsx
// 설명: 마이페이지 - 내 사건의 상세 내용 및 진행 스텝을 확인하는 화면 (변호사/일반 분기 처리)

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { caseApi } from "../../api/caseApi";
import { useAuthStore } from "../../store/authStore";
import "../../styles/mypage/CaseDetailPage.css"; // 💡 전용 CSS 임포트

const STEPS = ["접수", "배정", "진행 중", "의견 완료", "종료"];

const CaseDetailPage = () => {
  const { caseId } = useParams(); // 💡 라우터 파라미터 유지
  const navigate = useNavigate();
  const { user } = useAuthStore(); // 권한 체크용

  const [caseDetail, setCaseDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // 변호사용 수정 폼 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ content: "", expertOpinion: "", files: "" });

  // 💡 실제 API 호출: 더미데이터 제거 및 서버 연동
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await caseApi.getCaseDetail(caseId);
        const data = response.data?.data || response.data;
        setCaseDetail(data);
      } catch (error) {
        console.error("사건 상세 조회 실패", error);
        alert("사건 정보를 불러올 수 없습니다.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    if (caseId) fetchDetail();
  }, [caseId, navigate]);

  // 💡 [권한] 변호사인지 확인하는 로직
  const isLawyer = user?.role === "LAWYER" || user?.memberType === "LAWYER";
  
  // 서버에서 오는 step 데이터가 숫자(0~4)라고 가정. (문자열일 경우 매핑 필요)
  const currentStep = typeof caseDetail?.step === "number" ? caseDetail.step : 0;

  // 💡 [변호사 전용] 상태 업데이트
  const handleUpdateStatus = async (newStatus) => {
    if (window.confirm(`사건 진행 단계를 [${STEPS[newStatus]}] 단계로 변경하시겠습니까?`)) {
      try {
        await caseApi.updateCaseStatus(caseId, newStatus);
        setCaseDetail((prev) => ({ ...prev, step: newStatus }));
        alert("진행 단계가 업데이트되었습니다.");
      } catch (error) {
        console.error("상태 변경 실패:", error);
        alert("상태 변경에 실패했습니다.");
      }
    }
  };

  // 💡 [변호사 전용] 내용 수정 모드 시작
  const startEdit = () => {
    setIsEditMode(true);
    setEditForm({
      content: caseDetail.description || "",
      expertOpinion: caseDetail.expertOpinion || "",
      files: Array.isArray(caseDetail.files) ? caseDetail.files.join(", ") : (caseDetail.files || ""),
    });
  };

  // 💡 [변호사 전용] 수정한 내용 서버로 전송
  const saveEdit = async () => {
    try {
      const updateData = {
        description: editForm.content,
        expertOpinion: editForm.expertOpinion,
        files: editForm.files.split(",").map((f) => f.trim()).filter((f) => f !== ""),
      };
      await caseApi.updateCaseInfo(caseId, updateData);
      
      setCaseDetail((prev) => ({ ...prev, ...updateData }));
      setIsEditMode(false);
      alert("사건 상세 내용 및 코멘트가 수정되었습니다.");
    } catch (error) {
      console.error("사건 수정 실패:", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  if (loading || !caseDetail) {
    return <div className="detail-loading">불러오는 중...</div>;
  }

  return (
    <div className="case-detail-container">
      <button onClick={() => navigate(-1)} className="btn-back-link">
        &larr; 목록으로 돌아가기
      </button>
      
      {/* 1. 사건 헤더 영역 */}
      <div className="case-detail-header">
        <h2 className="case-title">{caseDetail.title}</h2>
        <span className="case-badge">{caseDetail.caseType || "일반"}</span>
      </div>
      <div className="case-meta">
        <span>👨‍⚖️ 담당 변호사: <b>{caseDetail.lawyerName || "미배정"}</b> &nbsp;|&nbsp; 👤 의뢰인: <b>{caseDetail.clientName || "미상"}</b></span>
        <span>접수일: {caseDetail.createdAt || "-"}</span>
      </div>

      {/* 2. 진행 단계 스텝 UI */}
      <div className="progress-section">
        <h4 className="section-title">진행 상태</h4>
        <div className="progress-container">
          <div className="progress-line-bg"></div>
          <div 
            className="progress-line-active" 
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          ></div>
          
          <div className="progress-steps">
            {STEPS.map((step, idx) => {
              const isActive = idx <= currentStep;
              return (
                <div key={idx} className="step-item">
                  <div className={`step-circle ${isActive ? "active" : ""}`}>
                    {idx + 1}
                  </div>
                  <span className={`step-label ${isActive ? "active" : ""}`}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* 변호사 권한: 다음 단계로 상태 업데이트 버튼 */}
        {isLawyer && currentStep < 4 && (
          <div className="lawyer-action-right">
            <button className="btn-next-step" onClick={() => handleUpdateStatus(currentStep + 1)}>
              ✅ 다음 단계 [{STEPS[currentStep + 1]}] 로 업데이트
            </button>
          </div>
        )}
      </div>

      {/* 3. 사건 상세 내용 및 전문가 의견 영역 */}
      <div className="case-content-box">
        
        {isEditMode ? (
          /* 💡 변호사 전용 수정 폼 */
          <div className="edit-form-box">
            <div className="edit-group">
              <label>사건 상세 내용 (수정)</label>
              <textarea 
                className="edit-textarea" 
                value={editForm.content} 
                onChange={(e) => setEditForm({...editForm, content: e.target.value})} 
              />
            </div>
            <div className="edit-group">
              <label>첨부 파일 (쉼표로 구분하여 입력)</label>
              <input 
                type="text" 
                className="edit-input" 
                value={editForm.files} 
                onChange={(e) => setEditForm({...editForm, files: e.target.value})} 
                placeholder="예: 증거.jpg, 계약서.pdf"
              />
            </div>
            <div className="edit-group opinion-group">
              <label>👨‍⚖️ 전문가 코멘트 (의뢰인에게 보여집니다)</label>
              <textarea 
                className="edit-textarea opinion-textarea" 
                value={editForm.expertOpinion} 
                onChange={(e) => setEditForm({...editForm, expertOpinion: e.target.value})} 
                placeholder="진행 상황이나 필요한 서류 등을 안내해주세요."
              />
            </div>
            <div className="edit-actions">
              <button className="btn-cancel" onClick={() => setIsEditMode(false)}>취소</button>
              <button className="btn-save" onClick={saveEdit}>내용 및 코멘트 반영하기</button>
            </div>
          </div>
        ) : (
          /* 💡 의뢰인/변호사 공통 조회 뷰 */
          <>
            <div className="content-section">
              <h4 className="content-label">사건 상세 내용</h4>
              <p className="content-text">{caseDetail.description}</p>
            </div>

            {/* 첨부파일 영역 */}
            {caseDetail.files && caseDetail.files.length > 0 && (
              <div className="content-section">
                <h4 className="content-label">첨부 파일</h4>
                <div className="file-tags">
                  {(Array.isArray(caseDetail.files) ? caseDetail.files : caseDetail.files.split(",")).map((file, idx) => (
                    <span key={idx} className="file-tag">📎 {file.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {/* 전문가 의견 영역 */}
            <div className="opinion-box">
              <h4 className="opinion-label">👨‍⚖️ 전문가 코멘트 (의견)</h4>
              <p className="opinion-text">
                {caseDetail.expertOpinion ? caseDetail.expertOpinion : "아직 작성된 전문가 의견이 없습니다."}
              </p>
            </div>
            
            {/* 변호사 전용 수정 버튼 */}
            {isLawyer && (
              <div className="lawyer-action-right">
                <button className="btn-edit" onClick={startEdit}>
                  ✏️ 사건 내용 수정 및 코멘트 작성
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default CaseDetailPage;