/**
 * 파일 위치: src/pages/member/LawyerJoinFormPage.jsx
 * 수정사항: 
 * 1. 전문 분야 카테고리 고정 (8개)
 * 2. 자격증 증빙서류 미첨부 시 400 에러 방지를 위한 필수 첨부 검증 로직 추가
 */
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";
import { memberApi } from "../../api/memberApi.js";
import { validateId, validatePassword } from "../../utils/validationUtil.js";
import "../../styles/member/LawyerJoinFormPage.css";

// 💡 [수정] 요청하신 8개 카테고리로 완벽 고정
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
    specialty: "",
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
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
    if (name === "loginId") {
      setIdChecked(false, "");
      setIdSuccess("");
      setIdError("");
      if (errors.loginIdCheck) setErrors((prev) => ({ ...prev, loginIdCheck: false }));
    }
  };

  const handleSpecialtyToggle = (spec) => {
    let currentList = formData.specialty ? formData.specialty.split(",") : [];
    if (currentList.includes(spec)) {
      currentList = currentList.filter((item) => item !== spec);
    } else {
      currentList.push(spec);
    }
    setFormData({ specialty: currentList.join(",") });
    if (errors.specialty) setErrors((prev) => ({ ...prev, specialty: false }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handlePhone2Change = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setFormData({ phone2: val });
    if (errors.phone2) setErrors((prev) => ({ ...prev, phone2: false }));
    if (val.length === 4) phone3Ref.current.focus();
  };
  const handlePhone3Change = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setFormData({ phone3: val });
    if (errors.phone3) setErrors((prev) => ({ ...prev, phone3: false }));
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
        if (errors.loginIdCheck) setErrors((prev) => ({ ...prev, loginIdCheck: false }));
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
    const newErrors = {};
    if (!formData.loginId) newErrors.loginId = true;
    if (!isIdChecked || formData.loginId !== checkedId) newErrors.loginIdCheck = true;
    if (!formData.password) newErrors.password = true;
    if (!formData.passwordConfirm) newErrors.passwordConfirm = true;
    if (!formData.name) newErrors.name = true;
    if (!formData.phone2) newErrors.phone2 = true;
    if (!formData.phone3) newErrors.phone3 = true;
    if (!formData.emailId) newErrors.emailId = true;
    if (!formData.licenseNumber) newErrors.licenseNumber = true;
    if (!formData.officeName) newErrors.officeName = true;
    if (!formData.specialty) newErrors.specialty = true;
    if (!formData.officeAddress) newErrors.officeAddress = true;
    if (!formData.officeDetailAddress) newErrors.officeDetailAddress = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("필수 항목을 모두 확인해주세요.");
      return;
    }

    if (!validatePassword(formData.password))
      return alert("비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.");
    if (formData.password !== formData.passwordConfirm)
      return alert("비밀번호가 일치하지 않습니다.");

    // 💡 400 Bad Request 방지용 파일 유무 검증 로직
    if (files.length === 0) {
      return alert("자격증 증빙서류를 최소 1개 이상 업로드해주세요.");
    }

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

    files.forEach((file) => { submitData.append("files", file); });

    try {
      const res = await memberApi.join(submitData);
      if (res.data.success) {
        resetForm();
        navigate("/member/lawyer/complete");
      }
    } catch (error) {
      console.error(error);
      alert("전문회원 가입 중 오류가 발생했습니다. (파일 용량이 크면 실패할 수 있습니다)");
    }
  };

  return (
    <div className="lawyer-join-container">
      <JoinStepIndicator currentStep={2} />
      <h2 className="lawyer-join-title">전문회원 정보 입력</h2>

      <form onSubmit={handleSubmit}>
        <div className="lawyer-join-section">1. 기본 정보</div>
        <div className="lawyer-join-group">
          <label className={`lawyer-join-label ${errors.loginId || errors.loginIdCheck ? "error" : ""}`}>
            아이디 {errors.loginIdCheck ? "[중복 확인 필요]" : (errors.loginId ? "[아이디 입력]" : "")}
          </label>
          <div className="lawyer-join-flex-row">
            <input
              type="text"
              name="loginId"
              value={formData.loginId}
              onChange={handleChange}
              placeholder="4~20자 영문, 숫자"
              className={`lawyer-join-input ${errors.loginId ? "input-error" : ""}`}
            />
            <button
              type="button"
              onClick={handleCheckId}
              className={`lawyer-join-btn-secondary ${errors.loginIdCheck ? "btn-error" : ""}`}
            >
              중복 확인
            </button>
          </div>
          {idError && <div className="lawyer-join-error">{idError}</div>}
          {idSuccess && <div className="lawyer-join-success">{idSuccess}</div>}
        </div>

        <div className="lawyer-join-group">
          <label className={`lawyer-join-label ${errors.password ? "error" : ""}`}>
            비밀번호 {errors.password && "[비밀번호 입력]"}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="8~20자 영문, 숫자, 특수문자"
            className={`lawyer-join-input ${errors.password ? "input-error" : ""}`}
          />
        </div>
        <div className="lawyer-join-group">
          <label className={`lawyer-join-label ${errors.passwordConfirm ? "error" : ""}`}>
            비밀번호 확인 {errors.passwordConfirm && "[비밀번호 다시 입력]"}
          </label>
          <input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            placeholder="비밀번호 다시 입력"
            className={`lawyer-join-input ${errors.passwordConfirm ? "input-error" : ""}`}
          />
        </div>
        <div className="lawyer-join-group">
          <label className={`lawyer-join-label ${errors.name ? "error" : ""}`}>
            이름 (실명) {errors.name && "[실명 입력]"}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="실명 입력"
            className={`lawyer-join-input ${errors.name ? "input-error" : ""}`}
          />
        </div>

        <div className="lawyer-join-group">
          <label className={`lawyer-join-label ${errors.phone2 || errors.phone3 ? "error" : ""}`}>
            휴대전화 {(errors.phone2 || errors.phone3) && "[전화번호 입력]"}
          </label>
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
              className={`lawyer-join-input ${errors.phone2 ? "input-error" : ""}`}
              style={{ textAlign: "center" }}
            />
            <span>-</span>
            <input
              type="text"
              ref={phone3Ref}
              value={formData.phone3}
              onChange={handlePhone3Change}
              maxLength={4}
              className={`lawyer-join-input ${errors.phone3 ? "input-error" : ""}`}
              style={{ textAlign: "center" }}
            />
          </div>
        </div>

        <div className="lawyer-join-group">
          <label className={`lawyer-join-label ${errors.emailId ? "error" : ""}`}>
            이메일 {errors.emailId && "[이메일 아이디 입력]"}
          </label>
          <div className="lawyer-join-flex-row">
            <input
              type="text"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              placeholder="이메일 아이디"
              className={`lawyer-join-input ${errors.emailId ? "input-error" : ""}`}
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
          <label className={`lawyer-join-label ${errors.licenseNumber ? "error" : ""}`}>
            변호사 자격 입력 {errors.licenseNumber && "[자격번호 입력]"}
          </label>
          <input
            type="text"
            name="licenseNumber"
            placeholder="자격 입력"
            value={formData.licenseNumber}
            onChange={handleChange}
            className={`lawyer-join-input ${errors.licenseNumber ? "input-error" : ""}`}
          />
        </div>
        <div className="lawyer-join-group">
          <label className={`lawyer-join-label ${errors.officeName ? "error" : ""}`}>
            소속 법무법인 / 사무소명 {errors.officeName && "[소속명 입력]"}
          </label>
          <input
            type="text"
            name="officeName"
            placeholder="소속 입력"
            value={formData.officeName}
            onChange={handleChange}
            className={`lawyer-join-input ${errors.officeName ? "input-error" : ""}`}
          />
        </div>
        
        <div className="lawyer-join-group">
          <label className={`lawyer-join-label ${errors.specialty ? "error" : ""}`}>
            주요 전문 분야 (다중 선택 가능) {errors.specialty && "[분야 선택]"}
          </label>
          <div className="lawyer-join-specialty-container">
            {SPECIALTIES.map((spec) => {
              const isSelected = formData.specialty ? formData.specialty.split(",").includes(spec) : false;
              return (
                <button
                  type="button"
                  key={spec}
                  onClick={() => handleSpecialtyToggle(spec)}
                  className={`lawyer-join-specialty-btn ${isSelected ? "active" : ""} ${errors.specialty ? "btn-error" : ""}`}
                >
                  {spec}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lawyer-join-group">
          <label className={`lawyer-join-label ${errors.officeAddress ? "error" : ""}`}>
            사무소 기본 주소 {errors.officeAddress && "[기본 주소 입력]"}
          </label>
          <input
            type="text"
            name="officeAddress"
            value={formData.officeAddress}
            onChange={handleChange}
            placeholder="예: 서울시 서초구 서초대로"
            className={`lawyer-join-input ${errors.officeAddress ? "input-error" : ""}`}
          />
        </div>
        
        <div className="lawyer-join-group">
          <label className={`lawyer-join-label ${errors.officeDetailAddress ? "error" : ""}`}>
            사무소 상세 주소 {errors.officeDetailAddress && "[상세 주소 입력]"}
          </label>
          <input
            type="text"
            name="officeDetailAddress"
            value={formData.officeDetailAddress}
            onChange={handleChange}
            placeholder="예: 대법원빌딩 3층"
            className={`lawyer-join-input ${errors.officeDetailAddress ? "input-error" : ""}`}
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