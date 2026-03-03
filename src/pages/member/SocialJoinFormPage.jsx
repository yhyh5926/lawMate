// src/pages/member/SocialJoinFormPage.jsx
/**
 * 파일 위치: src/pages/member/SocialJoinFormPage.jsx
 * 기능: 구글 계정 인증 후 추가 정보를 입력받아 가입을 완료합니다.
 */

import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { memberApi } from "../../api/memberApi.js";
import JoinStepIndicator from "../../components/member/JoinStepIndicator.jsx";

const GOOGLE_CLIENT_ID = "244554224995-kcgsjp47k8flns89ldv9stpfga219kut.apps.googleusercontent.com";

const SocialJoinContent = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(useLocation().search);
  const memberType = queryParams.get("type") || "PERSONAL";

  const [googleUser, setGoogleUser] = useState(null); 
  const [formData, setFormData] = useState({
    name: "",
    phone1: "010", phone2: "", phone3: "",
    licenseNo: "", officeName: "", specialty: ""
  });

  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await res.json();
        setGoogleUser(userInfo);
        setFormData((prev) => ({ ...prev, name: userInfo.name || "" }));
      } catch (err) { alert("구글 인증 정보를 가져오는데 실패했습니다."); }
    },
    onError: () => alert("구글 인증에 실패했습니다.")
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhoneChange = (e, nextRef, field) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (val.length === 4 && nextRef) nextRef.current.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!googleUser) return alert("먼저 구글 계정 인증을 진행해주세요.");
    
    if (memberType === "LAWYER" && !formData.name.trim()) {
      return alert("변호사 가입은 실명 입력이 필수입니다.");
    }

    const fullPhone = `${formData.phone1}${formData.phone2}${formData.phone3}`;
    if (fullPhone.length < 10) return alert("연락처를 정확히 입력해주세요.");

    const submitData = {
      loginId: googleUser.email, 
      email: googleUser.email,
      password: "SOCIAL_PASSWORD_PRESET",
      name: formData.name || googleUser.name,
      phone: fullPhone,
      memberType: memberType,
      provider: "GOOGLE",
      licenseNo: formData.licenseNo,
      officeName: formData.officeName,
      specialty: formData.specialty
    };

    try {
      const response = await memberApi.join(submitData);
      if (response.data.success) {
        alert("구글 회원가입이 완료되었습니다!");
        navigate(memberType === "PERSONAL" ? "/member/join/complete.do" : "/member/lawyer/complete.do");
      }
    } catch (err) { alert("가입 도중 오류가 발생했습니다."); }
  };

  const inputStyle = { width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", fontSize: "14px" };
  const labelStyle = { fontSize: "14px", color: "#555", display: "block", marginBottom: "8px", fontWeight: "600" };

  return (
    <div style={{ maxWidth: "500px", margin: "60px auto", padding: "20px" }}>
      <JoinStepIndicator currentStep={2} />
      <h2 style={{ textAlign: "center", marginBottom: "40px", fontWeight: "bold" }}>
        Google {memberType === "PERSONAL" ? "일반회원" : "전문회원"} 정보 입력
      </h2>

      {!googleUser ? (
        <div style={{ textAlign: "center", padding: "50px 20px", border: "2px dashed #e1e8ed", borderRadius: "12px", backgroundColor: "#f8fafc" }}>
          <p style={{ marginBottom: "25px", color: "#64748b", fontSize: "15px" }}>가입을 위해 구글 계정 인증이 필요합니다.</p>
          <button onClick={() => handleGoogleAuth()} style={{ padding: "12px 30px", backgroundColor: "#fff", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
            Google 인증하기
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <div>
            <label style={labelStyle}>아이디 (구글 이메일)</label>
            <input type="text" value={googleUser.email} disabled style={{ ...inputStyle, backgroundColor: "#f1f5f9" }} />
          </div>

          <div>
            <label style={labelStyle}>이름</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder={memberType === "PERSONAL" && !formData.name ? "구글 닉네임으로 정해집니다" : "실명 입력"} 
              style={inputStyle} 
            />
            {memberType === "LAWYER" && !formData.name.trim() && (
              <span style={{ fontSize: "12px", color: "red", marginTop: "5px", display: "block" }}>실명을 입력해주세요.</span>
            )}
          </div>

          <div>
            <label style={labelStyle}>연락처</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input type="text" value={formData.phone1} readOnly style={{ ...inputStyle, textAlign: "center", flex: 0.8 }} />
              <input type="text" ref={phone2Ref} value={formData.phone2} onChange={(e) => handlePhoneChange(e, phone3Ref, "phone2")} maxLength={4} style={{ ...inputStyle, textAlign: "center", flex: 1 }} />
              <input type="text" ref={phone3Ref} value={formData.phone3} onChange={(e) => handlePhoneChange(e, null, "phone3")} maxLength={4} style={{ ...inputStyle, textAlign: "center", flex: 1 }} />
            </div>
          </div>

          {memberType === "LAWYER" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <input type="text" name="licenseNo" placeholder="변호사 자격번호" onChange={handleChange} required style={inputStyle} />
              <input type="text" name="officeName" placeholder="사무실 위치 (소속)" onChange={handleChange} required style={inputStyle} />
              <input type="text" name="specialty" placeholder="변호 카테고리 (전문분야)" onChange={handleChange} required style={inputStyle} />
            </div>
          )}

          <button type="submit" style={{ padding: "16px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", marginTop: "10px" }}>
            가입 완료하기
          </button>
        </form>
      )}
    </div>
  );
};

const SocialJoinFormPage = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <SocialJoinContent />
  </GoogleOAuthProvider>
);

export default SocialJoinFormPage;