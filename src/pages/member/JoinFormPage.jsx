/**
 * 파일 위치: src/pages/member/JoinFormPage.jsx
 * 수정사항: 기본 주소뿐만 아니라 상세 주소(detailAddress)까지 빈칸 검증 및 빨간색 하이라이트 로직을 적용했습니다.
 */
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";
import { memberApi } from "../../api/memberApi.js";
import { validateId, validatePassword } from "../../utils/validationUtil.js";
import "../../styles/member/JoinFormPage.css";

const useJoinFormStore = create((set) => ({
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
    address: "",
    detailAddress: "",
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
        address: "",
        detailAddress: "",
      },
      isIdChecked: false,
      checkedId: "",
    }),
}));

const JoinFormPage = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    isIdChecked,
    checkedId,
    setIdChecked,
    resetForm,
  } = useJoinFormStore();
  const [idError, setIdError] = useState("");
  const [idSuccess, setIdSuccess] = useState("");
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
      if (errors.loginIdCheck)
        setErrors((prev) => ({ ...prev, loginIdCheck: false }));
    }
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
      setIdError("아이디는 4~20자의 영문 소문자, 숫자만 사용 가능합니다.");
      return;
    }
    try {
      const res = await memberApi.checkId(formData.loginId);
      if (res.data.available) {
        setIdSuccess("사용 가능한 아이디입니다.");
        setIdError("");
        setIdChecked(true, formData.loginId);
        if (errors.loginIdCheck)
          setErrors((prev) => ({ ...prev, loginIdCheck: false }));
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
    if (!isIdChecked || formData.loginId !== checkedId)
      newErrors.loginIdCheck = true;
    if (!formData.password) newErrors.password = true;
    if (!formData.passwordConfirm) newErrors.passwordConfirm = true;
    if (!formData.name) newErrors.name = true;
    if (!formData.phone2) newErrors.phone2 = true;
    if (!formData.phone3) newErrors.phone3 = true;
    if (!formData.emailId) newErrors.emailId = true;
    if (!formData.address) newErrors.address = true;
    // 💡 상세 주소 검증 추가
    if (!formData.detailAddress) newErrors.detailAddress = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("필수 항목을 모두 확인해주세요.");
      return;
    }

    if (!validatePassword(formData.password))
      return alert(
        "비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.",
      );
    if (formData.password !== formData.passwordConfirm)
      return alert("비밀번호가 일치하지 않습니다.");

    const phone = `${formData.phone1}-${formData.phone2}-${formData.phone3}`;
    const email = `${formData.emailId}@${formData.emailDomain}`;

    const submitData = new FormData();
    submitData.append("loginId", formData.loginId);
    submitData.append("password", formData.password);
    submitData.append("memberType", "PERSONAL");
    submitData.append("name", formData.name);
    submitData.append("phone", phone);
    submitData.append("email", email);
    submitData.append("provider", "LOCAL");
    submitData.append("address", formData.address);
    submitData.append("detailAddress", formData.detailAddress);

    try {
      const res = await memberApi.join(submitData);
      if (res.data.success) {
        resetForm();
        navigate("/member/join/complete");
      }
    } catch (error) {
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="join-container">
      <JoinStepIndicator currentStep={2} />
      <h2 className="join-title">일반회원 정보 입력</h2>

      <form onSubmit={handleSubmit}>
        <div className="join-form-group">
          <label
            className={`join-label ${errors.loginId || errors.loginIdCheck ? "error" : ""}`}
          >
            아이디{" "}
            {errors.loginIdCheck
              ? "[중복 확인 필요]"
              : errors.loginId
                ? "[아이디 입력]"
                : ""}
          </label>
          <div className="join-flex-row">
            <input
              type="text"
              name="loginId"
              value={formData.loginId}
              onChange={handleChange}
              placeholder="4~20자 영문, 숫자"
              className={`join-input ${errors.loginId ? "input-error" : ""}`}
            />
            <button
              type="button"
              onClick={handleCheckId}
              className={`join-btn-secondary ${errors.loginIdCheck ? "btn-error" : ""}`}
            >
              중복 확인
            </button>
          </div>
          {idError && <div className="join-error-text">{idError}</div>}
          {idSuccess && <div className="join-success-text">{idSuccess}</div>}
        </div>

        <div className="join-form-group">
          <label className={`join-label ${errors.password ? "error" : ""}`}>
            비밀번호 {errors.password && "[비밀번호 입력]"}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="8~20자 영문, 숫자, 특수문자"
            className={`join-input ${errors.password ? "input-error" : ""}`}
          />
        </div>
        <div className="join-form-group">
          <label
            className={`join-label ${errors.passwordConfirm ? "error" : ""}`}
          >
            비밀번호 확인 {errors.passwordConfirm && "[비밀번호 다시 입력]"}
          </label>
          <input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            placeholder="비밀번호 다시 입력"
            className={`join-input ${errors.passwordConfirm ? "input-error" : ""}`}
          />
        </div>
        <div className="join-form-group">
          <label className={`join-label ${errors.name ? "error" : ""}`}>
            이름 {errors.name && "[실명 입력]"}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="실명 입력"
            className={`join-input ${errors.name ? "input-error" : ""}`}
          />
        </div>

        <div className="join-form-group">
          <label
            className={`join-label ${errors.phone2 || errors.phone3 ? "error" : ""}`}
          >
            휴대전화 {(errors.phone2 || errors.phone3) && "[전화번호 입력]"}
          </label>
          <div className="join-flex-row">
            <select
              name="phone1"
              value={formData.phone1}
              onChange={handleChange}
              className="join-select"
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
              className={`join-input ${errors.phone2 ? "input-error" : ""}`}
              style={{ textAlign: "center" }}
            />
            <span>-</span>
            <input
              type="text"
              ref={phone3Ref}
              value={formData.phone3}
              onChange={handlePhone3Change}
              maxLength={4}
              className={`join-input ${errors.phone3 ? "input-error" : ""}`}
              style={{ textAlign: "center" }}
            />
          </div>
        </div>

        <div className="join-form-group">
          <label className={`join-label ${errors.emailId ? "error" : ""}`}>
            이메일 {errors.emailId && "[이메일 아이디 입력]"}
          </label>
          <div className="join-flex-row">
            <input
              type="text"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              placeholder="이메일 아이디"
              className={`join-input ${errors.emailId ? "input-error" : ""}`}
            />
            <span>@</span>
            <select
              name="emailDomain"
              value={formData.emailDomain}
              onChange={handleChange}
              className="join-select"
            >
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="kakao.com">kakao.com</option>
            </select>
          </div>
        </div>

        <div className="join-form-group">
          <label className={`join-label ${errors.address ? "error" : ""}`}>
            기본 주소 {errors.address && "[주소 입력]"}
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="예: 서울시 강남구 테헤란로"
            className={`join-input ${errors.address ? "input-error" : ""}`}
          />
        </div>

        {/* 💡 상세 주소 라벨 및 인풋에 에러 하이라이트 적용 */}
        <div className="join-form-group">
          <label
            className={`join-label ${errors.detailAddress ? "error" : ""}`}
          >
            상세 주소 {errors.detailAddress && "[상세 주소 입력]"}
          </label>
          <input
            type="text"
            name="detailAddress"
            value={formData.detailAddress}
            onChange={handleChange}
            placeholder="예: 101동 202호"
            className={`join-input ${errors.detailAddress ? "input-error" : ""}`}
          />
        </div>

        <button type="submit" className="join-btn-primary">
          가입하기
        </button>
      </form>
    </div>
  );
};
export default JoinFormPage;
