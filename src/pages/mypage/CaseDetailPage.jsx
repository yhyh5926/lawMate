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

  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ content: "", expertOpinion: "" });
  const [selectedFiles, setSelectedFiles] = useState([]); // 💡 실제 파일 업로드용 상태

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await caseApi.getCaseDetail(caseId);
        setCaseDetail(response.data?.data || response.data);
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

  // 💡 오직 변호사만 컨트롤 가능하도록 강력한 권한 체크
  const isLawyer = user?.role === "LAWYER" || user?.memberType === "LAWYER";
  const currentStep = typeof caseDetail?.step === "number" ? caseDetail.step : 0;

  const handleUpdateStatus = async (newStatus) => {
    if (newStatus < 0 || newStatus > 4) return;
    if (window.confirm(`사건 단계를 [${STEPS[newStatus]}] (으)로 변경하시겠습니까?`)) {
      try {
        await caseApi.updateCaseStatus(caseId, newStatus);
        setCaseDetail((prev) => ({ ...prev, step: newStatus }));
      } catch (error) {
        alert("상태 변경에 실패했습니다.");
      }
    }
  };

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

  const saveEdit = async () => {
    try {
      // 💡 FormData를 이용해 텍스트와 실제 파일을 함께 전송
      const formData = new FormData();
      formData.append("description", editForm.content);
      formData.append("expertOpinion", editForm.expertOpinion);
      
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      await caseApi.updateCaseInfo(caseId, formData);
      
      // 저장 후 데이터 갱신을 위해 페이지 새로고침 효과
      window.location.reload();
    } catch (error) {
      console.error("사건 수정 실패:", error);
      alert("정보 수정 및 파일 업로드에 실패했습니다.");
    }
  };

  if (loading || !caseDetail) return <div className="detail-loading">불러오는 중...</div>;

  return (
    <div className="case-detail-container">
      <button onClick={() => navigate(-1)} className="btn-back-link">&larr; 목록으로 돌아가기</button>
      
      <div className="case-detail-header">
        <h2 className="case-title">{caseDetail.title}</h2>
        <span className="case-badge">{caseDetail.caseType || "일반"}</span>
      </div>
      <div className="case-meta">
        <span>👨‍⚖️ 담당 변호사: <b>{caseDetail.lawyerName || "미배정"}</b> &nbsp;|&nbsp; 👤 의뢰인: <b>{caseDetail.clientName || "미상"}</b></span>
        <span>접수일: {caseDetail.createdAt || "-"}</span>
      </div>

      {/* 💡 요청하신 파란불/빨간불 스텝 UI */}
      <div className="progress-section">
        <h4 className="section-title">진행 상태</h4>
        <div className="progress-container">
          <div className="progress-line-bg"></div>
          <div className="progress-line-active" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
          
          <div className="progress-steps">
            {STEPS.map((step, idx) => {
              const isActive = idx <= currentStep; // 진행완료/현재
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
        
        {/* 💡 양쪽 끝 스텝 이동 버튼 (변호사 전용) */}
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

      <div className="case-content-box">
        {isEditMode ? (
          <div className="edit-form-box">
            <div className="edit-group">
              <label>사건 현재 상황 및 요약</label>
              <textarea 
                className="edit-textarea" 
                value={editForm.content} 
                onChange={(e) => setEditForm({...editForm, content: e.target.value})} 
              />
            </div>
            
            {/* 💡 실제 파일 첨부 인풋으로 변경 */}
            <div className="edit-group">
              <label>증거 자료 / 필요 문서 첨부</label>
              <input 
                type="file" 
                multiple 
                className="edit-input-file" 
                onChange={handleFileChange} 
              />
              <span className="file-hint">* 여러 파일을 동시에 선택할 수 있습니다.</span>
            </div>

            <div className="edit-group opinion-group">
              <label>👨‍⚖️ 의뢰인 전달 코멘트 (요청사항 등)</label>
              <textarea 
                className="edit-textarea opinion-textarea" 
                value={editForm.expertOpinion} 
                onChange={(e) => setEditForm({...editForm, expertOpinion: e.target.value})} 
                placeholder="현재 상황이나 추가로 필요한 증거자료 등을 의뢰인에게 안내해주세요."
              />
            </div>
            <div className="edit-actions">
              <button className="btn-cancel" onClick={() => setIsEditMode(false)}>취소</button>
              <button className="btn-save" onClick={saveEdit}>저장 및 파일 업로드</button>
            </div>
          </div>
        ) : (
          <>
            <div className="content-section">
              <h4 className="content-label">사건 요약 및 진행 상황</h4>
              <p className="content-text">{caseDetail.description || "등록된 내용이 없습니다."}</p>
            </div>

            {/* 변호사/의뢰인이 공통으로 볼 수 있는 첨부파일 (서버 연동 시 객체 배열로 옴) */}
            {caseDetail.files && caseDetail.files.length > 0 && (
              <div className="content-section">
                <h4 className="content-label">첨부된 증거 / 파일</h4>
                <div className="file-tags">
                  {caseDetail.files.map((file, idx) => (
                    <a key={idx} href={`http://localhost:8080${file.savePath}`} target="_blank" rel="noreferrer" className="file-tag">
                      📎 {file.origName || file}
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
            
            {/* 내용 수정 버튼 (변호사 전용) */}
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