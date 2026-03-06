// src/components/mypage/LawyerMgmtTab.jsx
import React, { useState, useEffect, useRef } from "react";
import lawyerApi from "../../api/lawyerApi";
import { useAuthStore } from "../../store/authStore.js";
import { DEFAULT_IMAGE } from "../../pages/lawyer/LawyerListPage";
import "../../styles/mypage/LawyerMgmtTab.css";

const LawyerMgmtTab = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [lawyerId, setLawyerId] = useState(null);
  
  // 프로필 사진 관련 상태
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(DEFAULT_IMAGE);

  // 읽기 전용 정보
  const [readOnlyData, setReadOnlyData] = useState({
    name: user.name || "이름 없음",
    email: user.email || "-",
    phone: user.phone || "-",
    licenseNo: user.licenseNo || "-",
    avgRating: 0.0,
    reviewCnt: 0
  });

  // 수정 가능한 정보
  const [formData, setFormData] = useState({
    officeName: "",
    officeAddr: "",
    specialty: "",
    intro: "",
    career: "",
    consultFee: 0,
  });

  useEffect(() => {
    const fetchLawyerData = async () => {
      try {
        setLoading(true);
        const res = await lawyerApi.getLawyerByMemberId(user.memberId);
        const data = res.data?.data || res.data || res;
        
        setLawyerId(data.lawyerId);
        
        setFormData({
          officeName: data.officeName || "",
          officeAddr: data.officeAddr || "",
          specialty: data.specialty || "",
          intro: data.intro || "",
          career: data.career || "",
          consultFee: data.consultFee || 0,
        });

        setReadOnlyData(prev => ({
          ...prev,
          avgRating: data.avgRating || 0.0,
          reviewCnt: data.reviewCnt || 0
        }));

        const path = data.savePath || data.profileUrl || data.profileImage;
        if (path) {
          setPreviewImg(path.startsWith("http") ? path : `http://localhost:8080${path}`);
        }
      } catch (err) {
        console.error("변호사 정보 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.memberId) fetchLawyerData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "consultFee" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!lawyerId) {
        alert("변호사 고유 식별자(ID)를 찾을 수 없습니다.");
        return;
      }

      // 💡 1. 이미지 파일이 선택되었다면 백엔드로 전송 (주석 완전 해제됨!)
      if (selectedFile) {
        const fileData = new FormData();
        fileData.append("file", selectedFile);
        await lawyerApi.uploadProfileImage(lawyerId, fileData);
      }

      // 💡 2. 나머지 텍스트 정보 전송
      await lawyerApi.updateLawyer(lawyerId, formData);
      
      alert("변호사 프로필 및 상담 설정이 성공적으로 저장되었습니다!");
    } catch (err) {
      console.error(err);
      alert("정보 저장에 실패했습니다. (API 연동 확인 필요)");
    }
  };

  if (loading) {
    return <div className="empty-tab-content">변호사 정보를 불러오는 중입니다...</div>;
  }

  const isDefaultImg = previewImg === DEFAULT_IMAGE;

  return (
    <div className="lawyer-mgmt-wrapper">
      <h3 className="mgmt-content-title">프로필 및 상담 관리</h3>
      <div className="mgmt-info-notice">
        💡 아래 입력하신 내용과 디자인 그대로 실제 '전문 변호사 찾기' 상세 페이지에 노출됩니다.
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* 1. 상단 프로필 헤더 */}
        <section className="mgmt-header">
          
          <div className="mgmt-img-box" onClick={() => fileInputRef.current.click()}>
            <img
              src={previewImg}
              alt="프로필 미리보기"
              className={`mgmt-img ${isDefaultImg ? 'default-avatar' : 'real-profile'}`}
              onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
            />
            <div className="mgmt-img-overlay">
              <span>📷 사진 변경</span>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              hidden 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
          </div>

          <div className="mgmt-info">
            <div>
              <label className="mgmt-label-small">전문 분야 (배지)</label>
              <input 
                type="text" 
                name="specialty" 
                value={formData.specialty} 
                onChange={handleChange} 
                className="mgmt-edit-input mgmt-input-specialty" 
                placeholder="예: 형사,이혼,민사" 
              />
            </div>
            
            <div className="mgmt-name-display">
              {readOnlyData.name} 변호사
            </div>

            <div className="mgmt-office-wrapper">
              <label className="mgmt-label-small">사무소 / 법무법인 이름</label>
              <input 
                type="text" 
                name="officeName" 
                value={formData.officeName} 
                onChange={handleChange} 
                className="mgmt-edit-input" 
                placeholder="예: OO법률사무소" 
              />
            </div>

            <div className="mgmt-rating">
              <span className="star">★</span> {readOnlyData.avgRating.toFixed(1)}
              <span className="count">({readOnlyData.reviewCnt}개의 후기)</span>
            </div>
          </div>
        </section>

        {/* 2. 핵심 요약 (Intro) */}
        <section className="mgmt-summary-box">
          <label className="mgmt-summary-label">
            핵심 한 줄 소개 (상세 페이지 상단 박스)
          </label>
          <textarea 
            name="intro" 
            value={formData.intro} 
            onChange={handleChange} 
            className="mgmt-edit-textarea" 
            placeholder="의뢰인의 마음을 사로잡을 핵심 소개글을 적어주세요." 
            rows={3} 
          />
        </section>

        {/* 3. 주요 경력 */}
        <section className="mgmt-section">
          <h3 className="mgmt-section-title">주요 경력 작성</h3>
          <textarea 
            name="career" 
            value={formData.career} 
            onChange={handleChange} 
            className="mgmt-edit-textarea" 
            placeholder="주요 경력 사항을 줄바꿈하여 자세히 작성해주세요." 
            rows={6} 
          />
        </section>

        {/* 4. 사무소 및 상담 연락처 정보 테이블 */}
        <section className="mgmt-section">
          <h3 className="mgmt-section-title">사무소 및 상담 설정</h3>
          <div className="mgmt-info-table">
            <div className="mgmt-info-row">
              <span className="mgmt-info-label">자격번호</span>
              <span className="mgmt-info-value"><div className="mgmt-readonly-text">{readOnlyData.licenseNo}</div></span>
            </div>
            <div className="mgmt-info-row">
              <span className="mgmt-info-label">이메일</span>
              <span className="mgmt-info-value"><div className="mgmt-readonly-text">{readOnlyData.email}</div></span>
            </div>
            <div className="mgmt-info-row">
              <span className="mgmt-info-label">연락처</span>
              <span className="mgmt-info-value"><div className="mgmt-readonly-text">{readOnlyData.phone}</div></span>
            </div>
            <div className="mgmt-info-row">
              <span className="mgmt-info-label">사무소 위치</span>
              <span className="mgmt-info-value">
                <input 
                  type="text" 
                  name="officeAddr" 
                  value={formData.officeAddr} 
                  onChange={handleChange} 
                  className="mgmt-edit-input" 
                  placeholder="사무실 상세 주소를 입력해주세요" 
                />
              </span>
            </div>
            {/* 기본 상담료 설정 (통합됨) */}
            <div className="mgmt-info-row mgmt-row-fee">
              <span className="mgmt-info-label mgmt-label-fee">기본 상담료<br/><small>(30분 기준)</small></span>
              <span className="mgmt-info-value mgmt-value-fee">
                <input 
                  type="number" 
                  name="consultFee" 
                  value={formData.consultFee} 
                  onChange={handleChange} 
                  className="mgmt-edit-input mgmt-input-fee" 
                  min="0"
                  step="10000"
                />
                <span className="mgmt-unit-text">원</span>
              </span>
            </div>
          </div>
        </section>

        {/* 5. 하단 고정 액션 버튼 */}
        <button type="submit" className="mgmt-save-btn">
          프로필 및 상담 설정 저장하기
        </button>

      </form>
    </div>
  );
};

export default LawyerMgmtTab;