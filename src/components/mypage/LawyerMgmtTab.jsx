// src/components/mypage/LawyerMgmtTab.jsx
import React, { useState, useEffect, useRef } from "react";
import lawyerApi from "../../api/lawyerApi";
import { useAuthStore } from "../../store/authStore.js";
import { DEFAULT_IMAGE } from "../../pages/lawyer/LawyerListPage";
import "../../styles/mypage/LawyerMgmtTab.css";
// 💡 LawyerDetailPage의 레이아웃과 CSS를 그대로 활용하기 위해 import 합니다.
import "../../styles/lawyer/LawyerDetailPage.css";
import { baseURL } from "../../constants/baseURL.js";

// 💡 선택 가능한 전체 전문 분야 리스트
const SPECIALTIES = [
  "민사",
  "형사",
  "가사",
  "이혼",
  "노동",
  "행정",
  "기업",
  "부동산",
];

const LawyerMgmtTab = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [lawyerId, setLawyerId] = useState(null);

  // 프로필 사진 관련 상태
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(DEFAULT_IMAGE);

  // 읽기 전용 정보 (이름, 이메일, 전화번호, 자격번호, 평점, 후기수)
  const [readOnlyData, setReadOnlyData] = useState({
    name: user.name || "이름 없음",
    email: user.email || "-",
    phone: user.phone || "-",
    licenseNo: user.licenseNo || "-",
    avgRating: 0.0,
    reviewCnt: 0,
  });

  // 수정 가능한 정보
  const [formData, setFormData] = useState({
    officeName: "",
    officeAddr: "",
    specialty: "", // 서버에서 받아온 쉼표 구분 문자열
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

        const path =
          data.savePath ||
          data.profileUrl ||
          data.profileImage ||
          data.imagePath ||
          data.imageUrl;
        if (path) {
          setPreviewImg(path.startsWith("http") ? path : baseURL + path);
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

  // 💡 전문 분야 클릭 토글 핸들러 (다중 선택)
  const handleSpecToggle = (spec) => {
    let currentList = formData.specialty
      ? formData.specialty
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== "")
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

      if (selectedFile) {
        const fileData = new FormData();
        fileData.append("file", selectedFile);
        await lawyerApi.uploadProfileImage(lawyerId, fileData);
      }

      await lawyerApi.updateLawyer(lawyerId, formData);
      alert("변호사 프로필 및 상담 설정이 성공적으로 저장되었습니다!");
    } catch (err) {
      console.error(err);
      alert("정보 저장에 실패했습니다. (API 연동 확인 필요)");
    }
  };

  if (loading) {
    return (
      <div className="detail-status-msg">
        변호사 정보를 불러오는 중입니다...
      </div>
    );
  }

  const selectedList = formData.specialty
    ? formData.specialty.split(",").map((s) => s.trim())
    : [];

  const isDefaultImg = previewImg === DEFAULT_IMAGE;

  return (
    <div
      className="lawyer-mgmt-wrapper lawyer-detail-page"
      style={{
        padding: "0",
        minHeight: "auto",
        backgroundColor: "transparent",
      }}
    >
      <h3
        className="mgmt-content-title"
        style={{
          fontSize: "24px",
          fontWeight: "800",
          color: "#1e293b",
          marginBottom: "20px",
        }}
      >
        프로필 및 상담 관리
      </h3>
      <div className="mgmt-info-notice">
        💡 아래 입력하신 내용과 디자인 그대로 실제 '전문 변호사 찾기' 상세
        페이지에 노출됩니다.
      </div>

      <form
        onSubmit={handleSubmit}
        className="lawyer-detail-container"
        style={{ padding: "0", maxWidth: "100%" }}
      >
        {/* 1. 헤더 섹션: 상세 페이지(LawyerDetailPage) 레이아웃 적용 */}
        <section
          className="detail-header-card"
          style={{ position: "relative" }}
        >
          <div className="header-flex">
            {/* 프로필 이미지 */}
            <div
              className="detail-img-wrapper mgmt-img-box-edit"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={previewImg}
                alt={readOnlyData.name}
                className={isDefaultImg ? "default-avatar" : "real-profile"}
                onError={(e) => {
                  e.target.src = DEFAULT_IMAGE;
                }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
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

            {/* 메인 정보 (이름, 전문분야, 사무소, 평점) */}
            <div className="detail-main-info" style={{ flex: 1 }}>
              {/* 전문 분야 다중 선택 버튼 그룹 */}
              <div style={{ marginBottom: "15px" }}>
                <label className="mgmt-label-small">
                  주요 전문 분야 (다중 선택)
                </label>
                <div className="mgmt-spec-group">
                  {SPECIALTIES.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => handleSpecToggle(spec)}
                      className={`mgmt-spec-btn ${selectedList.includes(spec) ? "active" : ""}`}
                    >
                      {spec} 전문
                    </button>
                  ))}
                </div>
              </div>

              <h1 className="lawyer-fullname" style={{ margin: "0 0 10px 0" }}>
                {readOnlyData.name} <span className="title-suffix">변호사</span>
              </h1>

              <div style={{ marginBottom: "15px", maxWidth: "400px" }}>
                <label className="mgmt-label-small">
                  사무소 / 법무법인 이름
                </label>
                <input
                  type="text"
                  name="officeName"
                  value={formData.officeName}
                  onChange={handleChange}
                  className="mgmt-edit-input"
                  placeholder="예: OO법무법인"
                  style={{ padding: "10px 14px" }}
                />
              </div>

              <div className="rating-summary">
                <span className="star-icon">★</span>
                <span className="rating-score">
                  {readOnlyData.avgRating
                    ? readOnlyData.avgRating.toFixed(1)
                    : "0.0"}
                </span>
                <span className="review-count">
                  ({readOnlyData.reviewCnt || 0}개의 후기)
                </span>
              </div>
            </div>
          </div>

          {/* 핵심 한 줄 소개 */}
          <div
            className="intro-text-box"
            style={{
              marginTop: "30px",
              paddingTop: "25px",
              borderTop: "1px solid #f1f5f9",
            }}
          >
            <label
              className="mgmt-label-small"
              style={{ textAlign: "left", marginBottom: "8px" }}
            >
              핵심 한 줄 소개
            </label>
            <input
              type="text"
              name="intro"
              value={formData.intro}
              onChange={handleChange}
              className="mgmt-edit-input"
              placeholder="의뢰인의 마음을 사로잡을 핵심 소개글을 적어주세요."
              style={{
                fontStyle: "italic",
                textAlign: "center",
                fontSize: "16px",
                padding: "12px",
              }}
            />
          </div>
        </section>

        {/* 2. 상세 정보 영역 (그리드) */}
        <div className="detail-content-grid">
          {/* 왼쪽: 경력 */}
          <div className="content-left">
            <section className="info-section">
              <h3 className="section-title">주요 경력 작성</h3>
              <textarea
                name="career"
                value={formData.career}
                onChange={handleChange}
                className="mgmt-edit-textarea"
                placeholder="주요 경력 사항을 줄바꿈하여 자세히 작성해주세요."
                rows={10}
                style={{ width: "100%", height: "250px" }}
              />
            </section>
          </div>

          {/* 오른쪽: 연락처 및 정보 테이블 */}
          <div className="content-right">
            <section className="contact-card">
              <h3 className="section-title">사무소 정보 설정</h3>
              <div className="contact-info-list">
                <div className="contact-item">
                  <label>자격번호</label>
                  <span>{readOnlyData.licenseNo}</span>
                </div>
                <div className="contact-item">
                  <label>이메일</label>
                  <span>{readOnlyData.email}</span>
                </div>
                <div className="contact-item">
                  <label>연락처</label>
                  <span>{readOnlyData.phone}</span>
                </div>

                <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                  <label className="mgmt-label-small">사무소 주소</label>
                  <input
                    type="text"
                    name="officeAddr"
                    value={formData.officeAddr}
                    onChange={handleChange}
                    className="mgmt-edit-input"
                    placeholder="사무실 상세 주소를 입력해주세요"
                  />
                </div>

                <div className="fee-divider"></div>

                <div
                  className="contact-item fee-item"
                  style={{ alignItems: "center" }}
                >
                  <label>
                    기본 상담료
                    <br />
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        fontWeight: "normal",
                      }}
                    >
                      (30분 기준)
                    </span>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="number"
                      name="consultFee"
                      value={formData.consultFee}
                      onChange={handleChange}
                      className="mgmt-edit-input"
                      style={{
                        width: "120px",
                        textAlign: "right",
                        color: "#2563eb",
                        fontWeight: "700",
                        fontSize: "18px",
                      }}
                      min="0"
                      step="10000"
                    />
                    <span style={{ fontWeight: "700", color: "#1e293b" }}>
                      원
                    </span>
                  </div>
                </div>
              </div>

              <div className="sticky-actions">
                {/* 💡 저장 버튼을 우측 하단 액션 영역에 배치하여 동선 최적화 */}
                <button
                  type="submit"
                  className="btn-reserve"
                  style={{ width: "100%" }}
                >
                  프로필 및 상담 설정 저장하기
                </button>
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LawyerMgmtTab;
