// src/pages/member/LawyerJoinFormPage.jsx
/**
 * 파일 위치: src/pages/member/LawyerJoinFormPage.jsx
 * 기능전체: 변호사 전문 회원가입 화면입니다. 아이디 중복 확인 기능이 추가되었습니다.
 * 수정사항: 기존의 전문가 정보 입력 필드를 유지하며, 아이디 중복 체크 로직을 동일하게 적용했습니다.
 */

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "zustand"; 
import JoinStepIndicator from "../../components/member/JoinStepIndicator";
import { memberApi } from "../../api/memberApi";

// --- [Zustand Store] 전문 회원가입 데이터 관리 스토어 ---
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
    specialty: ""
  },
  // 💡 중복 확인 상태 관리 추가
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
      emailId: "", emailDomain: "naver.com",
      licenseNumber: "", officeName: "", specialty: ""
    },
    isIdChecked: false,
    checkedId: ""
  })
}));

const inputStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "4px", flex: 1, minWidth: 0, boxSizing: "border-box" };
const selectStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "4px", flex: 1, boxSizing: "border-box" };
const checkBtnStyle = { padding: "12px 15px", backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: "bold", whiteSpace: "nowrap" };

const LawyerJoinFormPage = () => {
  const navigate = useNavigate();
  const { formData, setFormData, resetForm, isIdChecked, checkedId, setIdChecked } = useLawyerJoinStore();

  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
    if (name === "loginId") {
      setIdChecked(false, ""); // 아이디 수정 시 중복 확인 리셋
    }
  };

  // 💡 아이디 중복 확인 핸들러
  const handleCheckId = async () => {
    if (formData.loginId.length < 4) {
      return alert("아이디는 4자 이상이어야 합니다.");
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
      alert("중복 확인 처리 중 오류가 발생했습니다.");
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
    
    // 💡 필수 체크: 중복 확인 여부 검증
    if (!isIdChecked || formData.loginId !== checkedId) {
      return alert("아이디 중복 확인을 진행해주세요.");
    }

    const fullPhone = `${formData.phone1}${formData.phone2}${formData.phone3}`;
    const fullEmail = `${formData.emailId}@${formData.emailDomain}`;

    if (formData.password !== formData.passwordConfirm) return alert("비밀번호가 일치하지 않습니다.");
    if (fullPhone.length < 10) return alert("유효한 전화번호를 모두 입력해주세요.");
    if (!formData.emailId) return alert("이메일 아이디를 입력해주세요.");

    try {
      const submitData = {
        loginId: formData.loginId,
        password: formData.password,
        name: formData.name,
        phone: fullPhone,
        email: fullEmail,
        licenseNo: formData.licenseNumber, 
        officeName: formData.officeName,
        specialty: formData.specialty,
        memberType: "LAWYER"
      };

      await memberApi.join(submitData);
      resetForm();
      navigate("/member/lawyer/complete.do");
    } catch (error) {
      // 💡 실제 에러 사유를 출력하도록 수정
      console.error("전문 회원가입 실패:", error.response?.data);
      const errorMsg = error.response?.data?.message || "서버 통신 중 오류가 발생했습니다.";
      alert(`가입 신청 실패: ${errorMsg}`);
    }
  };

  const isPasswordMatch = formData.passwordConfirm && formData.password === formData.passwordConfirm;
  const isPasswordMismatch = formData.passwordConfirm && formData.password !== formData.passwordConfirm;

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px" }}>
      <JoinStepIndicator currentStep={2} />
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>전문회원 정보 입력</h2>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        <h4 style={{ margin: "10px 0 0 0", color: "#333" }}>기본 정보</h4>
        <div>
          <label style={{ fontSize: "13px", color: "#666", marginBottom: "5px", display: "block" }}>아이디</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input type="text" name="loginId" placeholder="아이디" value={formData.loginId} onChange={handleChange} required style={inputStyle} />
            <button type="button" onClick={handleCheckId} style={checkBtnStyle}>중복 확인</button>
          </div>
          {isIdChecked && formData.loginId === checkedId && (
            <span style={{ fontSize: "12px", color: "#28a745", marginTop: "5px", display: "block" }}>✅ 사용 가능한 아이디입니다.</span>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "13px", color: "#666", marginBottom: "5px", display: "block" }}>비밀번호</label>
            <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required style={{...inputStyle, width: "100%"}} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "13px", color: "#666", marginBottom: "5px", display: "block" }}>비밀번호 확인</label>
            <input type="password" name="passwordConfirm" placeholder="확인" value={formData.passwordConfirm} onChange={handleChange} required style={{...inputStyle, width: "100%"}} />
          </div>
        </div>
        {isPasswordMatch && <span style={{ fontSize: "12px", color: "#28a745" }}>✅ 비밀번호가 일치합니다.</span>}
        {isPasswordMismatch && <span style={{ fontSize: "12px", color: "#dc3545" }}>❌ 비밀번호가 일치하지 않습니다.</span>}

        <div>
          <label style={{ fontSize: "13px", color: "#666", marginBottom: "5px", display: "block" }}>변호사명 (실명)</label>
          <input type="text" name="name" placeholder="이름 입력" value={formData.name} onChange={handleChange} required style={{...inputStyle, width: "100%"}} />
        </div>
        
        <div>
          <label style={{ fontSize: "13px", color: "#666", marginBottom: "5px", display: "block" }}>연락처</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="text" value={formData.phone1} onChange={handlePhone1Change} maxLength={3} style={{ ...inputStyle, textAlign: "center" }} />
            <span>-</span>
            <input type="text" ref={phone2Ref} value={formData.phone2} onChange={handlePhone2Change} maxLength={4} style={{ ...inputStyle, textAlign: "center" }} />
            <span>-</span>
            <input type="text" ref={phone3Ref} value={formData.phone3} onChange={handlePhone3Change} maxLength={4} style={{ ...inputStyle, textAlign: "center" }} />
          </div>
        </div>

        <div>
          <label style={{ fontSize: "13px", color: "#666", marginBottom: "5px", display: "block" }}>이메일</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="text" name="emailId" placeholder="아이디" value={formData.emailId} onChange={handleChange} style={inputStyle} />
            <span>@</span>
            <select name="emailDomain" value={formData.emailDomain} onChange={handleChange} style={selectStyle}>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="daum.net">daum.net</option>
              <option value="kakao.com">kakao.com</option>
              <option value="hanmail.net">hanmail.net</option>
            </select>
          </div>
        </div>

        <hr style={{ margin: "15px 0", border: "none", borderTop: "1px dashed #ddd" }} />
        
        <h4 style={{ margin: "0", color: "#333" }}>전문가 정보</h4>
        <div>
          <label style={{ fontSize: "13px", color: "#666", marginBottom: "5px", display: "block" }}>변호사 자격번호</label>
          <input type="text" name="licenseNumber" placeholder="자격번호 입력" value={formData.licenseNumber} onChange={handleChange} required style={{...inputStyle, width: "100%"}} />
        </div>
        <div>
          <label style={{ fontSize: "13px", color: "#666", marginBottom: "5px", display: "block" }}>소속 법무법인 / 사무소명</label>
          <input type="text" name="officeName" placeholder="소속 입력" value={formData.officeName} onChange={handleChange} required style={{...inputStyle, width: "100%"}} />
        </div>
        <div>
          <label style={{ fontSize: "13px", color: "#666", marginBottom: "5px", display: "block" }}>주요 전문 분야</label>
          <input type="text" name="specialty" placeholder="예: 형사, 이혼, 민사" value={formData.specialty} onChange={handleChange} required style={{...inputStyle, width: "100%"}} />
        </div>
        
        <button type="submit" style={{ padding: "14px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", marginTop: "15px", cursor: "pointer" }}>
          가입 신청하기
        </button>
      </form>
    </div>
  );
};

export default LawyerJoinFormPage;