// vs코드
// 파일 위치: src/pages/member/JoinFormPage.jsx
// 설명: 일반 회원가입 정보 입력 화면

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";
import { memberApi } from "../../api/memberApi.js";
import { validateId, validatePassword, validatePhone } from "../../utils/validationUtil.js";

const JoinFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ loginId: "", password: "", passwordConfirm: "", name: "", phone: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateId(formData.loginId)) return alert("아이디는 영문, 숫자 조합 4자 이상이어야 합니다.");
    if (!validatePassword(formData.password)) return alert("비밀번호는 4자 이상이어야 합니다.");
    if (formData.password !== formData.passwordConfirm) return alert("비밀번호가 일치하지 않습니다.");
    if (!validatePhone(formData.phone)) return alert("유효한 전화번호를 입력해주세요.");

    try {
      await memberApi.join({ ...formData, memberType: "PERSONAL" });
      navigate("/member/join/complete.do");
    } catch (error) {
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px" }}>
      <JoinStepIndicator currentStep={2} />
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>일반회원 정보 입력</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input type="text" name="loginId" placeholder="아이디 (4자 이상)" value={formData.loginId} onChange={handleChange} required style={inputStyle} />
        <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required style={inputStyle} />
        <input type="password" name="passwordConfirm" placeholder="비밀번호 확인" value={formData.passwordConfirm} onChange={handleChange} required style={inputStyle} />
        <input type="text" name="name" placeholder="실명" value={formData.name} onChange={handleChange} required style={inputStyle} />
        <input type="text" name="phone" placeholder="휴대폰 번호 (- 제외)" value={formData.phone} onChange={handleChange} required style={inputStyle} />
        <button type="submit" style={{ padding: "14px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", marginTop: "10px" }}>가입 완료하기</button>
      </form>
    </div>
  );
};

const inputStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "4px" };

export default JoinFormPage;