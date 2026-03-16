import React, { useState, useEffect, useRef } from "react";
import lawyerApi from "../../api/lawyerApi.js";
import { useAuthStore } from "../../store/authStore.js";
import { DEFAULT_IMAGE } from "../../pages/lawyer/LawyerListPage.jsx";
import { baseURL } from "../../constants/baseURL.js";

import "../../styles/lawyer/LawyerDetailPage.css";
import "../../styles/mypage/LawyerMgmtTab.css";
import { categories } from "../../constants/categories.js";

const SPECIALTIES = categories.slice(1, categories.length - 1);

const LawyerMgmtTab = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [lawyerId, setLawyerId] = useState(null);

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(DEFAULT_IMAGE);

  const [readOnlyData, setReadOnlyData] = useState({
    name: user.name || "이름 없음",
    email: user.email || "-",
    phone: user.phone || "-",
    licenseNo: user.licenseNo || "-",
    avgRating: 0.0,
    reviewCnt: 0,
  });

  const [formData, setFormData] = useState({
    officeName: "",
    officeAddr: "",
    officeDetailAddr: "",
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
          officeDetailAddr: data.officeDetailAddr || "",
          specialty: data.specialty || "",
          intro: data.intro || "",
          career: data.career || "",
          consultFee: data.consultFee || 0,
        });

        setReadOnlyData((prev) => ({
          ...prev,
          avgRating: data.avgRating || 0.0,
          reviewCnt: data.reviewCnt || 0,
        }));

        const path = data.savePath || data.profileUrl || data.imageUrl;
        if (path)
          setPreviewImg(path.startsWith("http") ? path : baseURL + path);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
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

  const handleSpecToggle = (spec) => {
    let currentList = formData.specialty
      ? formData.specialty.split(",").map((s) => s.trim())
      : [];
    if (currentList.includes(spec)) {
      currentList = currentList.filter((item) => item !== spec);
    } else {
      currentList.push(spec);
    }
    setFormData((prev) => ({ ...prev, specialty: currentList.join(",") }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedFile) {
        const fileData = new FormData();
        fileData.append("file", selectedFile);
        await lawyerApi.uploadProfileImage(lawyerId, fileData);
      }
      await lawyerApi.updateLawyer(lawyerId, formData);
      alert("성공적으로 저장되었습니다!");
    } catch (err) {
      alert("저장 실패", err);
    }
  };

  const selectedList = formData.specialty
    ? formData.specialty.split(",").map((s) => s.trim())
    : [];

  if (loading)
    return (
      <div className="ld-status-screen">
        <div className="ld-spinner"></div>
      </div>
    );

  return (
    <div className="lawyer-mgmt-wrapper ld-root mgmt-dark-section">
      <div className="mgmt-info-notice">
        💡 <strong>프로필 편집 모드:</strong> 수정하신 내용은 즉시 서비스 상세 페이지에 반영됩니다.
      </div>

      <form onSubmit={handleSubmit} className="ld-container">
        <header className="ld-header-card">
          <div className="ld-header-glow" />
          <div className="ld-header-content">
            <div className="ld-profile-flex">
              <div
                className="ld-img-wrapper mgmt-img-box-edit"
                onClick={() => fileInputRef.current.click()}
              >
                <img
                  src={previewImg}
                  alt="Profile"
                  onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                />
                <div className="mgmt-img-overlay-edit">
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

              <div className="ld-main-meta">
                <label className="mgmt-label-small">
                  전문 분야 설정 (클릭하여 토글)
                </label>
                <div className="mgmt-spec-group">
                  {SPECIALTIES.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => handleSpecToggle(spec)}
                      className={`mgmt-spec-btn ${selectedList.includes(spec) ? "active" : ""}`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>

                <div className="ld-name">
                  <h1 style={{ color: '#fff', margin: 0 }}>
                    {readOnlyData.name} <span className="ld-name-suffix">변호사</span>
                  </h1>
                </div>

                <div className="ld-office">
                  <label className="mgmt-label-small">사무소 명칭</label>
                  <input
                    type="text"
                    name="officeName"
                    value={formData.officeName}
                    onChange={handleChange}
                    className="mgmt-edit-input"
                    placeholder="법무법인 또는 사무소 이름을 입력하세요"
                  />
                </div>

                <div className="ld-rating-row">
                  <span className="ld-score">
                    ★ {readOnlyData.avgRating.toFixed(1)}
                  </span>
                  <span className="ld-rev-count">
                    ({readOnlyData.reviewCnt}개의 후기)
                  </span>
                </div>
              </div>
            </div>

            <div className="ld-intro-quote">
              <label className="mgmt-label-small">핵심 한 줄 소개</label>
              <div className="quote-input-row" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <span className="quote-mark" style={{ marginRight: '8px' }}>“</span>
                <input
                  type="text"
                  name="intro"
                  value={formData.intro}
                  onChange={handleChange}
                  className="mgmt-edit-input"
                  placeholder="의뢰인에게 보여질 신뢰감 있는 한 줄 소개를 적어주세요."
                />
                <span className="quote-mark" style={{ marginLeft: '8px' }}>”</span>
              </div>
            </div>
          </div>
        </header>

        <div className="ld-grid">
          <div className="ld-main-content">
            <section className="ld-card">
              <div className="ld-card-eyebrow">CAREER</div>
              <h2 className="ld-card-title">주요 경력 편집</h2>
              <textarea
                name="career"
                value={formData.career}
                onChange={handleChange}
                className="mgmt-edit-textarea"
                placeholder="• 주요 경력을 줄바꿈하여 작성해주세요."
                rows={15}
              />
            </section>
          </div>

          <aside className="ld-sticky-sidebar">
            <section className="ld-card">
              <div className="ld-card-eyebrow">CONTACT & FEE</div>
              <h2 className="ld-card-title">상담 및 위치 설정</h2>

              <dl className="ld-contact-list">
                <div className="ld-contact-item">
                  <dt className="mgmt-label-small">자격번호 (수정불가)</dt>
                  <dd style={{ color: '#1a1a2e', fontWeight: '700' }}>{readOnlyData.licenseNo}</dd>
                </div>

                <div className="ld-contact-item">
                  <dt className="mgmt-label-small">사무소 기본 주소</dt>
                  <dd>
                    <input
                      type="text"
                      name="officeAddr"
                      value={formData.officeAddr}
                      onChange={handleChange}
                      className="mgmt-edit-input"
                      style={{ color: '#1a1a2e', borderBottomColor: '#e2e8f0' }}
                      placeholder="기본 주소를 입력하세요"
                    />
                  </dd>
                </div>

                <div className="ld-contact-item">
                  <dt className="mgmt-label-small">사무소 상세 주소</dt>
                  <dd>
                    <input
                      type="text"
                      name="officeDetailAddr"
                      value={formData.officeDetailAddr}
                      onChange={handleChange}
                      className="mgmt-edit-input"
                      style={{ color: '#1a1a2e', borderBottomColor: '#e2e8f0' }}
                      placeholder="상세 주소 (예: 101동 202호)"
                    />
                  </dd>
                </div>
              </dl>

              <div className="ld-fee-box">
                <span className="mgmt-label-small">30분 기준 상담료</span>
                <div className="fee-input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="number"
                    name="consultFee"
                    value={formData.consultFee}
                    onChange={handleChange}
                    className="mgmt-edit-input"
                    style={{ color: '#1a1a2e', textAlign: 'right', fontSize: '18px', fontWeight: '800' }}
                  />
                  <span style={{ fontWeight: '800', color: '#1a1a2e' }}>원</span>
                </div>
              </div>

              <div className="ld-actions">
                <button type="submit" className="ld-btn-save">
                  설정 내용 저장하기
                </button>
              </div>
            </section>
          </aside>
        </div>
      </form>
    </div>
  );
};

export default LawyerMgmtTab;