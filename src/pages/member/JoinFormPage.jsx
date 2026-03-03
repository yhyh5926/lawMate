// src/pages/member/JoinFormPage.jsx
/**
 * 파일 위치: src/pages/member/JoinFormPage.jsx
 * 수정사항: 회원가입 시 provider: "LOCAL" 데이터를 명시적으로 추가하여 500 에러를 해결했습니다.
 */

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";
import { memberApi } from "../../api/memberApi.js";
import { validateId, validatePassword } from "../../utils/validationUtil.js";

// --- [Zustand] 회원가입 입력 폼 전용 스토어 ---
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
    emailDomain: "naver.com"
  },
  isIdChecked: false, 
  checkedId: "",

  setFormData: (updates) => set((state) => ({
    formData: { ...state.formData, ...updates }
  })),
  setIdChecked: (checked, id) => set({ isIdChecked: checked, checkedId: id }),
  resetForm: () => set({
    formData: {
      loginId: "", password: "", passwordConfirm: "", name: "",
      phone1: "010", phone2: "", phone3: "",
      emailId: "", emailDomain: "naver.com"
    },
    isIdChecked: false,
    checkedId: ""
  })
}));

const inputStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "4px", flex: 1, minWidth: 0, boxSizing: "border-box" };
const selectStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "4px", flex: 1, boxSizing: "border-box" };
const checkBtnStyle = { padding: "12px 15px", backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: "bold", whiteSpace: "nowrap" };

const JoinFormPage = () => {
  const navigate = useNavigate();
  const { formData, setFormData, resetForm, isIdChecked, checkedId, setIdChecked } = useJoinFormStore();

  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
    if (name === "loginId") {
      setIdChecked(false, "");
    }
  };

  const handleCheckId = async () => {
    if (!validateId(formData.loginId)) {
      return alert("아이디는 영문, 숫자 조합 4자 이상이어야 합니다.");
    }
    try {
      const response = await memberApi.checkId(formData.loginId);
      if (response.data.available) {
        alert("사용 가능한 아이디입니다.");
        setIdChecked(true, formData.loginId);
      } else {
        alert("이미 사용 중인 아이디입니다.");
        setIdChecked(false, "");
      }
    } catch (error) {
      alert("중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handlePhone1Change = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setFormData({ phone1: val });
    if (val.length === 3) phone2Ref.current.focus();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isIdChecked || formData.loginId !== checkedId) {
      return alert("아이디 중복 확인을 완료해주세요.");
    }

    const fullPhone = `${formData.phone1}${formData.phone2}${formData.phone3}`;
    const fullEmail = `${formData.emailId}@${formData.emailDomain}`;

    if (!validateId(formData.loginId)) return alert("아이디는 영문, 숫자 조합 4자 이상이어야 합니다.");
    if (!validatePassword(formData.password)) return alert("비밀번호는 4자 이상이어야 합니다.");
    if (formData.password !== formData.passwordConfirm) return alert("비밀번호가 일치하지 않습니다.");
    if (fullPhone.length < 10) return alert("전화번호를 정확히 입력해주세요.");

    const submitData = {
      loginId: formData.loginId,
      password: formData.password,
      name: formData.name,
      phone: fullPhone,
      email: fullEmail,
      memberType: "PERSONAL",
      provider: "LOCAL" // 💡 500 에러 방지를 위해 명시적으로 추가
    };

    try {
      const response = await memberApi.join(submitData);
      if (response.data.success) {
        alert("회원가입이 완료되었습니다!");
        resetForm();
        navigate("/member/join/complete.do");
      }
    } catch (error) {
      console.error("가입 실패 로그:", error.response?.data);
      const errorMsg = error.response?.data?.message || "서버 통신 중 오류가 발생했습니다.";
      alert(`가입 신청 실패: ${errorMsg}`);
    }
  };

  const isPasswordMatch = formData.passwordConfirm && formData.password === formData.passwordConfirm;
  const isPasswordMismatch = formData.passwordConfirm && formData.password !== formData.passwordConfirm;

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px" }}>
      <JoinStepIndicator currentStep={2} />
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>일반회원 정보 입력</h2>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label style={{ fontSize: "14px", color: "#555", marginBottom: "5px", display: "block" }}>아이디</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input type="text" name="loginId" placeholder="아이디" value={formData.loginId} onChange={handleChange} required style={inputStyle} />
            <button type="button" onClick={handleCheckId} style={checkBtnStyle}>중복 확인</button>
          </div>
          {isIdChecked && formData.loginId === checkedId && (
            <span style={{ fontSize: "12px", color: "#28a745", marginTop: "5px", display: "block" }}>✅ 사용 가능한 아이디입니다.</span>
          )}
        </div>

        <div>
          <label style={{ fontSize: "14px", color: "#555", marginBottom: "5px", display: "block" }}>비밀번호</label>
          <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required style={{...inputStyle, width: "100%"}} />
        </div>
        
        <div>
          <label style={{ fontSize: "14px", color: "#555", marginBottom: "5px", display: "block" }}>비밀번호 확인</label>
          <input type="password" name="passwordConfirm" placeholder="비밀번호 확인" value={formData.passwordConfirm} onChange={handleChange} required style={{...inputStyle, width: "100%"}} />
          {isPasswordMatch && <span style={{ fontSize: "12px", color: "#28a745", marginTop: "5px", display: "block" }}>✅ 일치합니다.</span>}
          {isPasswordMismatch && <span style={{ fontSize: "12px", color: "#dc3545", marginTop: "5px", display: "block" }}>❌ 일치하지 않습니다.</span>}
        </div>
        
        <div>
          <label style={{ fontSize: "14px", color: "#555", marginBottom: "5px", display: "block" }}>이름</label>
          <input type="text" name="name" placeholder="실명" value={formData.name} onChange={handleChange} required style={{...inputStyle, width: "100%"}} />
        </div>
        
        <div>
          <label style={{ fontSize: "14px", color: "#555", marginBottom: "5px", display: "block" }}>휴대폰 번호</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="text" value={formData.phone1} onChange={handlePhone1Change} maxLength={3} style={{ ...inputStyle, textAlign: "center" }} />
            <span>-</span>
            <input type="text" ref={phone2Ref} value={formData.phone2} onChange={handlePhone2Change} maxLength={4} style={{ ...inputStyle, textAlign: "center" }} />
            <span>-</span>
            <input type="text" ref={phone3Ref} value={formData.phone3} onChange={handlePhone3Change} maxLength={4} style={{ ...inputStyle, textAlign: "center" }} />
          </div>
        </div>

        <div>
          <label style={{ fontSize: "14px", color: "#555", marginBottom: "5px", display: "block" }}>이메일</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="text" name="emailId" value={formData.emailId} onChange={handleChange} placeholder="아이디" style={inputStyle} />
            <span>@</span>
            <select name="emailDomain" value={formData.emailDomain} onChange={handleChange} style={selectStyle}>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="kakao.com">kakao.com</option>
            </select>
          </div>
        </div>

        <button type="submit" style={{ padding: "14px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", marginTop: "20px", cursor: "pointer" }}>
          가입 완료하기
        </button>
      </form>
    </div>
  );
};

export default JoinFormPage;