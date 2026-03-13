// src/pages/member/SocialJoinFormPage.jsx

import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { memberApi } from "../../api/memberApi.js";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";
import "../../styles/member/SocialJoinFormPage.css";

const GOOGLE_CLIENT_ID =
  "244554224995-kcgsjp47k8flns89ldv9stpfga219kut.apps.googleusercontent.com";

// 💡 [추가] 전문 분야 카테고리 목록
const SPECIALTIES_LIST = ["민사", "형사", "가사", "행정", "헌법", "기업법무", "세무", "국제", "기타"];

const SocialJoinContent = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(useLocation().search);
  const memberType = queryParams.get("type") || "PERSONAL";

  const [googleUser, setGoogleUser] = useState(null);
  const [formData, setFormData] = useState({
    loginId: "",
    name: "",
    phone1: "010",
    phone2: "",
    phone3: "",
    address: "",
    detailAddress: "",
    licenseNo: "",
    officeName: "",
    specialty: "", // 💡 선택된 카테고리들이 문자열로 저장됩니다.
    officeAddress: "",
    officeDetailAddress: "",
  });
  const [files, setFiles] = useState([]);

  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        ).then((res) => res.json());

        const generatedLoginId = userInfo.email.split("@")[0];

        // 💡 [유지] 구글 연동 즉시 가입 여부 확인 (중복 가입 방지)
        const checkRes = await memberApi.checkId(generatedLoginId);
        if (!checkRes.data.available) {
          alert("이미 가입된 구글 계정입니다. 로그인 페이지로 이동합니다.");
          navigate("/member/login");
          return;
        }

        setGoogleUser({ email: userInfo.email, googleId: userInfo.sub });
        setFormData((prev) => ({
          ...prev,
          name: memberType === "PERSONAL" ? userInfo.name : "",
          loginId: generatedLoginId,
        }));
      } catch (error) {
        alert("구글 정보 로드 실패");
      }
    },
    onError: () => alert("구글 연동 실패"),
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhoneChange = (e, nextRef, field) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setFormData({ ...formData, [field]: val });
    if (val.length === 4 && nextRef) nextRef.current.focus();
  };

  // 💡 [추가] 전문 분야 선택 토글 로직
  const handleSpecialtyToggle = (spec) => {
    let currentList = formData.specialty ? formData.specialty.split(",") : [];
    if (currentList.includes(spec)) {
      currentList = currentList.filter((item) => item !== spec);
    } else {
      currentList.push(spec);
    }
    setFormData({ ...formData, specialty: currentList.join(",") });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!googleUser) return alert("먼저 구글 계정을 연동해주세요.");
    if (!formData.name || !formData.phone2 || !formData.phone3)
      return alert("기본 정보를 모두 입력해주세요.");

    const phone = `${formData.phone1}-${formData.phone2}-${formData.phone3}`;
    const submitData = new FormData();
    submitData.append("loginId", formData.loginId);
    submitData.append("password", googleUser.googleId); // 💡 rawPassword null(500에러) 방지
    submitData.append("memberType", memberType);
    submitData.append("name", formData.name);
    submitData.append("phone", phone);
    submitData.append("email", googleUser.email);
    submitData.append("provider", "GOOGLE");

    if (memberType === "PERSONAL") {
      submitData.append("address", formData.address);
      submitData.append("detailAddress", formData.detailAddress);
    } else if (memberType === "LAWYER") {
      if (
        !formData.licenseNo ||
        !formData.officeName ||
        !formData.specialty ||
        !formData.officeAddress
      ) {
        return alert("전문가 필수 정보를 모두 입력해주세요.");
      }
      submitData.append("licenseNo", formData.licenseNo);
      submitData.append("officeName", formData.officeName);
      submitData.append("specialty", formData.specialty);
      submitData.append("officeAddress", formData.officeAddress);
      submitData.append("officeDetailAddr", formData.officeDetailAddress);
      files.forEach((file) => submitData.append("files", file));
    }

    try {
      // 💡 [유지] 가입은 반드시 socialJoin API를 호출해야 에러가 나지 않습니다.
      const res = await memberApi.socialJoin(submitData);
      if (res.data.success) {
        navigate(
          memberType === "PERSONAL"
            ? "/member/join/complete"
            : "/member/lawyer/complete",
        );
      }
    } catch (error) {
      alert("소셜 가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="social-join-container">
      <JoinStepIndicator currentStep={2} />
      <h2 className="social-join-title">구글 연동 정보 입력</h2>

      {!googleUser ? (
        <button
          type="button"
          onClick={() => handleGoogleAuth()}
          className="social-join-btn-google"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="G"
            style={{ width: "20px" }}
          />
          구글 계정 연동하기
        </button>
      ) : (
        <div className="social-join-info-box">
          ✅ <strong>{googleUser.email}</strong> 계정이 연동되었습니다.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: googleUser ? "block" : "none" }}
      >
        <div className="social-join-group">
          <label className="social-join-label">아이디</label>
          <input
            type="text"
            name="loginId"
            value={formData.loginId}
            readOnly
            className="social-join-input"
            style={{ backgroundColor: "#f9f9f9" }}
          />
        </div>
        <div className="social-join-group">
          <label className="social-join-label">
            이름 {memberType === "LAWYER" && "(실명 필수)"}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="실명을 입력해주세요"
            className="social-join-input"
          />
        </div>

        <div className="social-join-group">
          <label className="social-join-label">연락처</label>
          <div className="social-join-flex-row">
            <input
              type="text"
              value={formData.phone1}
              readOnly
              className="social-join-input"
              style={{
                flex: 1,
                textAlign: "center",
                backgroundColor: "#f9f9f9",
              }}
            />
            <span>-</span>
            <input
              type="text"
              name="phone2"
              value={formData.phone2}
              onChange={(e) => handlePhoneChange(e, phone3Ref, "phone2")}
              maxLength={4}
              className="social-join-input"
              style={{ flex: 1, textAlign: "center" }}
            />
            <span>-</span>
            <input
              type="text"
              name="phone3"
              ref={phone3Ref}
              value={formData.phone3}
              onChange={(e) => handlePhoneChange(e, null, "phone3")}
              maxLength={4}
              className="social-join-input"
              style={{ flex: 1, textAlign: "center" }}
            />
          </div>
        </div>

        {memberType === "PERSONAL" ? (
          <>
            <div className="social-join-group">
              <label className="social-join-label">기본 주소</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="예: 서울시 강남구 테헤란로"
                className="social-join-input"
              />
            </div>
            <div className="social-join-group">
              <label className="social-join-label">상세 주소</label>
              <input
                type="text"
                name="detailAddress"
                value={formData.detailAddress}
                onChange={handleChange}
                placeholder="예: 101동 202호"
                className="social-join-input"
              />
            </div>
          </>
        ) : (
          <div className="expert-info-divider">
            <div className="expert-info-title">전문가 필수 정보</div>
            
            <div className="social-join-group">
              <label className="social-join-label">변호사 자격번호</label>
              <input
                type="text"
                name="licenseNo"
                value={formData.licenseNo}
                onChange={handleChange}
                className="social-join-input"
              />
            </div>
            <div className="social-join-group">
              <label className="social-join-label">소속 법무법인 / 사무소명</label>
              <input
                type="text"
                name="officeName"
                value={formData.officeName}
                onChange={handleChange}
                className="social-join-input"
              />
            </div>

            {/* 💡 [변경됨] 전문 분야를 버튼 선택형으로 수정 */}
            <div className="social-join-group">
              <label className="social-join-label">주요 전문 분야 (다중 선택 가능)</label>
              <div className="lawyer-join-specialty-container">
                {SPECIALTIES_LIST.map((spec) => {
                  const isSelected = formData.specialty.split(",").includes(spec);
                  return (
                    <button
                      type="button"
                      key={spec}
                      onClick={() => handleSpecialtyToggle(spec)}
                      className={`lawyer-join-specialty-btn ${isSelected ? "active" : ""}`}
                    >
                      {spec}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="social-join-group">
              <label className="social-join-label">사무소 기본 주소</label>
              <input
                type="text"
                name="officeAddress"
                value={formData.officeAddress}
                onChange={handleChange}
                className="social-join-input"
              />
            </div>
            <div className="social-join-group">
              <label className="social-join-label">사무소 상세 주소</label>
              <input
                type="text"
                name="officeDetailAddress"
                value={formData.officeDetailAddress}
                onChange={handleChange}
                className="social-join-input"
              />
            </div>
            <div className="social-join-group">
              <label className="social-join-label">자격증 증빙서류</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="social-join-file-input"
              />
            </div>
          </div>
        )}
        <button type="submit" className="social-join-btn-primary">
          가입 완료하기
        </button>
      </form>
    </div>
  );
};

const SocialJoinFormPage = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <SocialJoinContent />
  </GoogleOAuthProvider>
);
export default SocialJoinFormPage;