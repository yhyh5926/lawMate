// src/pages/member/JoinFormPage.jsx
/**
 * 파일 위치: src/pages/member/JoinFormPage.jsx
 * 수정사항: 일반 회원의 주소, 상세주소 입력 필드가 추가되었습니다.
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
    loginId: "", password: "", passwordConfirm: "", name: "",
    phone1: "010", phone2: "", phone3: "", emailId: "", emailDomain: "naver.com",
    address: "", detailAddress: ""
  },
  isIdChecked: false, checkedId: "",
  setFormData: (updates) => set((state) => ({ formData: { ...state.formData, ...updates } })),
  setIdChecked: (checked, id) => set({ isIdChecked: checked, checkedId: id }),
  resetForm: () => set({
    formData: {
      loginId: "", password: "", passwordConfirm: "", name: "",
      phone1: "010", phone2: "", phone3: "", emailId: "", emailDomain: "naver.com",
      address: "", detailAddress: ""
    },
    isIdChecked: false, checkedId: ""
  })
}));

const JoinFormPage = () => {
  const navigate = useNavigate();
  const { formData, setFormData, isIdChecked, checkedId, setIdChecked, resetForm } = useJoinFormStore();
  const [idError, setIdError] = useState("");
  const [idSuccess, setIdSuccess] = useState("");
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
    if (name === "loginId") { setIdChecked(false, ""); setIdSuccess(""); setIdError(""); }
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
      setIdError("아이디는 4~20자의 영문 소문자, 숫자만 사용 가능합니다.");
      return;
    }
    try {
      const res = await memberApi.checkId(formData.loginId);
      if (res.data.available) {
        setIdSuccess("사용 가능한 아이디입니다."); setIdError(""); setIdChecked(true, formData.loginId);
      } else {
        setIdError("이미 사용 중인 아이디입니다."); setIdSuccess(""); setIdChecked(false, "");
      }
    } catch (error) { setIdError("중복 확인 중 오류가 발생했습니다."); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isIdChecked || formData.loginId !== checkedId) return alert("아이디 중복 확인을 해주세요.");
    if (!validatePassword(formData.password)) return alert("비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.");
    if (formData.password !== formData.passwordConfirm) return alert("비밀번호가 일치하지 않습니다.");
    if (!formData.name || !formData.phone2 || !formData.phone3 || !formData.emailId) return alert("모든 정보를 입력해주세요.");

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
        navigate("/member/join/complete.do");
      }
    } catch (error) { alert("회원가입 중 오류가 발생했습니다."); }
  };

  return (
    <div className="join-container">
      <JoinStepIndicator currentStep={2} />
      <h2 className="join-title">일반회원 정보 입력</h2>

      <form onSubmit={handleSubmit}>
        <div className="join-form-group">
          <label className="join-label">아이디</label>
          <div className="join-flex-row">
            <input type="text" name="loginId" value={formData.loginId} onChange={handleChange} placeholder="4~20자 영문, 숫자" className="join-input" />
            <button type="button" onClick={handleCheckId} className="join-btn-secondary">중복 확인</button>
          </div>
          {idError && <div className="join-error-text">{idError}</div>}
          {idSuccess && <div className="join-success-text">{idSuccess}</div>}
        </div>

        <div className="join-form-group"><label className="join-label">비밀번호</label><input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="8~20자 영문, 숫자, 특수문자" className="join-input" /></div>
        <div className="join-form-group"><label className="join-label">비밀번호 확인</label><input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} placeholder="비밀번호 다시 입력" className="join-input" /></div>
        <div className="join-form-group"><label className="join-label">이름</label><input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="실명 입력" className="join-input" /></div>

        <div className="join-form-group">
          <label className="join-label">휴대전화</label>
          <div className="join-flex-row">
            <select name="phone1" value={formData.phone1} onChange={handleChange} className="join-select">
              <option value="010">010</option><option value="011">011</option><option value="016">016</option>
            </select>
            <span>-</span>
            <input type="text" ref={phone2Ref} value={formData.phone2} onChange={handlePhone2Change} maxLength={4} className="join-input" style={{ textAlign: "center" }} />
            <span>-</span>
            <input type="text" ref={phone3Ref} value={formData.phone3} onChange={handlePhone3Change} maxLength={4} className="join-input" style={{ textAlign: "center" }} />
          </div>
        </div>

        <div className="join-form-group">
          <label className="join-label">이메일</label>
          <div className="join-flex-row">
            <input type="text" name="emailId" value={formData.emailId} onChange={handleChange} placeholder="이메일 아이디" className="join-input" />
            <span>@</span>
            <select name="emailDomain" value={formData.emailDomain} onChange={handleChange} className="join-select">
              <option value="naver.com">naver.com</option><option value="gmail.com">gmail.com</option><option value="kakao.com">kakao.com</option>
            </select>
          </div>
        </div>

        <div className="join-form-group"><label className="join-label">기본 주소</label><input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="예: 서울시 강남구 테헤란로" className="join-input" /></div>
        <div className="join-form-group"><label className="join-label">상세 주소</label><input type="text" name="detailAddress" value={formData.detailAddress} onChange={handleChange} placeholder="예: 101동 202호" className="join-input" /></div>

        <button type="submit" className="join-btn-primary">가입하기</button>
      </form>
    </div>
  );
};
export default JoinFormPage;