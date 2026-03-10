// vs코드
// 파일 위치: src/pages/mypage/CaseDetailPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { caseApi } from "../../api/caseApi";
import { useAuthStore } from "../../store/authStore";
import "../../styles/mypage/CaseDetailPage.css"; 

const STEPS = ["접수", "배정", "진행 중", "의견 완료", "종료"];

const CaseDetailPage = () => {
  const { caseId } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuthStore(); 

  const [caseDetail, setCaseDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // 변호사용 수정 폼 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ content: "", expertOpinion: "" });
  const [selectedFiles, setSelectedFiles] = useState([]); // 💡 실제 다중 파일 업로드용

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
  
  // 서버에서 오는 step 데이터가 숫자(0~4)라고 가정.
  const currentStep = typeof caseDetail?.step === "number" ? caseDetail.step : 0;

  // 💡 [변호사 전용] 하단 버튼을 통한 상태 업데이트 (좌우 스텝 이동)
  const handleUpdateStatus = async (newStatus) => {
    if (newStatus < 0 || newStatus > 4) return;
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
    });
    setSelectedFiles([]);
  };

  // 💡 파일 선택 핸들러
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  // 💡 [변호사 전용] 수정한 내용 및 다중 파일 서버로 전송 (FormData 사용)
  const saveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("description", editForm.content);
      formData.append("expertOpinion", editForm.expertOpinion);
      
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      await caseApi.updateCaseInfo(caseId, formData);
      
      // 저장 후 최신 데이터를 보기 위해 새로고침 효과
      window.location.reload();
    } catch (error) {
      console.error("사건 수정 실패:", error);
      alert("정보 수정 및 파일 업로드에 실패했습니다.");
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

      {/* 2. 진행 단계 스텝 UI (💡 요청하신 파란불/빨간불 적용) */}
      <div className="progress-section">
        <h4 className="section-title">진행 상태</h4>
        <div className="progress-container">
          {/* 미진행 라인 (빨간색 계열) */}
          <div className="progress-line-bg"></div>
          {/* 진행 완료 라인 (파란색) */}
          <div 
            className="progress-line-active" 
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          ></div>
          
          <div className="progress-steps">
            {STEPS.map((step, idx) => {
              const isActive = idx <= currentStep;
              return (
                <div key={idx} className="step-item">
                  <div className={`step-circle ${isActive ? "active" : "pending"}`}>
                    {idx + 1}
                  </div>
                  <span className={`step-label ${isActive ? "active" : "pending"}`}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* 💡 [수정] 양쪽 끝 스텝 이동 버튼 배치 (변호사 전용) */}
        {isLawyer && !isEditMode && (
          <div className="step-action-bar">
            <button 
              className="btn-step prev" 
              onClick={() => handleUpdateStatus(currentStep - 1)}
              disabled={currentStep === 0}
            >
              &larr; 이전 스텝
            </button>
            <button 
              className="btn-step next" 
              onClick={() => handleUpdateStatus(currentStep + 1)}
              disabled={currentStep === 4}
            >
              다음 스텝 &rarr;
            </button>
          </div>
        )}
      </div>

      {/* 3. 사건 상세 내용 및 전문가 의견 영역 */}
      <div className="case-content-box">
        
        {isEditMode ? (
          /* 💡 변호사 전용 수정 폼 (파일 업로드 포함) */
          <div className="edit-form-box">
            <div className="edit-group">
              <label>사건 현재 상황 및 요약 (수정)</label>
              <textarea 
                className="edit-textarea" 
                value={editForm.content} 
                onChange={(e) => setEditForm({...editForm, content: e.target.value})} 
              />
            </div>
            
            <div className="edit-group">
              <label>증거 자료 / 필요 문서 첨부 (다중 선택 가능)</label>
              <input 
                type="file" 
                multiple 
                className="edit-input-file" 
                onChange={handleFileChange} 
              />
              <span className="file-hint">* 이미지는 물론 모든 형식의 파일을 올릴 수 있습니다.</span>
            </div>

            <div className="edit-group opinion-group">
              <label>👨‍⚖️ 전문가 코멘트 (의뢰인 전달용)</label>
              <textarea 
                className="edit-textarea opinion-textarea" 
                value={editForm.expertOpinion} 
                onChange={(e) => setEditForm({...editForm, expertOpinion: e.target.value})} 
                placeholder="현재 상황이나 추가로 필요한 증거자료 등을 의뢰인에게 안내해주세요."
              />
            </div>
            <div className="edit-actions">
              <button className="btn-cancel" onClick={() => setIsEditMode(false)}>취소</button>
              <button className="btn-save" onClick={saveEdit}>내용 및 파일 업로드 저장</button>
            </div>
          </div>
        ) : (
          /* 💡 의뢰인/변호사 공통 조회 화면 */
          <>
            <div className="content-section">
              <h4 className="content-label">사건 요약 및 진행 상황</h4>
              <p className="content-text">{caseDetail.description || "등록된 내용이 없습니다."}</p>
            </div>

            {/* 첨부파일 영역 (변호사와 유저가 공유) */}
            {caseDetail.files && caseDetail.files.length > 0 && (
              <div className="content-section">
                <h4 className="content-label">첨부된 증거 / 파일</h4>
                <div className="file-tags">
                  {caseDetail.files.map((file, idx) => (
                    <a 
                      key={idx} 
                      href={`http://localhost:8080${file.savePath}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="file-tag"
                    >
                      📎 {file.origName || "첨부파일"}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="opinion-box">
              <h4 className="opinion-label">👨‍⚖️ 담당 변호사 코멘트</h4>
              <p className="opinion-text">
                {caseDetail.expertOpinion ? caseDetail.expertOpinion : "아직 작성된 코멘트가 없습니다."}
              </p>
            </div>
            
            {/* 변호사 전용 수정 버튼 */}
            {isLawyer && (
              <div className="lawyer-action-right">
                <button className="btn-edit" onClick={startEdit}>
                  ✏️ 내용 업데이트 및 증거 첨부하기
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