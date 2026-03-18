// src/pages/member/LawyerJoinFormPage.jsx
/**
 * 파일 위치: src/pages/member/LawyerJoinFormPage.jsx
 * 수정사항: 변호사 사무소 주소 입력칸을 2개로 간소화하고, 자격증 다중 파일 업로드 시 파일 목록 확인 및 미리보기(클릭) 기능이 추가되었습니다.
 * 추가수정: 주요 전문 분야를 직접 입력하는 방식에서 버튼 다중 선택 방식으로 변경되었으며, 인라인 스타일을 CSS로 분리했습니다.
 */
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";
import { memberApi } from "../../api/memberApi.js";
import { validateId, validatePassword } from "../../utils/validationUtil.js";
import "../../styles/member/LawyerJoinFormPage.css";

// 💡 전문 분야 카테고리 배열 ("전체" 제외)
const SPECIALTIES = ["민사", "형사", "가사", "이혼", "노동", "행정", "기업", "부동산"];

const useLawyerJoinStore = create((set) => ({
  formData: {
    loginId: "",
    password: "",
    passwordConfirm: "",
    name: "",
    phone1: "010",
    phone2: "",
    phone3: "",
    emailId: "",
    emailDomain: "naver.com",
    licenseNumber: "",
    officeName: "",
    specialty: "", // 💡 쉼표(,)로 연결된 문자열로 저장됨
    officeAddress: "",
    officeDetailAddress: "",
  },
  isIdChecked: false,
  checkedId: "",
  setFormData: (updates) =>
    set((state) => ({ formData: { ...state.formData, ...updates } })),
  setIdChecked: (checked, id) => set({ isIdChecked: checked, checkedId: id }),
  resetForm: () =>
    set({
      formData: {
        loginId: "",
        password: "",
        passwordConfirm: "",
        name: "",
        phone1: "010",
        phone2: "",
        phone3: "",
        emailId: "",
        emailDomain: "naver.com",
        licenseNumber: "",
        officeName: "",
        specialty: "",
        officeAddress: "",
        officeDetailAddress: "",
      },
      isIdChecked: false,
      checkedId: "",
    }),
}));

const LawyerJoinFormPage = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    isIdChecked,
    checkedId,
    setIdChecked,
    resetForm,
  } = useLawyerJoinStore();
  const [idError, setIdError] = useState("");
  const [idSuccess, setIdSuccess] = useState("");
  const [files, setFiles] = useState([]); // 💡 파일 다중 업로드용 상태

  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
    if (name === "loginId") {
      setIdChecked(false, "");
      setIdSuccess("");
      setIdError("");
    }
  };

  // 💡 전문 분야 다중 선택 토글 핸들러
  const handleSpecialtyToggle = (spec) => {
    let currentList = formData.specialty ? formData.specialty.split(",") : [];
    
    if (currentList.includes(spec)) {
      currentList = currentList.filter((item) => item !== spec); // 이미 선택되어 있으면 제거
    } else {
      currentList.push(spec); // 선택되어 있지 않으면 추가
    }
    
    setFormData({ specialty: currentList.join(",") });
  };

  // 💡 여러 파일을 선택할 때 기존 파일에 추가되도록 수정
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  // 💡 선택한 파일 목록에서 특정 파일을 제거하는 기능
  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handlePhone2Change = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setFormData({ phone2: val });
    if (val.length === 4) phone3Ref.current.focus();
  };
  const handlePhone3Change = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setFormData({ phone3: val });
  };

  const handleCheckId = async () => {
    if (!validateId(formData.loginId)) {
      setIdError("아이디는 4~20자의 영문 소문자, 숫자만 가능합니다.");
      return;
    }
    try {
      const res = await memberApi.checkId(formData.loginId);
      if (res.data.available) {
        setIdSuccess("사용 가능한 아이디입니다.");
        setIdError("");
        setIdChecked(true, formData.loginId);
      } else {
        setIdError("이미 사용 중인 아이디입니다.");
        setIdSuccess("");
        setIdChecked(false, "");
      }
    } catch (error) {
      setIdError("중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isIdChecked || formData.loginId !== checkedId)
      return alert("아이디 중복 확인을 해주세요.");
    if (!validatePassword(formData.password))
      return alert(
        "비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.",
      );
    if (formData.password !== formData.passwordConfirm)
      return alert("비밀번호가 일치하지 않습니다.");
    if (
      !formData.name ||
      !formData.phone2 ||
      !formData.phone3 ||
      !formData.emailId ||
      !formData.licenseNumber ||
      !formData.officeName ||
      !formData.specialty ||
      !formData.officeAddress
    )
      return alert("필수 정보를 모두 입력해주세요.");

    const phone = `${formData.phone1}-${formData.phone2}-${formData.phone3}`;
    const email = `${formData.emailId}@${formData.emailDomain}`;

    const submitData = new FormData();
    submitData.append("loginId", formData.loginId);
    submitData.append("password", formData.password);
    submitData.append("memberType", "LAWYER");
    submitData.append("name", formData.name);
    submitData.append("phone", phone);
    submitData.append("email", email);
    submitData.append("provider", "LOCAL");
    submitData.append("licenseNo", formData.licenseNumber);
    submitData.append("officeName", formData.officeName);
    submitData.append("specialty", formData.specialty);
    submitData.append("officeAddress", formData.officeAddress);
    submitData.append("officeDetailAddr", formData.officeDetailAddress);

    // 선택된 파일들을 순회하며 Append
    files.forEach((file) => {
      submitData.append("files", file);
    });

    try {
      const res = await memberApi.join(submitData);
      if (res.data.success) {
        resetForm();
        navigate("/member/lawyer/complete");
      }
    } catch (error) {
      alert("전문회원 가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="lawyer-join-container">
      <JoinStepIndicator currentStep={2} />
      <h2 className="lawyer-join-title">전문회원 정보 입력</h2>

      <form onSubmit={handleSubmit}>
        <div className="lawyer-join-section">1. 기본 정보</div>
        <div className="lawyer-join-group">
          <label className="lawyer-join-label">아이디</label>
          <div className="lawyer-join-flex-row">
            <input
              type="text"
              name="loginId"
              value={formData.loginId}
              onChange={handleChange}
              placeholder="4~20자 영문, 숫자"
              className="lawyer-join-input"
            />
            <button
              type="button"
              onClick={handleCheckId}
              className="lawyer-join-btn-secondary"
            >
              중복 확인
            </button>
          </div>
          {idError && <div className="lawyer-join-error">{idError}</div>}
          {idSuccess && <div className="lawyer-join-success">{idSuccess}</div>}
        </div>

        <div className="lawyer-join-group">
          <label className="lawyer-join-label">비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="8~20자 영문, 숫자, 특수문자"
            className="lawyer-join-input"
          />
        </div>
        <div className="lawyer-join-group">
          <label className="lawyer-join-label">비밀번호 확인</label>
          <input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            placeholder="비밀번호 다시 입력"
            className="lawyer-join-input"
          />
        </div>
        <div className="lawyer-join-group">
          <label className="lawyer-join-label">이름 (실명)</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="실명 입력"
            className="lawyer-join-input"
          />
        </div>

        <div className="lawyer-join-group">
          <label className="lawyer-join-label">휴대전화</label>
          <div className="lawyer-join-flex-row">
            <select
              name="phone1"
              value={formData.phone1}
              onChange={handleChange}
              className="lawyer-join-select"
            >
              <option value="010">010</option>
              <option value="011">011</option>
              <option value="016">016</option>
            </select>
            <span>-</span>
            <input
              type="text"
              ref={phone2Ref}
              value={formData.phone2}
              onChange={handlePhone2Change}
              maxLength={4}
              className="lawyer-join-input"
              style={{ textAlign: "center" }}
            />
            <span>-</span>
            <input
              type="text"
              ref={phone3Ref}
              value={formData.phone3}
              onChange={handlePhone3Change}
              maxLength={4}
              className="lawyer-join-input"
              style={{ textAlign: "center" }}
            />
          </div>
        </div>

        <div className="lawyer-join-group">
          <label className="lawyer-join-label">이메일</label>
          <div className="lawyer-join-flex-row">
            <input
              type="text"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              placeholder="이메일 아이디"
              className="lawyer-join-input"
            />
            <span>@</span>
            <select
              name="emailDomain"
              value={formData.emailDomain}
              onChange={handleChange}
              className="lawyer-join-select"
            >
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="kakao.com">kakao.com</option>
            </select>
          </div>
        </div>

        <div className="lawyer-join-section">2. 전문가 정보</div>
        <div className="lawyer-join-group">
          <label className="lawyer-join-label">변호사 자격 입력</label>
          <input
            type="text"
            name="licenseNumber"
            placeholder="자격 입력"
            value={formData.licenseNumber}
            onChange={handleChange}
            className="lawyer-join-input"
          />
        </div>
        <div className="lawyer-join-group">
          <label className="lawyer-join-label">소속 법무법인 / 사무소명</label>
          <input
            type="text"
            name="officeName"
            placeholder="소속 입력"
            value={formData.officeName}
            onChange={handleChange}
            className="lawyer-join-input"
          />
        </div>
        
        {/* 💡 CSS로 스타일을 분리한 전문 분야 다중 선택 버튼 UI */}
        <div className="lawyer-join-group">
          <label className="lawyer-join-label">주요 전문 분야 (다중 선택 가능)</label>
          <div className="lawyer-join-specialty-container">
            {SPECIALTIES.map((spec) => {
              const isSelected = formData.specialty ? formData.specialty.split(",").includes(spec) : false;
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

        <div className="lawyer-join-group">
          <label className="lawyer-join-label">사무소 기본 주소</label>
          <input
            type="text"
            name="officeAddress"
            value={formData.officeAddress}
            onChange={handleChange}
            placeholder="예: 서울시 서초구 서초대로"
            className="lawyer-join-input"
          />
        </div>
        <div className="lawyer-join-group">
          <label className="lawyer-join-label">사무소 상세 주소</label>
          <input
            type="text"
            name="officeDetailAddress"
            value={formData.officeDetailAddress}
            onChange={handleChange}
            placeholder="예: 대법원빌딩 3층"
            className="lawyer-join-input"
          />
        </div>

        <div className="lawyer-join-group">
          <label className="lawyer-join-label">
            변호사 자격증 증빙서류 (다중 선택 가능)
          </label>
          <input
            type="file"
            name="files"
            multiple
            onChange={handleFileChange}
            className="lawyer-join-file-input"
            id="lawyer-file-upload"
          />
          <div style={{ fontSize: "12px", color: "#888", marginTop: "5px" }}>
            ※ 파일을 여러 개 추가로 선택할 수 있습니다.
          </div>

          {files.length > 0 && (
            <ul className="lawyer-join-file-list">
              {files.map((file, index) => {
                const fileUrl = URL.createObjectURL(file);
                return (
                  <li key={index} className="lawyer-join-file-item">
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                      📄 {file.name}
                    </a>
                    <button
                      type="button"
                      className="lawyer-join-file-remove"
                      onClick={() => handleRemoveFile(index)}
                      title="파일 삭제"
                    >
                      ✖
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <button type="submit" className="lawyer-join-btn-primary">
          가입 신청하기
        </button>
      </form>
    </div>
  );
};
export default LawyerJoinFormPage;