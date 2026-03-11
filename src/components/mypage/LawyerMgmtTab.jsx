import React, { useState, useEffect, useRef } from "react";
import lawyerApi from "../../api/lawyerApi";
import { useAuthStore } from "../../store/authStore.js";
import { DEFAULT_IMAGE } from "../../pages/lawyer/LawyerListPage";
import { baseURL } from "../../constants/baseURL.js";

// 스타일 임포트
import "../../styles/lawyer/LawyerDetailPage.css"; // 기본 상세페이지 스타일
import "../../styles/mypage/LawyerMgmtTab.css"; // 관리탭 전용 스타일 (앞서 드린 CSS)
import { categories } from "../../constants/categories.js";

//전문분야
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
    <div
      className="lawyer-mgmt-wrapper ld-root"
      style={{ minHeight: "auto", paddingBottom: "0" }}
    >
      <div className="mgmt-info-notice">
        💡 <strong>프로필 편집 모드:</strong> 수정하신 내용은 즉시 서비스 상세
        페이지에 반영됩니다.
      </div>

      <form
        onSubmit={handleSubmit}
        className="ld-container"
        style={{ padding: "0" }}
      >
        {/* ── 1. 헤더 섹션 (상세페이지 디자인 적용) ── */}
        <header className="ld-header-card">
          <div className="ld-header-glow" />
          <div className="ld-header-content">
            <div className="ld-profile-flex">
              {/* 프로필 이미지 변경 영역 */}
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
                {/* 전문 분야 선택 */}
                <label className="mgmt-label-small">
                  전문 분야 설정 (클릭하여 토글)
                </label>
                <div
                  className="mgmt-spec-group"
                  style={{ marginBottom: "15px" }}
                >
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

                <h1 className="ld-name">
                  {readOnlyData.name}{" "}
                  <span className="ld-name-suffix">변호사</span>
                </h1>

                <div className="ld-office" style={{ marginTop: "10px" }}>
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

                <div className="ld-rating-row" style={{ marginTop: "12px" }}>
                  <span className="ld-score">
                    ★ {readOnlyData.avgRating.toFixed(1)}
                  </span>
                  <span className="ld-rev-count">
                    ({readOnlyData.reviewCnt}개의 후기)
                  </span>
                </div>
              </div>
            </div>

            {/* 한 줄 소개 편집 */}
            <div
              className="ld-intro-quote"
              style={{ flexDirection: "column", alignItems: "flex-start" }}
            >
              <label className="mgmt-label-small">핵심 한 줄 소개</label>
              <div style={{ display: "flex", width: "100%", gap: "10px" }}>
                <span className="quote-mark">“</span>
                <input
                  type="text"
                  name="intro"
                  value={formData.intro}
                  onChange={handleChange}
                  className="mgmt-edit-input"
                  placeholder="의뢰인에게 보여질 신뢰감 있는 한 줄 소개를 적어주세요."
                  style={{
                    fontStyle: "italic",
                    border: "none",
                    background: "transparent",
                    padding: "0",
                    fontSize: "16px",
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* ── 2. 그리드 레이아웃 (경력 & 사무소 설정) ── */}
        <div className="ld-grid">
          {/* 왼쪽: 경력 작성 */}
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
                style={{ lineHeight: "1.8", border: "none", padding: "0" }}
              />
            </section>
          </div>

          {/* 오른쪽: 사무소 정보 및 저장 버튼 */}
          <aside className="ld-sticky-sidebar">
            <section className="ld-card">
              <div className="ld-card-eyebrow">CONTACT & FEE</div>
              <h2 className="ld-card-title">상담 및 위치 설정</h2>

              <dl className="ld-contact-list">
                <div className="ld-contact-item">
                  <dt>자격번호 (수정불가)</dt>
                  <dd>{readOnlyData.licenseNo}</dd>
                </div>
                <div className="ld-contact-item">
                  <dt>사무소 주소</dt>
                  <dd>
                    <input
                      type="text"
                      name="officeAddr"
                      value={formData.officeAddr}
                      onChange={handleChange}
                      className="mgmt-edit-input"
                      placeholder="상세 주소를 입력하세요"
                    />
                  </dd>
                </div>
              </dl>

              <div className="ld-fee-box">
                <span className="ld-fee-label">30분 기준 상담료</span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <input
                    type="number"
                    name="consultFee"
                    value={formData.consultFee}
                    onChange={handleChange}
                    className="mgmt-edit-input"
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      textAlign: "right",
                      width: "150px",
                    }}
                  />
                  <span className="ld-fee-value">원</span>
                </div>
              </div>

              <div className="ld-actions">
                <button type="submit" className="ld-btn-reserve">
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
