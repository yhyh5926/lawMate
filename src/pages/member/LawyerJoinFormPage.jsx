// src/pages/member/LawyerJoinFormPage.jsx
// 설명: 변호사 등 전문 회원가입 화면입니다.


import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";
import { memberApi } from "../../api/memberApi.js";

const inputStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "4px", flex: 1, minWidth: 0 };
const selectStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "4px", flex: 1 };

const LawyerJoinFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    loginId: "", password: "", name: "", 
    phone1: "010", phone2: "", phone3: "", 
    emailId: "", emailDomain: "naver.com",
    licenseNumber: "", officeName: "", specialty: "" 
  });

  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhone1Change = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setFormData({ ...formData, phone1: val });
    if (val.length === 3) phone2Ref.current.focus();
  };

  const handlePhone2Change = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setFormData({ ...formData, phone2: val });
    if (val.length === 4) phone3Ref.current.focus();
  };

  const handlePhone3Change = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setFormData({ ...formData, phone3: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const fullPhone = `${formData.phone1}${formData.phone2}${formData.phone3}`;
    const fullEmail = `${formData.emailId}@${formData.emailDomain}`;

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
      navigate("/member/lawyer/complete.do");
    } catch (error) {
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px" }}>
      <JoinStepIndicator currentStep={2} />
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>전문회원 정보 입력</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        <h4 style={{ margin: "0 0 -5px 0", color: "#666" }}>기본 정보</h4>
        <input type="text" name="loginId" placeholder="아이디" value={formData.loginId} onChange={handleChange} required style={inputStyle} />
        <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required style={inputStyle} />
        <input type="text" name="name" placeholder="변호사명 (실명)" value={formData.name} onChange={handleChange} required style={inputStyle} />
        
        {/* 전화번호 UI */}
        <div>
          <label style={{ fontSize: "14px", color: "#555", marginBottom: "5px", display: "block" }}>연락처</label>
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
          <label style={{ fontSize: "14px", color: "#555", marginBottom: "5px", display: "block" }}>이메일</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="text" name="emailId" placeholder="이메일 아이디" value={formData.emailId} onChange={handleChange} style={inputStyle} />
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

        <hr style={{ margin: "10px 0", borderTop: "1px dashed #ccc" }} />
        
        <h4 style={{ margin: "0 0 -5px 0", color: "#666" }}>전문가 정보</h4>
        <input type="text" name="licenseNumber" placeholder="변호사 자격번호" value={formData.licenseNumber} onChange={handleChange} required style={inputStyle} />
        <input type="text" name="officeName" placeholder="소속 법무법인 / 법률사무소명" value={formData.officeName} onChange={handleChange} required style={inputStyle} />
        <input type="text" name="specialty" placeholder="주요 전문 분야 (예: 형사, 이혼)" value={formData.specialty} onChange={handleChange} required style={inputStyle} />
        
        <button type="submit" style={{ padding: "14px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", marginTop: "10px", cursor: "pointer" }}>
          가입 신청하기
        </button>
      </form>
    </div>
  );
};

export default LawyerJoinFormPage;