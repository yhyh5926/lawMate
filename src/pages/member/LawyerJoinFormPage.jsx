// src/pages/member/LawyerJoinFormPage.jsx
// 설명: 변호사 등 전문 회원가입 화면입니다. 
// Zustand를 사용하여 입력 데이터를 전역적으로 관리하며, 전화번호 자동 포커스, 
// 이메일 도메인 선택, 비밀번호 실시간 일치 확인 기능을 제공합니다.
// 컴파일 오류 수정을 위해 import 경로의 확장자를 제거했습니다.

import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "zustand"; // Zustand 임포트
import JoinStepIndicator from "../../components/member/JoinStepIndicator";
import { memberApi } from "../../api/memberApi";

// --- [Zustand Store] 전문 회원가입 데이터 관리 스토어 ---
const useLawyerJoinStore = create((set) => ({
  formData: {
    loginId: "",
    password: "",
    passwordConfirm: "", // 비밀번호 확인 필드 추가
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
  // 데이터 업데이트 액션
  setFormData: (updates) => set((state) => ({
    formData: { ...state.formData, ...updates }
  })),
  // 폼 초기화 액션
  resetForm: () => set({
    formData: {
      loginId: "", password: "", passwordConfirm: "", name: "",
      phone1: "010", phone2: "", phone3: "",
      emailId: "", emailDomain: "naver.com",
      licenseNumber: "", officeName: "", specialty: ""
    }
  })
}));

const inputStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "4px", flex: 1, minWidth: 0, boxSizing: "border-box" };
const selectStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "4px", flex: 1, boxSizing: "border-box" };

const LawyerJoinFormPage = () => {
  const navigate = useNavigate();
  
  // Zustand 스토어에서 상태와 액션 가져오기
  const { formData, setFormData, resetForm } = useLawyerJoinStore();

  // 자동 포커스 이동을 위한 Refs
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  const handleChange = (e) => setFormData({ [e.target.name]: e.target.value });

  // 전화번호 자동 포커스 로직
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
    
    const fullPhone = `${formData.phone1}${formData.phone2}${formData.phone3}`;
    const fullEmail = `${formData.emailId}@${formData.emailDomain}`;

    // 간단한 유효성 검사
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
        licenseNumber: formData.licenseNumber,
        officeName: formData.officeName,
        specialty: formData.specialty,
        memberType: "LAWYER"
      };

      await memberApi.join(submitData);
      resetForm(); // 가입 성공 시 스토어 초기화
      navigate("/member/lawyer/complete.do");
    } catch (error) {
      console.error("전문 회원가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  // 실시간 비밀번호 체크 상태
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
          <input type="text" name="loginId" placeholder="아이디" value={formData.loginId} onChange={handleChange} required style={{...inputStyle, width: "100%"}} />
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
        
        {/* 전화번호 UI */}
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

        {/* 이메일 UI */}
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