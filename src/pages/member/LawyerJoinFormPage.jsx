// vs코드
// 파일 위치: src/pages/member/LawyerJoinFormPage.jsx
// 설명: 전문(변호사) 회원가입 정보 입력 화면

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";
import { memberApi } from "../../api/memberApi.js";

const LawyerJoinFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    loginId: "", password: "", name: "", phone: "", licenseNumber: "", officeName: "", specialty: "" 
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await memberApi.join({ ...formData, memberType: "LAWYER" });
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
        <input type="text" name="loginId" placeholder="아이디" onChange={handleChange} required style={inputStyle} />
        <input type="password" name="password" placeholder="비밀번호" onChange={handleChange} required style={inputStyle} />
        <input type="text" name="name" placeholder="변호사명 (실명)" onChange={handleChange} required style={inputStyle} />
        <input type="text" name="phone" placeholder="연락처 (- 제외)" onChange={handleChange} required style={inputStyle} />
        
        <hr style={{ margin: "10px 0", borderTop: "1px dashed #ccc" }} />
        
        <h4 style={{ margin: "0 0 -5px 0", color: "#666" }}>전문가 정보</h4>
        <input type="text" name="licenseNumber" placeholder="변호사 자격번호" onChange={handleChange} required style={inputStyle} />
        <input type="text" name="officeName" placeholder="소속 법무법인 / 법률사무소명" onChange={handleChange} required style={inputStyle} />
        <input type="text" name="specialty" placeholder="주요 전문 분야 (예: 형사, 이혼)" onChange={handleChange} required style={inputStyle} />
        
        <button type="submit" style={{ padding: "14px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", marginTop: "10px" }}>
          가입 신청하기
        </button>
      </form>
    </div>
  );
};

const inputStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "4px" };

export default LawyerJoinFormPage;