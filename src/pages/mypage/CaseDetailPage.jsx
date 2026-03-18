// vs코드
// 파일 위치: src/pages/mypage/CaseDetailPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { caseApi } from "../../api/caseApi";
import { useAuthStore } from "../../store/authStore";
import "../../styles/mypage/CaseDetailPage.css"; 

const STEPS = ["접수", "배정", "진행 중", "의견 완료", "종료"];
const STEP_KEYS = ["RECEIVED", "ASSIGNED", "IN_PROGRESS", "OPINION_READY", "CLOSED"];
// 💡 백엔드 문자열 상태값을 숫자로 매핑하기 위한 객체 (UI 인덱스 계산용)
const STEP_MAPPING = { RECEIVED: 0, ASSIGNED: 1, IN_PROGRESS: 2, OPINION_READY: 3, CLOSED: 4 };

const CaseDetailPage = () => {
  const { caseId } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuthStore(); 

  const [caseDetail, setCaseDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // 변호사용 수정 폼 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ content: "", expertOpinion: "" });
  const [selectedFiles, setSelectedFiles] = useState([]); // 💡 실제 다중 파일 업로드용 상태

  // 💡 실제 API 호출: 더미데이터 제거 및 서버 연동 (JOIN된 이름 정보 포함)
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

  // 💡 [권한] 변호사인지 확인하는 로직 (role 또는 memberType 체크)
  const isLawyer = user?.role === "LAWYER" || user?.memberType === "LAWYER";
  
  // 💡 서버에서 오는 step 데이터(문자열 혹은 숫자)를 인덱스(0~4)로 변환
  const currentStep = typeof caseDetail?.step === "string" 
    ? (STEP_MAPPING[caseDetail.step] ?? 0) 
    : (typeof caseDetail?.step === "number" ? caseDetail.step : 0);

  // 💡 [변호사 전용] 하단 버튼을 통한 상태 업데이트 (좌우 스텝 이동)
  const handleUpdateStatus = async (newStatus) => {
    if (newStatus < 0 || newStatus > 4) return;
    
    // 💡 [400 에러 해결] 백엔드에서 요구하는 문자열 키값(RECEIVED 등)을 추출
    const stepKey = STEP_KEYS[newStatus];
    
    if (window.confirm(`사건 진행 단계를 [${STEPS[newStatus]}] 단계로 변경하시겠습니까?`)) {
      try {
        // 백엔드 API 호출 시 문자열 상태값 전송
        await caseApi.updateCaseStatus(caseId, stepKey);
        setCaseDetail((prev) => ({ ...prev, step: stepKey }));
        alert("진행 단계가 업데이트되었습니다.");
        window.location.reload(); // 화면 갱신
      } catch (error) {
        console.error("상태 변경 실패:", error);
        alert("상태 변경에 실패했습니다.");
      }
    }
  };

  // 💡 [변호사 전용] 내용 수정 모드 시작 (기존 데이터 세팅)
  const startEdit = () => {
    setIsEditMode(true);
    setEditForm({
      content: caseDetail.description || "",
      expertOpinion: caseDetail.expertOpinion || "",
    });
    setSelectedFiles([]);
  };

  // 💡 파일 선택 핸들러 (다중 파일 지원)
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  // 💡 [변호사 전용] 수정한 내용 및 다중 파일 서버로 전송 (FormData 사용)
  const saveEdit = async () => {
    try {
      const formData = new FormData();
      // 💡 400 에러 방지를 위해 빈 값이라도 반드시 전송 (필드명: description)
      formData.append("description", editForm.content || "");
      formData.append("expertOpinion", editForm.expertOpinion || "");
      
      // 선택된 파일이 있을 경우에만 FormData에 추가
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });
      }

      await caseApi.updateCaseInfo(caseId, formData);
      
      alert("성공적으로 저장 및 파일이 업로드되었습니다.");
      setIsEditMode(false);
      window.location.reload(); // 최신 데이터 로드
    } catch (error) {
      console.error("사건 수정 실패:", error);
      alert("정보 수정 및 파일 업로드에 실패했습니다. (필수 항목을 확인해주세요)");
    }
  };

  if (loading || !caseDetail) {
    return <div className="detail-loading">⚖️ 사건 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="case-detail-container">
      {/* 상단 뒤로가기 링크 */}
      <button onClick={() => navigate(-1)} className="btn-back-link">
        &larr; 목록으로 돌아가기
      </button>
      
      {/* 1. 사건 헤더 영역 (제목 및 태그) */}
      <div className="case-detail-header">
        <h2 className="case-title">{caseDetail.title}</h2>
        <span className="case-badge">{caseDetail.caseType || "일반"} 사건</span>
      </div>
      
      {/* 담당자 정보 메타 영역 */}
      <div className="case-meta">
        <span>👨‍⚖️ 담당 변호사: <b>{caseDetail.lawyerName || "미배정"}</b> &nbsp;|&nbsp; 👤 의뢰인: <b>{caseDetail.clientName || "미상"}</b></span>
        <span>접수일: {caseDetail.createdAt || "-"}</span>
      </div>

      {/* 2. 진행 단계 스텝 UI (💡 요청하신 파란불/빨간불 시각화 적용) */}
      <div className="progress-section">
        <h4 className="section-title">사건 진행 상태</h4>
        <div className="progress-container">
          {/* 미진행/배경 라인 (빨간색 계열) */}
          <div className="progress-line-bg"></div>
          {/* 진행 완료 및 현재 라인 (파란색 활성화) */}
          <div 
            className="progress-line-active" 
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          ></div>
          
          <div className="progress-steps">
            {STEPS.map((step, idx) => {
              const isActive = idx <= currentStep; // 현재 혹은 이전 단계인 경우 활성화
              return (
                <div key={idx} className="step-item">
                  {/* 💡 파란색(active)과 빨간색(pending) 클래스 분기 처리 */}
                  <div className={`step-circle ${isActive ? "active" : "pending"}`}>
                    {idx + 1}
                  </div>
                  <span className={`step-label ${isActive ? "active" : "pending"}`}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* 💡 [복구됨] 양쪽 끝 스텝 이동 버튼 바 (변호사 전용 컨트롤러) */}
        {isLawyer && !isEditMode && (
          <div className="step-action-bar">
            <button 
              className="btn-step prev" 
              onClick={() => handleUpdateStatus(currentStep - 1)}
              disabled={currentStep === 0}
            >
              &larr; 이전 단계로
            </button>
            <span className="step-current-text">현재 상태: <b>{STEPS[currentStep]}</b></span>
            <button 
              className="btn-step next" 
              onClick={() => handleUpdateStatus(currentStep + 1)}
              disabled={currentStep === 4}
            >
              다음 단계로 &rarr;
            </button>
          </div>
        )}
      </div>

      {/* 3. 사건 상세 내용 및 전문가 의견 영역 */}
      <div className="case-content-box">
        
        {isEditMode ? (
          /* 💡 변호사 전용 수정 폼 (내용 + 파일 업로드) */
          <div className="edit-form-box">
            <div className="edit-group">
              <label>사건 현재 상황 및 상세 요약 (수정)</label>
              <textarea 
                className="edit-textarea" 
                value={editForm.content} 
                onChange={(e) => setEditForm({...editForm, content: e.target.value})} 
                placeholder="사건의 현재 상황을 의뢰인이 알기 쉽게 기록해주세요."
              />
            </div>
            
            {/* 💡 파일 첨부 입력 영역 */}
            <div className="edit-group">
              <label>증거 자료 / 필요 문서 추가 첨부 (다중 선택 가능)</label>
              <input 
                type="file" 
                multiple 
                className="edit-input-file" 
                onChange={handleFileChange} 
              />
              <span className="file-hint">* 선택한 파일들이 서버로 안전하게 업로드됩니다.</span>
            </div>

            <div className="edit-group opinion-group">
              <label>👨‍⚖️ 전문가 코멘트 (의뢰인 전달용 의견)</label>
              <textarea 
                className="edit-textarea opinion-textarea" 
                value={editForm.expertOpinion} 
                onChange={(e) => setEditForm({...editForm, expertOpinion: e.target.value})} 
                placeholder="의뢰인에게 요청할 서류나 향후 진행 계획을 작성해주세요."
              />
            </div>
            
            <div className="edit-actions">
              <button className="btn-cancel" onClick={() => setIsEditMode(false)}>수정 취소</button>
              <button className="btn-save" onClick={saveEdit}>내용 및 파일 업로드 저장</button>
            </div>
          </div>
        ) : (
          /* 💡 의뢰인/변호사 공통 조회 화면 (기본 상태) */
          <>
            {/* 사건 요약 섹션 */}
            <div className="content-section">
              <h4 className="content-label">사건 요약 및 진행 상황</h4>
              <div className="content-text-box">
                <p className="content-text">{caseDetail.description || "등록된 상세 내용이 없습니다."}</p>
              </div>
            </div>

            {/* 💡 [복구됨] 첨부파일 목록 섹션 (파일 데이터가 존재할 경우에만 노출) */}
            {caseDetail.files && caseDetail.files.length > 0 && (
              <div className="content-section">
                <h4 className="content-label">첨부된 증거 및 관련 서류</h4>
                <div className="file-tags">
                  {caseDetail.files.map((file, idx) => (
                    <a 
                      key={idx} 
                      href={`http://localhost:8080${file.savePath}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="file-tag"
                      title="클릭하면 파일을 새 창에서 확인합니다."
                    >
                      📎 {file.origName || `첨부파일_${idx + 1}`}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 전문가 코멘트 섹션 */}
            <div className="opinion-box">
              <h4 className="opinion-label">👨‍⚖️ 담당 변호사 코멘트</h4>
              <div className="opinion-text-box">
                <p className="opinion-text">
                  {caseDetail.expertOpinion ? caseDetail.expertOpinion : "아직 변호사님이 작성하신 코멘트가 없습니다."}
                </p>
              </div>
            </div>
            
            {/* 💡 변호사 권한일 때만 노출되는 수정 버튼 */}
            {isLawyer && (
              <div className="lawyer-action-right">
                <button className="btn-edit" onClick={startEdit}>
                  ✏️ 내용 업데이트 및 증거 파일 첨부
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